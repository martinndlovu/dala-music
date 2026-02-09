import { Play, Trash2 } from 'lucide-react'
import { formatTime, formatDate } from '../utils/formatTime'

export default function TrackCard({ track, onPlay, onDelete, isPlaying }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
        isPlaying
          ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)] shadow-sm'
          : 'border-[var(--color-border)] bg-white hover:border-[var(--color-text-faint)] hover:shadow-md'
      }`}
    >
      {/* Cover art */}
      <div
        className="relative aspect-square cursor-pointer overflow-hidden"
        onClick={() => onPlay(track)}
      >
        {track.imageUrl ? (
          <img
            src={track.imageUrl}
            alt={track.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-accent-light)]">
            <svg className="h-10 w-10 text-[var(--color-accent)]/20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent)] shadow-lg transition-transform duration-300 group-hover:scale-100 scale-90">
            <Play className="h-4 w-4 ml-0.5 text-white" />
          </div>
        </div>

        {/* Playing indicator */}
        {isPlaying && (
          <div className="absolute bottom-2.5 left-2.5 flex items-end gap-[2px] h-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-[2px] rounded-full bg-[var(--color-accent)]"
                style={{ animation: `eq-bar 0.8s ease-in-out ${i * 0.15}s infinite` }}
              />
            ))}
          </div>
        )}

        {/* Duration badge */}
        {track.duration && (
          <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            {formatTime(track.duration)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3
          className="cursor-pointer truncate text-[13px] font-semibold text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent)]"
          onClick={() => onPlay(track)}
        >
          {track.title || 'Untitled'}
        </h3>
        <p className="mt-0.5 truncate text-[11px] text-[var(--color-text-muted)]">
          {track.tags || 'No style tags'}
        </p>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[10px] text-[var(--color-text-faint)]">
            {formatDate(track.createTime)}
          </span>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(track.id)
              }}
              className="rounded-md p-1 text-[var(--color-text-faint)] opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
