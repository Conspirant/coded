import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music, Play, Pause, SkipForward, SkipBack, Shuffle, Repeat,
  Volume2, VolumeX, ChevronUp, ChevronDown, X, Search
} from 'lucide-react';
import { TRACKS, LANGUAGE_LABELS, type Track, type Language } from '@/data/musicPlayerData';

/* ─── YouTube IFrame API bootstrap ──────────────────── */
let ytApiReady = false;
const ytReadyCbs: (() => void)[] = [];

function ensureYTApi(): Promise<void> {
  return new Promise((resolve) => {
    if (ytApiReady) return resolve();
    ytReadyCbs.push(resolve);
    if (document.getElementById('yt-api-script')) return;
    const s = document.createElement('script');
    s.id = 'yt-api-script';
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
    (window as any).onYouTubeIframeAPIReady = () => {
      ytApiReady = true;
      ytReadyCbs.forEach((cb) => cb());
      ytReadyCbs.length = 0;
    };
  });
}

/* ─── localStorage persistence ──────────────────────── */
const LS = 'kcet_mp';
export type QualityOption = 'auto' | 'hd720' | 'medium' | 'small';
interface Saved { idx: number; vol: number; shuf: boolean; rpt: boolean; lang: Language | 'all'; show: boolean; quality: QualityOption }
const defaults: Saved = { idx: 0, vol: 60, shuf: false, rpt: false, lang: 'all', show: false, quality: 'auto' };

function load(): Saved {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(LS) || '{}') }; } catch { return defaults; }
}
function save(p: Partial<Saved>) {
  try { localStorage.setItem(LS, JSON.stringify({ ...load(), ...p })); } catch { /* */ }
}

/* ═══════════════════════════════════════════════════════
   MusicPlayer — compact floating widget
   ═══════════════════════════════════════════════════════ */
