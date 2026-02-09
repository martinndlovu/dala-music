export default function LoadingWave({ text = 'Composing your track...' }) {
  return (
    <div className="flex flex-col items-center gap-6 py-16 animate-fade-up">
      <div className="relative">
        <div
          className="absolute inset-0 blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(232,123,53,0.12) 0%, transparent 70%)',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        />
        <div className="relative flex items-end gap-[3px] h-16">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full"
              style={{
                background: 'linear-gradient(to top, #e87b35, #d63384)',
                animation: `wave-bar 1s ease-in-out ${i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium tracking-wide text-[var(--color-text-secondary)]">{text}</p>
        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">This may take up to a minute</p>
      </div>
    </div>
  )
}
