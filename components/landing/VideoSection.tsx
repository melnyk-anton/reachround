'use client'

export function VideoSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground dark:text-foreground mb-4">
            See ReachRound in Action
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Watch how our AI researches investors and generates personalized emails in seconds.
          </p>
        </div>

        {/* Video Container */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-800 dark:border-gray-800 shadow-2xl">
          <video
            className="w-full h-full object-cover"
            controls
            preload="metadata"
          >
            <source src="/reachround-demo-1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Key Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-500 mb-2">30 sec</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Research + personalized email
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-500 mb-2">10x</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Faster than manual outreach
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-500 mb-2">100%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Personalized to each investor
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
