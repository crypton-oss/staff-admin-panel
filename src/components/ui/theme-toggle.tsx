"use client"

import { type ButtonHTMLAttributes, forwardRef } from "react"

interface ThemeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isDark: boolean
  onToggle: () => void
}

const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ isDark, onToggle, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onToggle}
        className={`relative h-8 w-16 rounded-full bg-white p-1 shadow-sm transition-colors duration-300 dark:bg-[#161616] ${className ?? ""}`}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        {...props}
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 shadow-sm transition-all duration-300 ease-in-out dark:bg-[#222] ${
            isDark ? "translate-x-8" : "translate-x-0"
          }`}
        >
          {isDark ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </span>
      </button>
    )
  },
)
ThemeToggle.displayName = "ThemeToggle"

export { ThemeToggle }
