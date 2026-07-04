"use client"

import { useState, useEffect, FormEvent } from "react"
import { Bell, User, LogOut, AlignLeft, AlignRight, UploadCloud, Edit, Eye, EyeOff, X, Trash } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { useProfilePosition } from "./layout"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AvatarUpload } from "@/components/AvatarUpload"
import { SuccessNotification } from "@/components/SuccessNotification"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function ProfileHeader() {
  const { isDark, toggle } = useTheme()
  const { profilePosition, setProfilePosition } = useProfilePosition()
  const [clock, setClock] = useState("")
  const [username, setUsername] = useState("Admin")
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editUsername, setEditUsername] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [showPassword, setShowPassword] = useState(true)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")

  useEffect(() => {
    const days = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"]
    const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"]

    function tick() {
      const d = new Date()
      const day = days[d.getDay()]
      const date = d.getDate()
      const month = months[d.getMonth()]
      const year = d.getFullYear()
      const h = String(d.getHours()).padStart(2, "0")
      const m = String(d.getMinutes()).padStart(2, "0")
      setClock(`${day}, ${date} ${month} ${year}, ${h}:${m}`)
    }

    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const storedUsername = localStorage.getItem("adminUsername")
    if (storedUsername) {
      const fetchData = async () => {
        setUsername(storedUsername)
        setEditUsername(storedUsername)
        try {
          const { createClient } = await import("@supabase/supabase-js")
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          )
          const { data } = await supabase
            .from("staff_admin")
            .select("avatar_url, password")
            .eq("username", storedUsername)
            .single()
          
          if (data?.avatar_url) {
            setAvatarUrl(data.avatar_url)
          }
          if (data?.password) {
            setOldPassword(data.password)
          }
        } catch (e) {
          console.error("Error loading header details:", e)
        }
      }
      fetchData()
    }
  }, [])

  return (
    <>
      <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800 mb-6 text-zinc-900 dark:text-zinc-100">
        <div className={profilePosition === "left" ? "order-2" : "order-1"}>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">{clock}</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Welcome back, {username}</h2>
        </div>
        <div className={`flex items-center gap-3 ${profilePosition === "left" ? "order-1" : "order-2"}`}>
          <ThemeToggle isDark={isDark} onToggle={toggle} />
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("change-active-section", { detail: { id: "habarnomalar" } }))}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-300 bg-zinc-100 text-zinc-500 transition-colors hover:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <Bell className="h-4 w-4" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2 transition-colors hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-sm font-semibold text-white">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">{username}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-72">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditProfileOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profilni tahrirlash</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setProfilePosition(profilePosition === "left" ? "right" : "left")}>
                {profilePosition === "left" ? (
                  <>
                    <AlignRight className="mr-2 h-4 w-4" />
                    <span>Profile to Right</span>
                  </>
                ) : (
                  <>
                    <AlignLeft className="mr-2 h-4 w-4" />
                    <span>Profile to Left</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                onClick={() => {
                  localStorage.removeItem("adminUsername")
                  window.location.href = "/"
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Hisobdan chiqish</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="max-w-6xl min-h-[600px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="group w-full"
          >
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/60 bg-zinc-100/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-zinc-500 dark:border-zinc-700/60 dark:bg-zinc-800/5">
                  Profile
                </div>
                <h1 className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-white sm:text-3xl">
                  Profile settings
                </h1>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Update your avatar and username.
                </p>
              </div>
              <Badge className="group gap-2 rounded-full border border-zinc-200/60 bg-zinc-100/5 px-4 py-2 text-zinc-500 transition-colors duration-300 hover:border-blue-500/60 hover:bg-blue-500/15 hover:text-blue-500 dark:border-zinc-700/60 dark:bg-zinc-800/5 dark:hover:border-blue-400/60 dark:hover:bg-blue-400/15 dark:hover:text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden />
                Auto-save enabled
              </Badge>
            </div>

            <form className="grid gap-8 sm:grid-cols-5" onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}>
              <div className="space-y-6 sm:col-span-3">
                <div className="space-y-2">
                  <Label htmlFor="profile-username">Username</Label>
                  <div className="relative max-w-md">
                    <Input
                      id="profile-username"
                      value={editUsername}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditUsername(e.target.value)}
                      disabled={!isEditingUsername}
                      className="h-11 rounded-2xl border-zinc-200/60 bg-zinc-50/60 px-4 pr-10 text-zinc-900 dark:border-zinc-700/60 dark:bg-zinc-900/60 dark:text-white disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditingUsername(!isEditingUsername)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="old-password">Eski parol</Label>
                  <div className="relative max-w-md">
                    <Input
                      id="old-password"
                      type={showPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setOldPassword(e.target.value)
                        setPasswordError("")
                        setPasswordSuccess("")
                      }}
                      onBlur={async () => {
                        if (oldPassword.trim()) {
                          try {
                            const { createClient } = await import("@supabase/supabase-js")
                            const supabase = createClient(
                              process.env.NEXT_PUBLIC_SUPABASE_URL!,
                              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                            )
                            const { data: user } = await supabase
                              .from("staff_admin")
                              .select("*")
                              .eq("username", username)
                              .single()
                            
                            if (user && user.password === oldPassword) {
                              setPasswordSuccess("Eski parol to'g'ri")
                              setPasswordError("")
                            } else {
                              setPasswordError("Eski parol noto'g'ri")
                              setPasswordSuccess("")
                            }
                          } catch (e) {
                            console.error(e)
                          }
                        }
                      }}
                      placeholder={oldPassword ? "" : "Eski parolni kiriting"}
                      className="h-11 rounded-2xl border-zinc-200/60 bg-zinc-50/60 px-4 pr-20 text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700/60 dark:bg-zinc-900/60 dark:text-white dark:placeholder:text-zinc-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-600 dark:text-red-400">{passwordError}</p>
                  )}
                  {passwordSuccess && (
                    <p className="text-xs text-green-600 dark:text-green-400">{passwordSuccess}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Yangi parol</Label>
                  <div className="relative max-w-md">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                      placeholder="Yangi parolni kiriting"
                      className="h-11 rounded-2xl border-zinc-200/60 bg-zinc-50/60 px-4 pr-20 text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700/60 dark:bg-zinc-900/60 dark:text-white dark:placeholder:text-zinc-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className={newPassword.length >= 8 ? "text-green-600 dark:text-green-400" : "text-zinc-500 dark:text-zinc-400"}>
                      {newPassword.length >= 8 ? "✓" : "○"} 8 ta belgidan ko'p
                    </p>
                    <p className={/^[A-Z]/.test(newPassword) ? "text-green-600 dark:text-green-400" : "text-zinc-500 dark:text-zinc-400"}>
                      {/^[A-Z]/.test(newPassword) ? "✓" : "○"} Boshida katta harf
                    </p>
                    <p className={/^.{4}_/.test(newPassword) ? "text-green-600 dark:text-green-400" : "text-zinc-500 dark:text-zinc-400"}>
                      {/^.{4}_/.test(newPassword) ? "✓" : "○"} 4 ta harfdan keyin _ belgisi
                    </p>
                    <p className={/^.{4}_\\/.test(newPassword) ? "text-green-600 dark:text-green-400" : "text-zinc-500 dark:text-zinc-400"}>
                      {/^.{4}_\\/.test(newPassword) ? "✓" : "○"} _ dan keyin \ ishorasi
                    </p>
                    <p className={/^[a-zA-Z0-9_\\]+$/.test(newPassword) ? "text-green-600 dark:text-green-400" : "text-zinc-500 dark:text-zinc-400"}>
                      {/^[a-zA-Z0-9_\\]+$/.test(newPassword) ? "✓" : "○"} Lotin harflarida
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end mt-8">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-zinc-200/60 bg-white/5 px-6 py-3 text-sm text-zinc-500 hover:text-blue-500 dark:border-zinc-700/60 dark:bg-zinc-800/5 dark:hover:text-blue-400"
                    onClick={() => setIsEditProfileOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (editUsername.trim()) {
                        const { createClient } = await import("@supabase/supabase-js")
                        const supabase = createClient(
                          process.env.NEXT_PUBLIC_SUPABASE_URL!,
                          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                        )
                        
                        if (newPassword.trim() && oldPassword.trim()) {
                          const { data: user } = await supabase
                            .from("staff_admin")
                            .select("*")
                            .eq("username", username)
                            .single()
                          
                          if (user && user.password === oldPassword) {
                            const isValidLength = newPassword.length >= 8
                            const hasUppercaseStart = /^[A-Z]/.test(newPassword)
                            const hasUnderscoreAfter4 = /^.{4}_/.test(newPassword)
                            const hasBackslashAfterUnderscore = /^.{4}_\\/.test(newPassword)
                            const isLatinOnly = /^[a-zA-Z0-9_\\]+$/.test(newPassword)
                            
                            if (isValidLength && hasUppercaseStart && hasUnderscoreAfter4 && hasBackslashAfterUnderscore && isLatinOnly) {
                              await supabase
                                .from("staff_admin")
                                .update({ password: newPassword.trim() })
                                .eq("username", username)
                              setPasswordSuccess("Parol muvaffaqiyatli yangilandi")
                              setPasswordError("")
                            } else {
                              setPasswordError("Parol shartlarga mos kelmaydi")
                              setPasswordSuccess("")
                            }
                          } else {
                            setPasswordError("Eski parol noto'g'ri")
                            setPasswordSuccess("")
                          }
                        }
                        
                        const { error: usernameError } = await supabase
                          .from("staff_admin")
                          .update({ username: editUsername.trim() })
                          .eq("username", username)
                          .select()
                        
                        if (usernameError) {
                          console.error("Username update error:", usernameError)
                        }
                        
                        localStorage.setItem("adminUsername", editUsername.trim())
                        setUsername(editUsername.trim())
                        
                        setOldPassword("")
                        setNewPassword("")
                        setIsEditingUsername(false)
                        setIsEditProfileOpen(false)
                        window.dispatchEvent(new CustomEvent("show-success-notification", { detail: { message: "Profil muvaffaqiyatli saqlandi!" } }))
                      }
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-medium text-white shadow-[0_20px_60px_-30px_rgba(59,130,246,0.75)] transition-transform duration-300 hover:-translate-y-1 dark:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200/60 bg-zinc-50/40 p-6 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/40">
                  <AvatarUpload
                    currentAvatarUrl={avatarUrl}
                    username={username}
                    onAvatarUpdate={setAvatarUrl}
                  />
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{username}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Administrator
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-zinc-200/60 bg-white/5 px-4 py-2 text-sm text-zinc-900 hover:text-blue-500 dark:border-zinc-700/60 dark:bg-zinc-800/5 dark:text-white dark:hover:text-blue-400"
                    onClick={() => {
                      const input = document.querySelector('input[type="file"]') as HTMLInputElement
                      input?.click()
                    }}
                  >
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Update avatar
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </DialogContent>
      </Dialog>

    </>
  )
}
