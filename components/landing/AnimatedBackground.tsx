'use client'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background dark:bg-background">
      {/* Large animated gradient orbs - More visible */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-30 animate-blob dark:opacity-20" />
      <div className="absolute top-0 -right-20 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:opacity-20" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-25 animate-blob animation-delay-4000 dark:opacity-15" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-6000 dark:opacity-10" />


      {/* Grid pattern overlay - More visible */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" />

      {/* Large center glow - More dramatic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-primary-500/20 via-purple-500/5 to-transparent animate-pulse-slow dark:from-primary-500/10 dark:via-purple-500/5" />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
    </div>
  )
}
