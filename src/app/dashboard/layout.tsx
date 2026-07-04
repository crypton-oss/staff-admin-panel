"use client"

import { useState, useEffect, createContext, useContext, useCallback } from "react"
import type { ReactNode } from "react"
import {
  LayoutDashboard,
  BrainCircuit,
  WalletCards,
  Building2,
  Users,
  ShieldCheck,
  Smartphone,
  Monitor,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { SanatoriyalarContent } from "./sanatoriyalar-content"
import { MablaghlarContent } from "./mablaghlar-content"
import { AIAnalizContent } from "./ai-analiz-content"
import { FoydalanuvchilarContent } from "./foydalanuvchilar-content"
import { AdminlarContent } from "./adminlar-content"
import { IlovaBoshqaruviContent } from "./ilova-boshqaruvi-content"
import { AdminIlovalarContent } from "./admin-ilovalar-content"
import { QurilmalarContent } from "./qurilmalar-content"
import { ProfileHeader } from "./profile-header"
import { HabarnomalarContent } from "./habarnomalar-content"
import { SuccessNotification } from "@/components/SuccessNotification"
import { Iconlyuser } from "@/components/Iconlyuser"

interface ProfilePositionContextType {
  profilePosition: "left" | "right"
  setProfilePosition: (position: "left" | "right") => void
}

const ProfilePositionContext = createContext<ProfilePositionContextType | undefined>(undefined)

export function useProfilePosition() {
  const context = useContext(ProfilePositionContext)
  if (!context) {
    throw new Error("useProfilePosition must be used within ProfilePositionProvider")
  }
  return context
}

const navItems = [
  { icon: LayoutDashboard, label: "Asosiy saxifa", id: "dashboard" },
  { icon: Building2, label: "Sanatoriyalar", id: "sanatoriyalar" },
  { icon: WalletCards, label: "Mablag'lar", id: "mablaghlar" },
  { icon: BrainCircuit, label: "AI Analiz", id: "ai-analiz" },
  { icon: Users, label: "Foydalanuvchilar", id: "foydalanuvchilar" },
  { icon: ShieldCheck, label: "Adminlar", id: "adminlar" },
  { icon: Smartphone, label: "Ilovani boshqarish", id: "ilova-boshqaruvi" },
  { icon: Monitor, label: "Admin ilovalarni boshqarish", id: "admin-ilovalar" },
  { icon: Monitor, label: "Qurilmalar", id: "qurilmalar" },
]

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [profilePosition, setProfilePosition] = useState<"left" | "right">("right")
  const [activeSection, setActiveSection] = useState("dashboard")

  // Global Toast Notification State
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const showNotificationHandler = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>
      setSuccessMessage(customEvent.detail.message)
      setShowSuccessNotification(true)
    }

    const changeTabHandler = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>
      setActiveSection(customEvent.detail.id)
    }

    window.addEventListener("show-success-notification", showNotificationHandler)
    window.addEventListener("change-active-section", changeTabHandler)

    return () => {
      window.removeEventListener("show-success-notification", showNotificationHandler)
      window.removeEventListener("change-active-section", changeTabHandler)
    }
  }, [])

  const handleNavClick = useCallback((id: string) => {
    if (id !== "#") {
      setActiveSection(id)
    }
  }, [])

  return (
    <ProfilePositionContext.Provider value={{ profilePosition, setProfilePosition }}>
      <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-950">
        <aside
          className={`relative flex flex-col h-full border-r border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950 ${
            collapsed ? "w-16" : "w-64"
          }`}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute right-0 top-1/2 z-10 flex h-8 w-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border-2 border-zinc-300 bg-white text-zinc-500 shadow-md transition-colors hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>

          <div className="flex items-center gap-2.5 border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
              <Iconlyuser size={18} color="currentColor" />
            </div>
            <span
              className={`truncate text-[15px] font-semibold tracking-tight text-zinc-900 transition-opacity duration-200 dark:text-white ${
                collapsed ? "invisible w-0 opacity-0" : "visible opacity-100"
              }`}
            >
              Sihhat <span className="ml-px text-zinc-400 dark:text-zinc-500">Uz</span>
            </span>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                    isActive
                      ? "bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-800/60 dark:text-white"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/30 dark:hover:text-zinc-200"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span
                    className={`truncate transition-opacity duration-200 ${
                      collapsed ? "invisible w-0 opacity-0" : "visible opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto h-full bg-zinc-50 dark:bg-zinc-950 p-6 text-zinc-900 dark:text-zinc-100">
          <ProfileHeader />
          <div className="mt-6">
            {activeSection === "dashboard" && children}
            {activeSection === "sanatoriyalar" && <SanatoriyalarContent />}
            {activeSection === "mablaghlar" && <MablaghlarContent />}
            {activeSection === "ai-analiz" && <AIAnalizContent />}
            {activeSection === "foydalanuvchilar" && <FoydalanuvchilarContent />}
            {activeSection === "adminlar" && <AdminlarContent />}
            {activeSection === "ilova-boshqaruvi" && <IlovaBoshqaruviContent />}
            {activeSection === "admin-ilovalar" && <AdminIlovalarContent />}
            {activeSection === "qurilmalar" && <QurilmalarContent />}
            {activeSection === "habarnomalar" && <HabarnomalarContent />}
          </div>
        </main>
      </div>

      <SuccessNotification
        show={showSuccessNotification}
        message={successMessage}
        onClose={() => setShowSuccessNotification(false)}
      />
    </ProfilePositionContext.Provider>
  )
}
