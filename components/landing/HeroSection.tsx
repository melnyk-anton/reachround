'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] dark:bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:24px_24px] opacity-20" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badges */}
        <div className="inline-flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-6">
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800/50 rounded-full">
            🤖 AI-Powered Research
          </span>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800/50 rounded-full">
            ✉️ Personalized Emails
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.1] tracking-tight text-foreground dark:text-foreground mb-6 animate-fade-in-up">
          Reach Investors Who Actually Care
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-600 dark:text-gray-400 mb-8">
          ReachRound uses AI to research investors deeply and write highly personalized cold emails. Every email looks like you spent 30 minutes researching that specific investor.
        </p>

        {/* CTA Button */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-purple-900/20 hover:shadow-xl hover:shadow-purple-900/30 hover:scale-105"
        >
          Start for Free
          <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}
