'use client'

export function DashboardPreview() {
  return (
    <div className="relative mt-16 w-full max-w-7xl mx-auto px-4">
      {/* Glow Effect - positioned behind dashboard */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-full h-96 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-primary-500 via-secondary-500 to-primary-600 opacity-40 blur-3xl animate-glow-pulse" />
      </div>

      {/* Dashboard Container */}
      <div className="relative bg-gray-900/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-800 dark:border-gray-800 rounded-2xl p-6 shadow-2xl shadow-primary-500/20">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-56 bg-gray-950/80 dark:bg-gray-950/80 rounded-xl p-4">
            <div className="space-y-6">
              {/* Navigation Section */}
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500 font-semibold mb-3">WORKSPACE</div>
                <div className="space-y-1">
                  {['Dashboard', 'Projects', 'Investors', 'Emails'].map((item) => (
                    <div
                      key={item}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        item === 'Dashboard'
                          ? 'bg-primary-500/10 text-primary-500'
                          : 'text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white'
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools Section */}
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500 font-semibold mb-3">AI TOOLS</div>
                <div className="space-y-1">
                  {['Research', 'Email Writer', 'Analytics'].map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 rounded-lg text-sm text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Investors', value: '127', change: '+12 this week', isPositive: true },
                { label: 'Emails Sent', value: '84', change: '+24 today', isPositive: true },
                { label: 'Response Rate', value: '18%', change: '+3.2%', isPositive: true },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-white/5 dark:bg-white/5 backdrop-blur-lg border border-white/10 dark:border-white/10 rounded-xl p-4"
                >
                  <div className="text-xs text-gray-400 dark:text-gray-400 mb-1">{card.label}</div>
                  <div className="text-xl font-semibold text-white dark:text-white mb-1">{card.value}</div>
                  <div className={`text-sm ${card.isPositive ? 'text-success' : 'text-error'}`}>
                    {card.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Research Preview & Email Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Investor Research */}
              <div className="bg-white/5 dark:bg-white/5 backdrop-blur-lg border border-white/10 dark:border-white/10 rounded-xl p-6">
                <div className="text-sm text-gray-400 dark:text-gray-400 mb-2">Latest Research</div>
                <div className="text-lg font-semibold text-white dark:text-white mb-4">Sarah Chen - Sequoia Capital</div>
                <div className="space-y-2 text-sm text-gray-300 dark:text-gray-300">
                  <div>• Led Stripe Series C ($450M)</div>
                  <div>• Tweeted about fintech AI 3 days ago</div>
                  <div>• Podcast: &ldquo;Looking for pre-seed fintech&rdquo;</div>
                </div>
              </div>

              {/* Approval Queue */}
              <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
                <div className="text-sm mb-2 opacity-90">Approval Queue</div>
                <div className="text-2xl font-semibold mb-6">12 Emails Ready</div>
                <div className="grid grid-cols-2 gap-2">
                  {['Review', 'Approve All'].map((action) => (
                    <div key={action} className="text-xs text-center opacity-80 hover:opacity-100 bg-white/20 rounded-lg py-2 cursor-pointer">
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Research Activity & Email Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* AI Research Activity */}
              <div className="bg-white/5 dark:bg-white/5 backdrop-blur-lg border border-white/10 dark:border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-gray-400 dark:text-gray-400">Research Depth</div>
                    <div className="text-2xl font-semibold text-white dark:text-white">8.4/10</div>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-400">Last 7 days</div>
                </div>
                {/* Simple bar chart representation */}
                <div className="flex items-end gap-1 h-32">
                  {[75, 85, 70, 90, 80, 95, 85, 88].map((height, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-primary-500 to-primary-300 rounded-t opacity-70" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 dark:bg-white/5 backdrop-blur-lg border border-white/10 dark:border-white/10 rounded-xl p-6">
                <div className="text-sm text-gray-400 dark:text-gray-400 mb-4">Recent Activity</div>
                <div className="space-y-3">
                  {[
                    { name: 'Email Sent - Sarah Chen', status: 'Delivered', time: '2h ago', icon: '✉️' },
                    { name: 'Research Complete - Mark Johnson', status: 'Ready', time: '4h ago', icon: '🔍' },
                    { name: 'Reply Received - Lisa Wang', status: 'Opened', time: '1d ago', icon: '↩️' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-sm">
                          {activity.icon}
                        </div>
                        <div>
                          <div className="text-sm text-white dark:text-white">{activity.name}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-400">{activity.time}</div>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-success">
                        {activity.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
