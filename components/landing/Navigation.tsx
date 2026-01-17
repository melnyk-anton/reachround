'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { ThemeSwitch } from '../ui/theme-switch'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = ['Features', 'Solutions', 'Contact', 'FAQ']

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 dark:bg-background/80 backdrop-blur-lg border-b border-border dark:border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-semibold text-foreground dark:text-foreground">
              ReachRound
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-foreground dark:hover:text-foreground transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Right Side - Theme + Auth */}
          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <Link
              href="/login"
              className="hidden md:inline-block text-sm text-gray-600 dark:text-gray-300 hover:text-foreground dark:hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link
              href="/login"
              className="hidden md:inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg transition-colors text-sm font-medium"
            >
              Sign Up
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground dark:text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border dark:border-border">
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 dark:text-gray-300 hover:text-foreground dark:hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border dark:border-border">
                <Link
                  href="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-foreground dark:hover:text-foreground transition-colors py-2"
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Sign Up
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
