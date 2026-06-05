"use client"

import { useEffect } from "react"

export default function SecretGamePage() {
  useEffect(() => {
    // Redirect to the static HTML game
    window.location.href = "/dungeon-game.html"
  }, [])

  return (
    <div className="min-h-screen bg-[#07050f] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <span className="text-2xl text-[#d4a017] font-serif">던전 로그라이크</span>
        </div>
        <p className="text-[#c4b5e8] mt-4 text-sm">로딩 중...</p>
      </div>
    </div>
  )
}
