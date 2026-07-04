"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import {
  LogIn,
  LockKeyhole,
  User,
  Eye,
  EyeOff,
  Ban,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

type Screen = "loading" | "login"

const VALID_HASH = /^(loading|login)_([a-z0-9]{8})$/

function randHash() {
  return Math.random().toString(36).substring(2, 10)
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]">
      <div className="relative mb-12 flex flex-col items-center">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="spinner center">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="spinner-blade"
                style={{
                  transform: `rotate(${i * 30}deg)`,
                  animationDelay: `${(i * 0.083).toFixed(3)}s`,
                }}
              />
            ))}
          </div>
        </div>
        <h1 className="mt-20 text-lg font-semibold tracking-tight text-white/90">
          Sihhat Uz
        </h1>
        <p className="mt-1 text-sm text-white/40">Staff Admin Panel</p>
      </div>
      <p className="absolute bottom-8 text-xs text-white/25">
        Initializing secure environment…
      </p>
    </div>
  )
}

function LoginScreen() {
  const router = useRouter()
  const [loginId, setLoginId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    const { data: user, error } = await getSupabase()
      .from("staff_admin")
      .select("*")
      .eq("username", loginId.trim())
      .single()

    setIsLoading(false)

    if (error || !user) {
      setErrorMessage("Invalid username or password")
      return
    }

    if (user.password !== password) {
      setErrorMessage("Invalid username or password")
      return
    }

    localStorage.setItem("adminUsername", loginId.trim())
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 dark:bg-black">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {errorMessage && (
        <div className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border border-red-300 bg-red-50 px-5 py-3 shadow-xl backdrop-blur-2xl dark:border-red-900/40 dark:bg-red-950/60 dark:shadow-black/60">
          <Ban className="h-4 w-4 shrink-0 text-red-500 dark:text-red-400" />
          <span className="text-sm font-medium text-red-700 dark:text-red-300">{errorMessage}</span>
        </div>
      )}

      <div className="w-full max-w-xs rounded-[32px] bg-black">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white">
            <LogIn className="h-5 w-5 text-white dark:text-black" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Sign in to Staff Portal
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Access the central control network for Sihhat Uz.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              id="loginId"
              type="text"
              placeholder="username"
              value={loginId}
              onChange={(e) => {
                setLoginId(e.target.value)
                if (errorMessage) setErrorMessage(null)
              }}
              autoComplete="username"
              required
              icon={<User className="h-4 w-4 text-zinc-400" />}
              className="h-11 rounded-xl border-0 bg-zinc-100 pl-10 text-sm text-zinc-900 placeholder-zinc-400 ring-1 ring-transparent transition-all focus-visible:ring-2 focus-visible:ring-zinc-500/40 focus-visible:ring-offset-0 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500"
            />
          </div>

          <div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errorMessage) setErrorMessage(null)
              }}
              autoComplete="current-password"
              required
              icon={<LockKeyhole className="h-4 w-4 text-zinc-400" />}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="flex items-center justify-center text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              className="h-12 rounded-xl border-0 bg-zinc-100 pl-10 pr-10 text-sm text-zinc-900 placeholder-zinc-400 ring-1 ring-transparent transition-all focus-visible:ring-2 focus-visible:ring-zinc-500/40 focus-visible:ring-offset-0 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-800 text-sm font-semibold text-white transition-all hover:from-zinc-800 hover:to-zinc-700 dark:from-zinc-100 dark:to-zinc-200 dark:text-black dark:hover:from-white dark:hover:to-zinc-100"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-black"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </span>
            )}
          </Button>
        </form>

  
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [screen, setScreen] = useState<Screen>("loading")

  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  useEffect(() => {
    window.location.hash = `loading_${randHash()}`
  }, [])

  useEffect(() => {
    window.location.hash = `${screen}_${randHash()}`
  }, [screen])

  useEffect(() => {
    if (screen !== "loading") return
    const timer = setTimeout(() => setScreen("login"), 3000)
    return () => clearTimeout(timer)
  }, [screen])

  return (
    <div className="min-h-screen bg-white font-sans antialiased dark:bg-black">
      {screen === "loading" && <LoadingScreen />}
      {screen === "login" && <LoginScreen />}
    </div>
  )
}
