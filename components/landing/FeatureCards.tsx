export function FeatureCards() {
  const features = [
    {
      title: 'Simplify the way you see your money',
      description: 'Connect your financial world into one seamless experience, built for focus and control.',
      visual: 'dashboard',
    },
    {
      title: 'User-friendly dashboard',
      description: 'An intuitive dashboard that boosts navigation and productivity.',
      visual: 'chart',
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card dark:bg-card backdrop-blur-sm border border-border dark:border-border rounded-xl p-8 hover:border-gray-700 dark:hover:border-gray-700 transition-colors"
          >
            <h3 className="text-2xl font-semibold text-foreground dark:text-foreground mb-4">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {feature.description}
            </p>

            {/* Visual Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-primary-500/10 to-secondary-500/10 dark:from-primary-500/10 dark:to-secondary-500/10 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 dark:text-gray-500">
                {feature.visual === 'dashboard' ? '📊 Dashboard Preview' : '📈 Chart Visualization'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
