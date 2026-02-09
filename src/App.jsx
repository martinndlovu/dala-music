import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useLocalStorage } from './hooks/useLocalStorage'
import Navbar from './components/Navbar'
import CreateMusic from './components/CreateMusic'
import Library from './components/Library'
import About from './components/About'
import MusicPlayer from './components/MusicPlayer'

export default function App() {
  const [library, setLibrary] = useLocalStorage('dala-music-library', [])
  const [currentTrack, setCurrentTrack] = useState(null)

  const handlePlay = useCallback((track) => {
    setCurrentTrack(track)
  }, [])

  const handleNext = useCallback(() => {
    if (!currentTrack || library.length === 0) return
    const idx = library.findIndex((t) => t.id === currentTrack.id)
    if (idx >= 0 && idx < library.length - 1) {
      setCurrentTrack(library[idx + 1])
    }
  }, [currentTrack, library])

  const handlePrev = useCallback(() => {
    if (!currentTrack || library.length === 0) return
    const idx = library.findIndex((t) => t.id === currentTrack.id)
    if (idx > 0) {
      setCurrentTrack(library[idx - 1])
    }
  }, [currentTrack, library])

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[var(--color-bg)] font-[var(--font-body)]">
        {/* Background pattern */}
        <div className="music-bg-pattern" />

        {/* Sidebar */}
        <Navbar />

        {/* Main content */}
        <main className="relative z-10 ml-[180px] flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <CreateMusic
                  library={library}
                  setLibrary={setLibrary}
                  onPlay={handlePlay}
                  currentTrack={currentTrack}
                />
              }
            />
            <Route
              path="/library"
              element={
                <Library
                  library={library}
                  setLibrary={setLibrary}
                  onPlay={handlePlay}
                  currentTrack={currentTrack}
                />
              }
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <MusicPlayer
          track={currentTrack}
          onNext={library.length > 1 ? handleNext : null}
          onPrev={library.length > 1 ? handlePrev : null}
        />
      </div>
    </BrowserRouter>
  )
}