export function MusicPlayer() {
  const init = useRef(load()).current;
  // clamp saved index to valid range (old data may have pointed at removed/invalid tracks)
  if (init.idx < 0 || init.idx >= TRACKS.length) init.idx = 0;

  const [visible, setVisible] = useState(init.show);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(init.idx);
  const [vol, setVol] = useState(init.vol);
  const [shuf, setShuf] = useState(init.shuf);
  const [rpt, setRpt] = useState(init.rpt);
  const [lang, setLang] = useState<Language | 'all'>(init.lang);
  const [quality, setQuality] = useState<QualityOption>(init.quality || 'auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(0);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const ytRef = useRef<any>(null);
  const tick = useRef<ReturnType<typeof setInterval>>();
  const errorSkips = useRef(0); // prevent infinite skip loop

  // refs to avoid stale closures inside YT callbacks
  const idxRef = useRef(idx);
  const shufRef = useRef(shuf);
  const rptRef = useRef(rpt);
  useEffect(() => { idxRef.current = idx; }, [idx]);
  useEffect(() => { shufRef.current = shuf; }, [shuf]);
  useEffect(() => { rptRef.current = rpt; }, [rpt]);

  const track: Track | undefined = TRACKS[idx];

  const filtered = useMemo(() => {
    let list = lang === 'all' ? TRACKS : TRACKS.filter((t) => t.language === lang);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q));
    }
    return list;
  }, [lang, query]);

  /* persist */
  useEffect(() => { save({ idx }); }, [idx]);
  useEffect(() => { save({ vol }); }, [vol]);
  useEffect(() => { save({ shuf }); }, [shuf]);
  useEffect(() => { save({ rpt }); }, [rpt]);
  useEffect(() => { save({ lang }); }, [lang]);
  useEffect(() => { save({ show: visible }); }, [visible]);

  /* ── advance track (uses refs, never stale) ────────── */
  const advance = useCallback((fromError = false) => {
    if (fromError) {
      errorSkips.current++;
      // stop trying after 5 consecutive errors to avoid infinite loop
      if (errorSkips.current > 5) { console.warn('[MusicPlayer] Too many errors, stopping.'); return; }
    } else {
      errorSkips.current = 0;
    }
    if (rptRef.current && !fromError) {
      ytRef.current?.seekTo(0, true);
      ytRef.current?.playVideo();
      return;
    }
    const next = shufRef.current
      ? Math.floor(Math.random() * TRACKS.length)
      : (idxRef.current + 1) % TRACKS.length;
    setIdx(next);
    ytRef.current?.loadVideoById(TRACKS[next].id);
  }, []);

  /* ── init YT player ────────────────────────────────── */
  useEffect(() => {
    if (!visible) return;
    let dead = false;

    ensureYTApi().then(() => {
      if (dead) return;
      const p = new (window as any).YT.Player('yt-mp-frame', {
        width: '1', height: '1',
        videoId: TRACKS[idxRef.current]?.id ?? TRACKS[0].id,
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, rel: 0 },
        events: {
          onReady(e: any) {
            if (dead) return;
            ytRef.current = e.target;
            e.target.setVolume(vol);
            setReady(true);
          },
          onStateChange(e: any) {
            if (dead) return;
            const S = (window as any).YT.PlayerState;
            if (e.data === S.PLAYING) { setPlaying(true); setLoading(false); }
            else if (e.data === S.PAUSED) setPlaying(false);
            else if (e.data === S.BUFFERING) setLoading(true);
            else if (e.data === S.ENDED) advance();
          },
          onError() { if (!dead) advance(true); },
        },
      });
      return () => { dead = true; p?.destroy?.(); ytRef.current = null; setReady(false); };
    });

    return () => { dead = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  /* ── progress tick ─────────────────────────────────── */
  useEffect(() => {
    if (tick.current) clearInterval(tick.current);
    if (playing && ytRef.current) {
      tick.current = setInterval(() => {
        const p = ytRef.current;
        if (!p) return;
        setPos(p.getCurrentTime?.() ?? 0);
        setDur(p.getDuration?.() ?? 0);
      }, 400);
    }
    return () => { if (tick.current) clearInterval(tick.current); };
  }, [playing]);

  /* ── controls ──────────────────────────────────────── */
  const go = useCallback((i: number) => {
    setIdx(i);
    if (ytRef.current) {
      ytRef.current.loadVideoById(TRACKS[i].id);
      ytRef.current.setPlaybackQuality?.(quality);
    }
    setPos(0);
  }, [quality]);

  const toggle = useCallback(() => {
    if (!ytRef.current) return;
    playing ? ytRef.current.pauseVideo() : ytRef.current.playVideo();
  }, [playing]);

  const next = useCallback(() => {
    const n = shufRef.current ? Math.floor(Math.random() * TRACKS.length) : (idxRef.current + 1) % TRACKS.length;
    go(n);
  }, [go]);

  const prev = useCallback(() => {
    const n = shufRef.current ? Math.floor(Math.random() * TRACKS.length) : (idxRef.current === 0 ? TRACKS.length - 1 : idxRef.current - 1);
    go(n);
  }, [go]);

  const setVolume = useCallback((v: number) => { setVol(v); ytRef.current?.setVolume(v); }, []);
  const seek = useCallback((v: number) => { ytRef.current?.seekTo(v, true); setPos(v); }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const close = () => { setVisible(false); setOpen(false); ytRef.current?.pauseVideo(); setPlaying(false); };

  const langBadge = (l: Language) => {
    const map: Record<Language, string> = {
      hindi: 'bg-orange-500/10 text-orange-400',
      kannada: 'bg-red-500/10 text-red-400',
      english: 'bg-sky-500/10 text-sky-400',
    };
    return map[l];
  };

  /* ═══ Hidden FAB (player closed) ═══ */
  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        title="Music Player"
        className="fixed bottom-20 left-5 z-[9998] w-11 h-11 rounded-full
                   bg-[#1e1e2e] border border-white/[0.08] shadow-lg
                   flex items-center justify-center
                   hover:border-white/20 hover:scale-105 active:scale-95 transition-all"
      >
        <Music className="w-[18px] h-[18px] text-purple-400" />
      </button>
    );
  }

  return (
    <>
      {/* hidden YT iframe — must be in DOM, 1×1 pixel, opacity 0 */}
      <div className="fixed w-px h-px overflow-hidden opacity-0 pointer-events-none" style={{ top: 0, left: 0 }} aria-hidden>
        <div id="yt-mp-frame" />
      </div>

      <AnimatePresence mode="wait">
        {open ? (
          /* ═══ Expanded ═══ */
          <motion.div
            key="exp"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-3 left-3 z-[9999] w-[340px] max-w-[calc(100vw-1.5rem)]
                       rounded-xl border border-white/[0.08] bg-[#161622]/95 backdrop-blur-xl
                       shadow-xl flex flex-col overflow-hidden"
            style={{ maxHeight: 'min(460px, calc(100vh - 5rem))' }}
          >
            {/* header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/[0.06] relative">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-white/80">Music</span>
              </div>
              <div className="flex items-center gap-1">
                {/* Quality selector button */}
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu((p) => !p)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.1] transition-colors flex items-center gap-1"
                    title="Change Audio/Video Quality"
                  >
                    <span>{quality === 'auto' ? 'Auto' : quality === 'hd720' ? 'HD 720p' : quality === 'medium' ? '360p' : '144p Saver'}</span>
                  </button>

                  {showQualityMenu && (
                    <div className="absolute right-0 top-full mt-1.5 w-32 rounded-lg border border-white/[0.1] bg-[#1a1a28] shadow-xl py-1 z-[10000]">
                      <div className="px-2 py-1 text-[9px] font-semibold text-white/30 uppercase tracking-wider">Quality</div>
                      {([
                        { key: 'auto', label: 'Auto (Best)' },
                        { key: 'hd720', label: 'HD (720p)' },
                        { key: 'medium', label: 'Medium (360p)' },
                        { key: 'small', label: '144p (Data Saver)' },
                      ] as const).map((q) => (
                        <button
                          key={q.key}
                          onClick={() => {
                            setQuality(q.key);
                            save({ quality: q.key });
                            ytRef.current?.setPlaybackQuality?.(q.key);
                            setShowQualityMenu(false);
                          }}
                          className={`w-full px-2.5 py-1 text-left text-[11px] flex items-center justify-between transition-colors ${
                            quality === q.key ? 'text-purple-400 bg-white/[0.06] font-medium' : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <span>{q.label}</span>
                          {quality === q.key && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-colors"><ChevronDown className="w-4 h-4" /></button>
                <button onClick={close} className="p-1 rounded hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-colors"><X className="w-4 h-4" /></button>
              </div>
            </div>

            {/* now playing */}
            {track && (
              <div className="px-3.5 pt-3 pb-2">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-11 h-11 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                    {playing ? (
                      <div className="flex items-end gap-[3px] h-4">
                        <span className="w-[3px] rounded-full bg-purple-400 animate-[bar1_.5s_ease_infinite]" />
                        <span className="w-[3px] rounded-full bg-purple-400 animate-[bar2_.5s_ease_infinite_.15s]" />
                        <span className="w-[3px] rounded-full bg-purple-400 animate-[bar3_.5s_ease_infinite_.3s]" />
                      </div>
                    ) : (
                      <Music className="w-4 h-4 text-white/20" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-white/90 truncate">{track.title}</p>
                    <p className="text-[11px] text-white/40 truncate">{track.artist}</p>
                  </div>
                </div>

                {/* seek */}
                <input type="range" min={0} max={dur || 1} value={pos} onChange={(e) => seek(+e.target.value)}
                  className="w-full h-[3px] rounded-full appearance-none cursor-pointer bg-white/[0.08]
                    [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white/70 [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:shadow-none" />
                <div className="flex justify-between text-[10px] text-white/25 mt-0.5 mb-1">
                  <span>{fmt(pos)}</span><span>{fmt(dur)}</span>
                </div>

                {/* transport */}
                <div className="flex items-center justify-center gap-1">
                  <button onClick={() => setShuf((p) => !p)} className={`p-1.5 rounded transition-colors ${shuf ? 'text-purple-400' : 'text-white/25 hover:text-white/50'}`}><Shuffle className="w-3.5 h-3.5" /></button>
                  <button onClick={prev} className="p-1.5 text-white/50 hover:text-white/80 transition-colors"><SkipBack className="w-4 h-4" /></button>
                  <button onClick={toggle} disabled={!ready}
                    className="p-2.5 rounded-full bg-white/[0.08] text-white hover:bg-white/[0.12] disabled:opacity-40 transition-colors mx-1">
                    {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      : playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-[1px]" />}
                  </button>
                  <button onClick={next} className="p-1.5 text-white/50 hover:text-white/80 transition-colors"><SkipForward className="w-4 h-4" /></button>
                  <button onClick={() => setRpt((p) => !p)} className={`p-1.5 rounded transition-colors ${rpt ? 'text-purple-400' : 'text-white/25 hover:text-white/50'}`}><Repeat className="w-3.5 h-3.5" /></button>
                </div>

                {/* volume */}
                <div className="flex items-center gap-2 mt-1.5">
                  <button onClick={() => setVolume(vol === 0 ? 60 : 0)} className="text-white/25 hover:text-white/50 transition-colors">
                    {vol === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <input type="range" min={0} max={100} value={vol} onChange={(e) => setVolume(+e.target.value)}
                    className="flex-1 h-[2px] rounded-full appearance-none cursor-pointer bg-white/[0.08]
                      [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-white/50 [&::-webkit-slider-thumb]:appearance-none" />
                </div>
              </div>
            )}

            <div className="h-px bg-white/[0.04]" />

            {/* language tabs */}
            <div className="flex gap-1 px-3 py-2">
              {(['all', 'hindi', 'kannada', 'english'] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors
                    ${lang === l ? 'bg-white/[0.08] text-white/80' : 'text-white/30 hover:text-white/50 hover:bg-white/[0.03]'}`}>
                  {l === 'all' ? 'All' : l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
            </div>

            {/* search */}
            <div className="px-3 pb-1.5">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..."
                  className="w-full pl-7 pr-2 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06]
                    text-[11px] text-white/70 placeholder:text-white/20 focus:outline-none focus:border-white/[0.12] transition-colors" />
              </div>
            </div>

            {/* track list */}
            <div className="flex-1 overflow-y-auto px-1.5 pb-2 min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}>
              {filtered.length === 0 ? (
                <p className="text-center text-[11px] text-white/20 py-6">No songs found</p>
              ) : filtered.map((t) => {
                const gi = TRACKS.indexOf(t);
                const active = gi === idx;
                return (
                  <button key={t.id} onClick={() => go(gi)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-left transition-colors
                      ${active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}>
                    <div className={`w-7 h-7 rounded flex-shrink-0 flex items-center justify-center text-[10px]
                      ${active ? 'bg-purple-500/15 text-purple-400' : 'bg-white/[0.03] text-white/20'}`}>
                      {active && playing ? (
                        <div className="flex items-end gap-[2px] h-3">
                          <span className="w-[2px] rounded-full bg-purple-400 animate-[bar1_.5s_ease_infinite]" />
                          <span className="w-[2px] rounded-full bg-purple-400 animate-[bar2_.5s_ease_infinite_.15s]" />
                          <span className="w-[2px] rounded-full bg-purple-400 animate-[bar3_.5s_ease_infinite_.3s]" />
                        </div>
                      ) : <Music className="w-3 h-3" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[12px] truncate ${active ? 'text-white/90 font-medium' : 'text-white/60'}`}>{t.title}</p>
                      <p className="text-[10px] text-white/30 truncate">{t.artist}</p>
                    </div>
                    <span className={`text-[9px] px-1.5 py-[2px] rounded flex-shrink-0 ${langBadge(t.language)}`}>
                      {t.language === 'hindi' ? 'HI' : t.language === 'kannada' ? 'KN' : 'EN'}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ═══ Mini player ═══ */
          <motion.div
            key="mini"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-3 left-3 z-[9999] w-[300px] max-w-[calc(100vw-1.5rem)]
                       rounded-xl border border-white/[0.08] bg-[#161622]/95 backdrop-blur-xl shadow-lg"
          >
            <div className="flex items-center gap-2.5 px-3 py-2">
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex-shrink-0 flex items-center justify-center">
                {playing ? (
                  <div className="flex items-end gap-[2px] h-3.5">
                    <span className="w-[2.5px] rounded-full bg-purple-400 animate-[bar1_.5s_ease_infinite]" />
                    <span className="w-[2.5px] rounded-full bg-purple-400 animate-[bar2_.5s_ease_infinite_.15s]" />
                    <span className="w-[2.5px] rounded-full bg-purple-400 animate-[bar3_.5s_ease_infinite_.3s]" />
                  </div>
                ) : <Music className="w-4 h-4 text-white/20" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-white/80 truncate">{track?.title ?? 'No track'}</p>
                <p className="text-[10px] text-white/35 truncate">{track?.artist ?? '—'}</p>
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button onClick={prev} className="p-1 text-white/35 hover:text-white/60 transition-colors"><SkipBack className="w-3.5 h-3.5" /></button>
                <button onClick={toggle} disabled={!ready}
                  className="p-1.5 rounded-full bg-white/[0.08] text-white hover:bg-white/[0.12] disabled:opacity-40 transition-colors">
                  {loading ? <div className="w-3.5 h-3.5 border-[1.5px] border-white/20 border-t-white rounded-full animate-spin" />
                    : playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-[1px]" />}
                </button>
                <button onClick={next} className="p-1 text-white/35 hover:text-white/60 transition-colors"><SkipForward className="w-3.5 h-3.5" /></button>
                <button onClick={() => setOpen(true)} className="p-1 text-white/25 hover:text-white/50 transition-colors ml-0.5"><ChevronUp className="w-3.5 h-3.5" /></button>
                <button onClick={close} className="p-1 text-white/20 hover:text-white/40 transition-colors"><X className="w-3 h-3" /></button>
              </div>
            </div>
            {/* thin progress line */}
            <div className="h-[2px] bg-white/[0.04] rounded-b-xl overflow-hidden">
              <div className="h-full bg-purple-500/40 transition-all duration-300" style={{ width: dur ? `${(pos / dur) * 100}%` : '0%' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes bar1 { 0%,100%{height:3px} 50%{height:12px} }
        @keyframes bar2 { 0%,100%{height:8px} 50%{height:3px} }
        @keyframes bar3 { 0%,100%{height:5px} 50%{height:10px} }
      `}</style>
    </>
  );
}
