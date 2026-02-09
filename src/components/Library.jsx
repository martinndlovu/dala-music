import { useState } from 'react'
import { Search } from 'lucide-react'
import TrackCard from './TrackCard'

export default function Library({ library, setLibrary, onPlay, currentTrack }) {
  const [search, setSearch] = useState('')

  const filtered = library.filter((t) => {
    const q = search.toLowerCase()
    return (
      !q ||
      (t.title || '').toLowerCase().includes(q) ||
      (t.tags || '').toLowerCase().includes(q) ||
      (t.prompt || '').toLowerCase().includes(q)
    )
  })

  const handleDelete = (id) => {
    setLibrary((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="px-8 pt-10 pb-36">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">
            Your Library
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {library.length} track{library.length !== 1 ? 's' : ''} in your collection
          </p>
        </div>

        <div className="relative animate-fade-up delay-100">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracks..."
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] transition-colors focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 sm:w-64"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up delay-200">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-accent-light)]">
            <svg className="h-8 w-8 text-[var(--color-accent)]/30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-text-secondary)]">
            {library.length === 0 ? 'Nothing here yet' : 'No matches'}
          </h2>
          <p className="mt-1 max-w-xs text-sm text-[var(--color-text-muted)]">
            {library.length === 0
              ? 'Create your first track and it will appear here'
              : 'Try a different search term'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-fade-up delay-200">
          {filtered.map((track, i) => (
            <div
              key={track.id}
              className="animate-fade-up"
              style={{ animationDelay: `${0.05 * Math.min(i, 12)}s` }}
            >
              <TrackCard
                track={track}
                onPlay={onPlay}
                onDelete={handleDelete}
                isPlaying={currentTrack?.id === track.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
