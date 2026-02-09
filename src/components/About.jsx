import { Sparkles, Headphones, Layers, Zap } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'Text-to-Music',
    desc: 'Describe any sound in natural language and hear it rendered by state-of-the-art generative models.',
  },
  {
    icon: Headphones,
    title: 'Every Genre',
    desc: 'From ambient drone to afrobeats, baroque to breakcore. If you can name it, Dala can make it.',
  },
  {
    icon: Layers,
    title: 'Fine Control',
    desc: 'Custom mode gives you granular control over style, vocals, and musical direction.',
  },
  {
    icon: Zap,
    title: 'Instant Playback',
    desc: 'Tracks generate in under a minute and play instantly in the built-in studio player.',
  },
]

export default function About() {
  return (
    <div className="px-8 pt-10 pb-36 max-w-3xl">
      {/* Header */}
      <div className="mb-12 animate-fade-up">
        <h1 className="font-display text-4xl font-bold leading-snug text-[var(--color-text-primary)] sm:text-5xl animate-fade-up delay-100">
          Music,{' '}
          <span className="hero-gradient">reimagined</span>
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--color-text-secondary)] animate-fade-up delay-200">
          Dala Music is an AI-powered studio that transforms text into
          full-length, original compositions. No instruments required — just
          your imagination.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={title}
            className="group rounded-xl border border-[var(--color-border)] bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-[var(--color-text-faint)] animate-fade-up"
            style={{ animationDelay: `${0.1 * (i + 3)}s` }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent-light)] transition-colors group-hover:bg-[var(--color-accent-muted)]">
              <Icon className="h-5 w-5 text-[var(--color-accent)]" strokeWidth={1.5} />
            </div>
            <h3 className="mb-1.5 text-[15px] font-semibold text-[var(--color-text-primary)]">{title}</h3>
            <p className="text-[13px] leading-relaxed text-[var(--color-text-muted)]">{desc}</p>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-12 border-t border-[var(--color-border-light)] pt-6 animate-fade-up delay-500">
        <p className="text-[12px] text-[var(--color-text-muted)]">
          Built with React + Tailwind CSS + n8n
        </p>
      </div>
    </div>
  )
}
