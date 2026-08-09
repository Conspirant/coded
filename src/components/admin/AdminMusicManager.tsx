import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Music, Plus, Trash2, Youtube, RotateCcw, Search, ExternalLink, CheckCircle2 } from "lucide-react";
import { TRACKS as DEFAULT_TRACKS, type Track, type Language, LANGUAGE_LABELS } from "@/data/musicPlayerData";

const CUSTOM_MUSIC_KEY = "kcet_custom_music_tracks";
const MUSIC_EVENT_NAME = "kcet_music_tracks_updated";

/** Helper: Extract YouTube ID from link or raw ID */
export function extractYouTubeId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const matchWatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (matchWatch) return matchWatch[1];
  const matchShort = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (matchShort) return matchShort[1];
  const matchEmbed = trimmed.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (matchEmbed) return matchEmbed[1];
  return trimmed;
}

/** Get active playlist (custom or default) */
export function getActiveTracks(): Track[] {
  try {
    const raw = localStorage.getItem(CUSTOM_MUSIC_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Failed to parse custom tracks", e);
  }
  return DEFAULT_TRACKS;
}

/** Save & broadcast custom playlist */
export function saveActiveTracks(tracks: Track[]) {
  try {
    localStorage.setItem(CUSTOM_MUSIC_KEY, JSON.stringify(tracks));
    window.dispatchEvent(new CustomEvent(MUSIC_EVENT_NAME));
  } catch (e) {
    console.error("Failed to save tracks", e);
  }
}

export function AdminMusicManager() {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filterLang, setFilterLang] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Form state
  const [youtubeInput, setYoutubeInput] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [language, setLanguage] = useState<Language>("hindi");

  useEffect(() => {
    setTracks(getActiveTracks());

    const handleUpdate = () => {
      setTracks(getActiveTracks());
    };
    window.addEventListener(MUSIC_EVENT_NAME, handleUpdate);
    return () => window.removeEventListener(MUSIC_EVENT_NAME, handleUpdate);
  }, []);

  const extractedId = useMemo(() => extractYouTubeId(youtubeInput), [youtubeInput]);

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractedId || extractedId.length !== 11) {
      toast({
        title: "Invalid YouTube Link",
        description: "Please enter a valid YouTube video link or 11-character Video ID.",
        variant: "destructive"
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Song Title Required",
        description: "Please enter a title for the song.",
        variant: "destructive"
      });
      return;
    }

    const newTrack: Track = {
      id: extractedId,
      title: title.trim(),
      artist: artist.trim() || 'Various Artists',
      language
    };

    const updated = [newTrack, ...tracks];
    setTracks(updated);
    saveActiveTracks(updated);

    // Reset form
    setYoutubeInput("");
    setTitle("");
    setArtist("");

    toast({
      title: "Song Published Globally",
      description: `"${newTrack.title}" has been added to the music playlist.`
    });
  };

  const handleDeleteSong = (id: string, songTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${songTitle}"?`)) return;

    const updated = tracks.filter(t => t.id !== id);
    setTracks(updated);
    saveActiveTracks(updated);

    toast({
      title: "Song Deleted",
      description: `"${songTitle}" was removed from the music playlist.`
    });
  };

  const handleResetDefault = () => {
    if (!confirm("Reset playlist back to default initial tracks? Custom added songs will be removed.")) return;

    localStorage.removeItem(CUSTOM_MUSIC_KEY);
    setTracks(DEFAULT_TRACKS);
    window.dispatchEvent(new CustomEvent(MUSIC_EVENT_NAME));

    toast({
      title: "Playlist Reset",
      description: "Music player has been restored to default track list."
    });
  };

  const filteredTracks = useMemo(() => {
    let list = filterLang === "all" ? tracks : tracks.filter(t => t.language === filterLang);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    }
    return list;
  }, [tracks, filterLang, search]);

  const langBadge = (l: Language) => {
    const map: Record<Language, string> = {
      hindi: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      kannada: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      english: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    };
    return map[l];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Music className="h-5 w-5 text-indigo-400" /> Global Music Playlist Manager
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Add YouTube music links to publish songs globally for all users, or delete existing tracks.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetDefault}
          className="border-white/10 hover:bg-white/5 text-xs gap-1.5 shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Default Tracks
        </Button>
      </div>

      {/* Add Song Card */}
      <Card className="glass-strong border-white/10 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Plus className="h-4 w-4 text-indigo-400" /> Publish New Song
          </CardTitle>
          <CardDescription className="text-xs">
            Paste any YouTube video link (e.g. https://www.youtube.com/watch?v=...) to instantly add it to the website player.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSong} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* YouTube URL input */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="yt-url" className="text-xs">YouTube Video Link or ID</Label>
                <div className="relative">
                  <Youtube className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                  <Input
                    id="yt-url"
                    value={youtubeInput}
                    onChange={e => setYoutubeInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="pl-9 bg-white/5 border-white/10 text-xs"
                  />
                </div>
                {extractedId && (
                  <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Extracted Video ID: <strong>{extractedId}</strong>
                  </p>
                )}
              </div>

              {/* Song Title */}
              <div className="space-y-1.5">
                <Label htmlFor="song-title" className="text-xs">Song Title</Label>
                <Input
                  id="song-title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Belageddu"
                  className="bg-white/5 border-white/10 text-xs"
                />
              </div>

              {/* Artist */}
              <div className="space-y-1.5">
                <Label htmlFor="song-artist" className="text-xs">Artist</Label>
                <Input
                  id="song-artist"
                  value={artist}
                  onChange={e => setArtist(e.target.value)}
                  placeholder="e.g. Vijay Prakash"
                  className="bg-white/5 border-white/10 text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
              {/* Language selection */}
              <div className="flex items-center gap-2">
                <Label className="text-xs shrink-0">Language:</Label>
                <Select value={language} onValueChange={(val: Language) => setLanguage(val)}>
                  <SelectTrigger className="w-36 bg-white/5 border-white/10 text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hindi">🇮🇳 Hindi</SelectItem>
                    <SelectItem value="kannada">🇮🇳 Kannada</SelectItem>
                    <SelectItem value="english">🌍 English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit button */}
              <Button type="submit" size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs gap-1.5">
                <Plus className="h-4 w-4" /> Publish Song Globally
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Playlist Section Header & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-white/10 font-mono text-xs">{filteredTracks.length} Active Tracks</Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search playlist..."
              className="pl-8 bg-white/5 border-white/10 text-xs h-8"
            />
          </div>

          {/* Filter Language */}
          <Select value={filterLang} onValueChange={setFilterLang}>
            <SelectTrigger className="w-32 bg-white/5 border-white/10 text-xs h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="hindi">Hindi</SelectItem>
              <SelectItem value="kannada">Kannada</SelectItem>
              <SelectItem value="english">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Tracks Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTracks.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground text-xs">
            No tracks found matching your search/filter.
          </div>
        ) : (
          filteredTracks.map((track) => (
            <Card key={track.id + track.title} className="bg-white/[0.03] border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-[9px] font-semibold border ${langBadge(track.language)}`}>
                        {LANGUAGE_LABELS[track.language]}
                      </Badge>
                      <span className="text-[10px] font-mono text-muted-foreground">ID: {track.id}</span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground truncate">{track.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`https://www.youtube.com/watch?v=${track.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                      title="Test/Watch on YouTube"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSong(track.id, track.title)}
                      className="h-7 w-7 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      title="Delete track"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
