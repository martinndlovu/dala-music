import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import { formatTime } from '../utils/formatTime'

export default function MusicPlayer({ track, onNext, onPrev }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    if (!track || !audioRef.current) return
    audioRef.current.load()
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
  }, [track?.id])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume
    }
  }, [volume, muted])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration)
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    if (audioRef.current) audioRef.current.currentTime = pct * duration
  }

  const handleEnded = () => {
    setIsPlaying(false)
    if (onNext) onNext()
  }

  if (!track) return null

  const progress = duration ? (currentTime / duration) * 100 : 0
  const audioSrc = track.streamAudioUrl || track.audioUrl

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-white/95 backdrop-blur-xl">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="ml-[180px] flex items-center gap-5 px-6 py-3">
        {/* Track info */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg">
            {track.imageUrl ? (
              <>
                <img
                  src={track.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                    <div className="flex items-end gap-[2px] h-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-[2px] rounded-full bg-white"
                          style={{ animation: `eq-bar 0.8s ease-in-out ${i * 0.15}s infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-[var(--color-accent-light)]">
                <svg className="h-4 w-4 text-[var(--color-accent)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
              {track.title || 'Untitled'}
            </p>
            <p className="truncate text-[11px] text-[var(--color-text-muted)]">
              {track.tags || track.prompt?.slice(0, 50)}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button
              onClick={onPrev}
              className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)] disabled:opacity-30"
              disabled={!onPrev}
            >
              <SkipBack className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-generate)] text-white transition-all hover:scale-105 hover:bg-[var(--color-generate-hover)]"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </button>
            <button
              onClick={onNext}
              className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)] disabled:opacity-30"
              disabled={!onNext}
            >
              <SkipForward className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            <span className="w-9 text-right text-[11px] text-[var(--color-text-muted)]">
              {formatTime(currentTime)}
            </span>
            <div
              className="progress-track group relative h-[3px] w-48 cursor-pointer rounded-full bg-[var(--color-border)] sm:w-72"
              onClick={handleSeek}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-[var(--color-accent)] transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[var(--color-accent)] opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                style={{ left: `${progress}%`, marginLeft: '-5px' }}
              />
            </div>
            <span className="w-9 text-[11px] text-[var(--color-text-muted)]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume & Download */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => setMuted(!muted)}
              className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
            >
              {muted || volume === 0 ? (
                <VolumeX className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Volume2 className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value))
                setMuted(false)
              }}
              className="volume-slider h-[3px] w-20 cursor-pointer appearance-none rounded-full bg-[var(--color-border)]"
            />
          </div>

          {track.audioUrl && (
            <a
              href={track.audioUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
            >
              <Download className="h-4 w-4" strokeWidth={1.5} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
