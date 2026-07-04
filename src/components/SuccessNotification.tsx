"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, X, ChevronDown } from "lucide-react"
import { useEffect } from "react"

interface SuccessNotificationProps {
  show: boolean
  message: string
  onClose: () => void
}

export function SuccessNotification({ show, message, onClose }: SuccessNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[420px] px-4"
        >
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-[#0d0d0d] px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur text-white">
            <div className="flex items-start gap-3.5">
              {/* Check Circle */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 border border-emerald-500/20 text-emerald-500 mt-0.5">
                <Check className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white">Success</h4>
                <p className="text-xs text-zinc-400">{message || "Operation completed successfully"}</p>
              </div>
            </div>

            {/* Action buttons on the right */}
            <div className="flex items-center gap-2.5 shrink-0 ml-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/60 border border-zinc-800 text-zinc-450 hover:text-white transition-colors">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button 
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-450 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
