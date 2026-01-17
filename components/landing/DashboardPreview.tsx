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
              {/* General Section */}
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500 font-semibold mb-3">GENERAL</div>
                <div className="space-y-1">
                  {['Dashboard', 'Cards', 'Transactions', 'Accounts'].map((item) => (
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
                <div className="text-xs text-gray-500 dark:text-gray-500 font-semibold mb-3">TOOLS</div>
                <div className="space-y-1">
                  {['Transfer', 'Statistics', 'Billing Overview'].map((item) => (
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
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { currency: 'USD', amount: '$48,650.00', change: '+2.8%', isPositive: true },
                { currency: 'EUR', amount: '€8,650.00', change: '-3.8%', isPositive: false },
                { currency: 'GBP', amount: '$20,650.00', change: '+2.8%', isPositive: true },
              ].map((card) => (
                <div
                  key={card.currency}
                  className="bg-white/5 dark:bg-white/5 backdrop-blur-lg border border-white/10 dark:border-white/10 rounded-xl p-4"
                >
                  <div className="text-xs text-gray-400 dark:text-gray-400 mb-1">{card.currency}</div>
                  <div className="text-xl font-semibold text-white dark:text-white mb-1">{card.amount}</div>
                  <div className={`text-sm ${card.isPositive ? 'text-success' : 'text-error'}`}>
                    {card.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Available Balance & Card Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Available Balance */}
              <div className="bg-white/5 dark:bg-white/5 backdrop-blur-lg border border-white/10 dark:border-white/10 rounded-xl p-6">
                <div className="text-sm text-gray-400 dark:text-gray-400 mb-2">Available Balance</div>
                <div className="text-3xl font-semibold text-white dark:text-white mb-4">$385,430.00</div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm transition-colors">
                    Withdraw
                  </button>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors">
                    History
                  </button>
                </div>
              </div>

              {/* My Card */}
              <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
                <div className="text-sm mb-2 opacity-90">My Card</div>
                <div className="text-2xl font-semibold mb-6">$17,463.00</div>
                <div className="grid grid-cols-4 gap-2">
                  {['Pay', 'Transfer', 'Topup', 'More'].map((action) => (
                    <div key={action} className="text-xs text-center opacity-80 hover:opacity-100">
                      <div className="w-10 h-10 bg-white/20 rounded-lg mx-auto mb-1" />
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cashflow Chart & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Cashflow */}
              <div className="bg-white/5 dark:bg-white/5 backdrop-blur-lg border border-white/10 dark:border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-gray-400 dark:text-gray-400">Cashflow</div>
                    <div className="text-2xl font-semibold text-white dark:text-white">$35,843.00</div>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-400">Monthly</div>
                </div>
                {/* Simple bar chart representation */}
                <div className="flex items-end gap-1 h-32">
                  {[40, 70, 45, 80, 60, 90, 50, 75].map((height, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-primary-500 to-primary-300 rounded-t opacity-70" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 dark:bg-white/5 backdrop-blur-lg border border-white/10 dark:border-white/10 rounded-xl p-6">
                <div className="text-sm text-gray-400 dark:text-gray-400 mb-4">Recent Activity</div>
                <div className="space-y-3">
                  {[
                    { name: 'PayPal Transfer', amount: '+$450.00', time: '2h ago' },
                    { name: 'PayPal Payment', amount: '-$125.00', time: '5h ago' },
                    { name: 'PayPal Deposit', amount: '+$800.00', time: '1d ago' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-500/20 rounded-lg" />
                        <div>
                          <div className="text-sm text-white dark:text-white">{activity.name}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-400">{activity.time}</div>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${activity.amount.startsWith('+') ? 'text-success' : 'text-white dark:text-white'}`}>
                        {activity.amount}
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
