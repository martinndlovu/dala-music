import { useState, useRef, useCallback } from 'react'
import { Sparkles, ArrowRight, Settings2 } from 'lucide-react'
import { generateMusic, checkTaskStatus } from '../services/api'
import LoadingWave from './LoadingWave'
import TrackCard from './TrackCard'

const MODELS = [
  { value: 'V5', label: 'V5', badge: 'Latest' },
  { value: 'V4.5+', label: 'V4.5+', badge: null },
  { value: 'V4.5', label: 'V4.5', badge: null },
  { value: 'V4', label: 'V4', badge: null },
]

const GENRES = [
  'Afrobeats',
  'Hip-Hop',
  'Jazz',
  'Pop',
  'R&B',
  'Electronic',
  'Classical',
  'Rock',
  'Lo-Fi',
  'Reggae',
  'Soul',
  'Ambient',
  'Country',
  'Funk',
  'Gospel',
  'Latin',
  'Metal',
  'Blues',
  'Indie',
  'Dancehall',
]

const INITIAL_VISIBLE = 8

const POLL_INTERVAL = 3000
const MAX_POLLS = 120

export default function CreateMusic({ library, setLibrary, onPlay, currentTrack }) {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('V5')
  const [customMode, setCustomMode] = useState(false)
  const [instrumental, setInstrumental] = useState(false)
  const [style, setStyle] = useState('')
  const [title, setTitle] = useState('')
  const [vocalGender, setVocalGender] = useState('f')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [recentTracks, setRecentTracks] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [showAllGenres, setShowAllGenres] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const pollRef = useRef(null)

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  const handleGenreClick = (genre) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null)
      setStyle('')
    } else {
      setSelectedGenre(genre)
      setStyle(genre)
      setCustomMode(true)
    }
  }

  const visibleGenres = showAllGenres ? GENRES : GENRES.slice(0, INITIAL_VISIBLE)
  const hiddenCount = GENRES.length - INITIAL_VISIBLE

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setGenerating(true)
    setError(null)
    setRecentTracks([])

    try {
      const { taskId } = await generateMusic({
        prompt: prompt.trim(),
        customMode,
        instrumental,
        model,
        style: style.trim(),
        title: title.trim(),
        vocalGender,
      })

      if (!taskId) throw new Error('No taskId received')

      let polls = 0
      pollRef.current = setInterval(async () => {
        polls++
        if (polls > MAX_POLLS) {
          stopPolling()
          setGenerating(false)
          setError('Generation timed out. Please try again.')
          return
        }

        try {
          const data = await checkTaskStatus(taskId)

          if (data.status === 'SUCCESS' || data.status === 'FIRST_SUCCESS') {
            stopPolling()
            setGenerating(false)

            if (data.tracks?.length) {
              const tracksWithDates = data.tracks.map((t) => ({
                ...t,
                createTime: t.createTime || new Date().toISOString(),
              }))

              setRecentTracks(tracksWithDates)
              setLibrary((prev) => {
                const ids = new Set(prev.map((t) => t.id))
                const newTracks = tracksWithDates.filter((t) => !ids.has(t.id))
                return [...newTracks, ...prev]
              })
              onPlay(tracksWithDates[0])
            }
          } else if (data.status === 'ERROR' || data.status === 'FAILED') {
            stopPolling()
            setGenerating(false)
            setError('Music generation failed. Please try again.')
          }
        } catch (err) {
          stopPolling()
          setGenerating(false)
          setError(`Status check failed: ${err.message}`)
        }
      }, POLL_INTERVAL)
    } catch (err) {
      setGenerating(false)
      setError(`Failed to start generation: ${err.message}`)
    }
  }

  return (
    <div className="flex flex-col items-center px-8 pt-16 pb-36">
      {/* Hero — centered, bold italic uppercase like Gebeya */}
      <div className="mb-8 text-center animate-fade-up">
        <h1 className="font-display text-[52px] font-black uppercase italic leading-[1.1] tracking-tight sm:text-[64px] animate-fade-up delay-100">
          <span className="text-[var(--color-text-primary)]">Unleash Your</span>
          <br />
          <span className="hero-gradient hero-underline">Inner Musician</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-[var(--color-text-secondary)] animate-fade-up delay-200">
          Turn your wildest ideas into stunning original tracks in seconds.
          <br />
          Just type a prompt and watch the magic happen!
        </p>
      </div>

      {/* Composer Card — centered, clean like Gebeya */}
      <div className="w-full max-w-[640px] rounded-2xl border border-[var(--color-border)] bg-white shadow-sm animate-fade-up delay-300">
        {/* Textarea */}
        <div className="p-5 pb-0">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type a prompt..."
            rows={4}
            maxLength={10000}
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
            disabled={generating}
          />
          {/* Character count */}
          <div className="flex justify-end pb-2">
            <span className="text-[11px] text-[var(--color-text-muted)]">
              {prompt.length} / 10,000
            </span>
          </div>
        </div>

        {/* Action bar — bottom of card */}
        <div className="flex items-center gap-2 border-t border-[var(--color-border-light)] px-5 py-3">
          {/* Settings toggle */}
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
              showSettings
                ? 'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            <Settings2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            Settings
          </button>

          <div className="flex-1" />

          {/* Enhance with AI */}
          <button
            type="button"
            disabled={generating || !prompt.trim()}
            className="btn-enhance flex items-center gap-1.5 rounded-lg px-3.5 py-[7px] text-[12px] font-medium"
            onClick={() => {
              if (prompt.trim()) {
                setPrompt(prompt.trim() + ' — make it radio-ready with professional production quality')
              }
            }}
          >
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
            Enhance with AI
          </button>

          {/* Generate Music */}
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="btn-generate rounded-lg px-4 py-[7px] text-[12px] font-semibold"
          >
            {generating ? 'Generating...' : 'Generate Music'}
          </button>
        </div>

        {/* Settings panel (expandable) */}
        {showSettings && (
          <div className="border-t border-[var(--color-border-light)] px-5 py-4 animate-fade-in">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-[var(--color-text-muted)]">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-2.5 py-1.5 text-[12px] text-[var(--color-text-primary)] focus:border-[var(--color-accent)]"
                  disabled={generating}
                >
                  {MODELS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label} {m.badge ? `(${m.badge})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-[var(--color-text-muted)]">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Song"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-2.5 py-1.5 text-[12px] text-[var(--color-text-primary)] focus:border-[var(--color-accent)]"
                  disabled={generating}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-[var(--color-text-muted)]">
                  Vocals
                </label>
                <select
                  value={vocalGender}
                  onChange={(e) => setVocalGender(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-2.5 py-1.5 text-[12px] text-[var(--color-text-primary)] focus:border-[var(--color-accent)]"
                  disabled={generating}
                >
                  <option value="f">Female</option>
                  <option value="m">Male</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => setInstrumental(!instrumental)}
                  disabled={generating}
                  className={`rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all ${
                    instrumental
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
                  }`}
                >
                  Instrumental
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Genre Chips — centered, no emojis, like Gebeya style chips */}
      <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-[640px] animate-fade-up delay-400">
        {visibleGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreClick(genre)}
            disabled={generating}
            className={`genre-chip rounded-full border px-4 py-1.5 text-[13px] font-medium ${
              selectedGenre === genre
                ? 'active'
                : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Show More link */}
      {!showAllGenres && hiddenCount > 0 && (
        <button
          onClick={() => setShowAllGenres(true)}
          className="mt-3 text-[13px] font-medium text-[var(--color-text-muted)] underline decoration-dotted underline-offset-4 hover:text-[var(--color-text-secondary)] transition-colors animate-fade-up delay-500"
        >
          Show More ({hiddenCount})
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="mt-5 w-full max-w-[640px] rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 animate-fade-up">
          {error}
        </div>
      )}

      {/* Loading */}
      {generating && (
        <div className="w-full max-w-[640px]">
          <LoadingWave />
        </div>
      )}

      {/* Recent creations */}
      {recentTracks.length > 0 && (
        <div className="mt-12 w-full max-w-[640px] animate-fade-up">
          <h2 className="mb-5 font-display text-lg font-bold text-[var(--color-text-primary)]">
            Fresh from the studio
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {recentTracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onPlay={onPlay}
                isPlaying={currentTrack?.id === track.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
