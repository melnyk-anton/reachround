export function LogoMarquee() {
  const logos = ['BeReal', 'SoundCloud', 'flickr', 'Medium', 'TAGGED', 'Pinterest']

  return (
    <div className="mt-12 px-4">
      <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 max-w-6xl mx-auto">
        {logos.map((logo) => (
          <div
            key={logo}
            className="text-2xl font-bold text-gray-400 dark:text-gray-600 opacity-40 hover:opacity-60 transition-opacity grayscale"
          >
            {logo}
          </div>
        ))}
      </div>
    </div>
  )
}
