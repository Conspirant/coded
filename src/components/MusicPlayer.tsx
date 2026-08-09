import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music, Play, Pause, SkipForward, SkipBack, Shuffle, Repeat,
  Volume2, VolumeX, ChevronUp, ChevronDown, X, Search, Sliders
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
const defaults: Saved = { idx: 0, vol: 60, shuf: false, rpt: false, lang: 'all', show: true, quality: 'auto' };

function load(): Saved {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(LS) || '{}') }; } catch { return defaults; }
}
function save(p: Partial<Saved>) {
  try { localStorage.setItem(LS, JSON.stringify({ ...load(), ...p })); } catch { /* */ }
}

/* ═══════════════════════════════════════════════════════
   MusicPlayer — right-aligned, sleek floating player
   ═══════════════════════════════════════════════════════ */
export function MusicPlayer() {
  const init = useRef(load()).current;
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
  const errorSkips = useRef(0);

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

  /* Completion ratio percentage (0 to 100) */
  const completionPct = useMemo(() => {
    if (!dur || dur <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((pos / dur) * 100)));
  }, [pos, dur]);

  /* persist */
  useEffect(() => { save({ idx }); }, [idx]);
  useEffect(() => { save({ vol }); }, [vol]);
  useEffect(() => { save({ shuf }); }, [shuf]);
  useEffect(() => { save({ rpt }); }, [rpt]);
  useEffect(() => { save({ lang }); }, [lang]);
  useEffect(() => { save({ show: visible }); }, [visible]);

  /* ── advance track ────────── */
  const advance = useCallback((fromError = false) => {
    if (fromError) {
      errorSkips.current++;
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
    ytRef.current?.playVideo();
  }, []);

  /* ── init YT player unconditionally ────────────────── */
  useEffect(() => {
    let dead = false;

    ensureYTApi().then(() => {
      if (dead) return;
      try {
        const p = new (window as any).YT.Player('yt-mp-frame', {
          width: '1', height: '1',
          videoId: TRACKS[idxRef.current]?.id ?? TRACKS[0].id,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin
          },
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
      } catch (err) {
        console.warn('YT player init error', err);
      }
    });

    return () => { dead = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      ytRef.current.playVideo();
      ytRef.current.setPlaybackQuality?.(quality);
    }
    setPos(0);
  }, [quality]);

  const toggle = useCallback(() => {
    if (!ytRef.current) return;
    if (playing) {
      ytRef.current.pauseVideo();
    } else {
      ytRef.current.playVideo();
    }
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
      hindi: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      kannada: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      english: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    };
    return map[l];
  };

  /* ═══ Circular SVG Progress Ring calculation ═══ */
  const strokeDasharray = 2 * Math.PI * 20; // radius = 20 -> 125.66
  const strokeDashoffset = strokeDasharray - (strokeDasharray * completionPct) / 100;

  return (
    <>
      {/* ALWAYS mounted YouTube Iframe container */}
      <div className="fixed w-px h-px overflow-hidden opacity-0 pointer-events-none" style={{ top: 0, right: 0 }} aria-hidden>
        <div id="yt-mp-frame" />
      </div>

      {/* ═══ Floating Circular FAB (player closed/hidden) ═══ */}
      {!visible ? (
        <button
          onClick={() => setVisible(true)}
          title={track ? `${track.title} (${completionPct}% completed)` : 'Open Music Player'}
          className="fixed bottom-6 right-6 z-[9998] group cursor-pointer focus:outline-none"
        >
          <div className="relative w-12 h-12 rounded-full bg-[#131422] border border-white/10 shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
            {/* SVG Progress Ring */}
            <svg className="absolute inset-0 w-12 h-12 -rotate-90 transform pointer-events-none" viewBox="0 0 48 48">
              <circle
                cx="24" cy="24" r="20"
                className="stroke-white/10"
                strokeWidth="2.5"
                fill="transparent"
              />
              <circle
                cx="24" cy="24" r="20"
                className="stroke-indigo-400 transition-all duration-300"
                strokeWidth="2.5"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {playing ? (
              <div className="flex items-end gap-[2.5px] h-3.5 z-10">
                <span className="w-[2.5px] rounded-full bg-indigo-400 animate-[bar1_.5s_ease_infinite]" />
                <span className="w-[2.5px] rounded-full bg-indigo-400 animate-[bar2_.5s_ease_infinite_.15s]" />
                <span className="w-[2.5px] rounded-full bg-indigo-400 animate-[bar3_.5s_ease_infinite_.3s]" />
              </div>
            ) : (
              <Music className="w-4 h-4 text-indigo-400 z-10" />
            )}

            {/* Hover tooltip on left side */}
            <div className="absolute right-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1b1c2e] border border-white/10 text-[11px] font-medium text-white px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
              {playing ? `${completionPct}% • ${track?.title}` : 'Open Music Player'}
            </div>
          </div>
        </button>
      ) : (
        <AnimatePresence mode="wait">
          {open ? (
            /* ═══ Expanded Panel (Right Aligned) ═══ */
            <motion.div
              key="exp"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="fixed bottom-4 right-4 z-[9999] w-[340px] max-w-[calc(100vw-1.5rem)]
                         rounded-2xl border border-white/10 bg-[#131422]/95 backdrop-blur-2xl
                         shadow-2xl shadow-black/50 flex flex-col overflow-hidden text-foreground"
              style={{ maxHeight: 'min(470px, calc(100vh - 5rem))' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 relative">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-xs font-bold tracking-wide text-white/90">Music Player</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Quality Selector dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowQualityMenu((p) => !p)}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Audio/Video Stream Quality"
                    >
                      <Sliders className="w-3 h-3 text-indigo-400" />
                      <span>{quality === 'auto' ? 'Auto' : quality === 'hd720' ? '720p' : quality === 'medium' ? '360p' : '144p'}</span>
                    </button>

                    {showQualityMenu && (
                      <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-white/10 bg-[#1b1c2e] shadow-2xl py-1 z-[10000]">
                        <div className="px-3 py-1 text-[9px] font-bold text-white/40 uppercase tracking-wider">Quality</div>
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
                            className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              quality === q.key ? 'text-indigo-400 bg-white/5 font-semibold' : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <span>{q.label}</span>
                            {quality === q.key && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"><ChevronDown className="w-4 h-4" /></button>
                  <button onClick={close} className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Now Playing section */}
              {track && (
                <div className="px-4 pt-3.5 pb-2 bg-gradient-to-b from-white/[0.02] to-transparent">
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="relative w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      {playing ? (
                        <div className="flex items-end gap-[3px] h-4">
                          <span className="w-[3px] rounded-full bg-indigo-400 animate-[bar1_.5s_ease_infinite]" />
                          <span className="w-[3px] rounded-full bg-indigo-400 animate-[bar2_.5s_ease_infinite_.15s]" />
                          <span className="w-[3px] rounded-full bg-indigo-400 animate-[bar3_.5s_ease_infinite_.3s]" />
                        </div>
                      ) : (
                        <Music className="w-5 h-5 text-indigo-400/60" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-white truncate">{track.title}</p>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
                          {completionPct}%
                        </span>
                      </div>
                      <p className="text-[11px] text-white/40 truncate mt-0.5">{track.artist}</p>
                    </div>
                  </div>

                  {/* Progress bar with completion ratio */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={0}
                      max={dur || 1}
                      value={pos}
                      onChange={(e) => seek(+e.target.value)}
                      className="w-full h-1 rounded-full appearance-none cursor-pointer bg-white/10 accent-indigo-400
                        [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-indigo-400 [&::-webkit-slider-thumb]:appearance-none border-0"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-white/30">
                      <span>{fmt(pos)}</span>
                      <span className="text-white/40">{completionPct}% completed</span>
                      <span>{fmt(dur)}</span>
                    </div>
                  </div>

                  {/* Transport controls */}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button onClick={() => setShuf((p) => !p)} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${shuf ? 'text-indigo-400 bg-indigo-500/10' : 'text-white/30 hover:text-white/60'}`}><Shuffle className="w-3.5 h-3.5" /></button>
                    <button onClick={prev} className="p-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"><SkipBack className="w-4 h-4" /></button>
                    <button
                      onClick={toggle}
                      disabled={!ready}
                      className="p-2.5 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400 disabled:opacity-40 transition-all cursor-pointer mx-1"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : playing ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      )}
                    </button>
                    <button onClick={next} className="p-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"><SkipForward className="w-4 h-4" /></button>
                    <button onClick={() => setRpt((p) => !p)} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${rpt ? 'text-indigo-400 bg-indigo-500/10' : 'text-white/30 hover:text-white/60'}`}><Repeat className="w-3.5 h-3.5" /></button>
                  </div>

                  {/* Volume slider */}
                  <div className="flex items-center gap-2 mt-2 px-1">
                    <button onClick={() => setVolume(vol === 0 ? 60 : 0)} className="text-white/30 hover:text-white/60 transition-colors cursor-pointer">
                      {vol === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={vol}
                      onChange={(e) => setVolume(+e.target.value)}
                      className="flex-1 h-1 rounded-full appearance-none cursor-pointer bg-white/10 accent-indigo-400
                        [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-indigo-400 [&::-webkit-slider-thumb]:appearance-none"
                    />
                    <span className="text-[10px] font-mono text-white/30 w-6 text-right">{vol}%</span>
                  </div>
                </div>
              )}

              <div className="h-px bg-white/5" />

              {/* Language filter tabs */}
              <div className="flex gap-1.5 px-3 py-2">
                {(['all', 'hindi', 'kannada', 'english'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer
                      ${lang === l
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
                      }`}
                  >
                    {l === 'all' ? 'All' : l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="px-3 pb-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search tracks..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10
                      text-xs text-white/90 placeholder:text-white/25 focus:outline-none focus:border-indigo-500/40 transition-colors"
                  />
                </div>
              </div>

              {/* Track list */}
              <div className="flex-1 overflow-y-auto px-2 pb-2 min-h-0 space-y-0.5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                {filtered.length === 0 ? (
                  <p className="text-center text-xs text-white/30 py-6">No matching songs found</p>
                ) : filtered.map((t) => {
                  const gi = TRACKS.indexOf(t);
                  const active = gi === idx;
                  return (
                    <button
                      key={t.id}
                      onClick={() => go(gi)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer
                        ${active
                          ? 'bg-indigo-500/15 border border-indigo-500/30'
                          : 'hover:bg-white/5 border border-transparent'
                        }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold
                        ${active ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/30'}`}
                      >
                        {active && playing ? (
                          <div className="flex items-end gap-[2px] h-3">
                            <span className="w-[2px] rounded-full bg-white animate-[bar1_.5s_ease_infinite]" />
                            <span className="w-[2px] rounded-full bg-white animate-[bar2_.5s_ease_infinite_.15s]" />
                            <span className="w-[2px] rounded-full bg-white animate-[bar3_.5s_ease_infinite_.3s]" />
                          </div>
                        ) : (
                          <Music className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold truncate ${active ? 'text-indigo-300' : 'text-white/80'}`}>{t.title}</p>
                        <p className="text-[10px] text-white/40 truncate">{t.artist}</p>
                      </div>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${langBadge(t.language)}`}>
                        {t.language === 'hindi' ? 'HI' : t.language === 'kannada' ? 'KN' : 'EN'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* ═══ Mini player Bar (Right Aligned) ═══ */
            <motion.div
              key="mini"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.15 }}
              className="fixed bottom-4 right-4 z-[9999] w-[310px] max-w-[calc(100vw-1.5rem)]
                         rounded-2xl border border-white/10 bg-[#131422]/95 backdrop-blur-2xl shadow-2xl overflow-hidden text-foreground"
            >
              <div className="flex items-center gap-3 px-3.5 py-2.5">
                <div className="relative w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0 flex items-center justify-center">
                  {playing ? (
                    <div className="flex items-end gap-[2px] h-3.5">
                      <span className="w-[2.5px] rounded-full bg-indigo-400 animate-[bar1_.5s_ease_infinite]" />
                      <span className="w-[2.5px] rounded-full bg-indigo-400 animate-[bar2_.5s_ease_infinite_.15s]" />
                      <span className="w-[2.5px] rounded-full bg-indigo-400 animate-[bar3_.5s_ease_infinite_.3s]" />
                    </div>
                  ) : (
                    <Music className="w-4 h-4 text-indigo-400/60" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-white truncate">{track?.title ?? 'No track'}</p>
                    <span className="text-[9px] font-mono font-semibold text-indigo-400">{completionPct}%</span>
                  </div>
                  <p className="text-[10px] text-white/40 truncate">{track?.artist ?? '—'}</p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={prev} className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer"><SkipBack className="w-3.5 h-3.5" /></button>
                  <button
                    onClick={toggle}
                    disabled={!ready}
                    className="p-2 rounded-full bg-indigo-500 text-white shadow-md hover:bg-indigo-400 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : playing ? (
                      <Pause className="w-3.5 h-3.5 fill-white" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    )}
                  </button>
                  <button onClick={next} className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer"><SkipForward className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setOpen(true)} className="p-1 text-white/30 hover:text-white transition-colors cursor-pointer ml-0.5"><ChevronUp className="w-4 h-4" /></button>
                  <button onClick={close} className="p-1 text-white/30 hover:text-white transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              {/* Bottom completion progress bar */}
              <div className="h-1 bg-white/5 w-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <style>{`
        @keyframes bar1 { 0%,100%{height:3px} 50%{height:12px} }
        @keyframes bar2 { 0%,100%{height:8px} 50%{height:3px} }
        @keyframes bar3 { 0%,100%{height:5px} 50%{height:10px} }
      `}</style>
    </>
  );
}
