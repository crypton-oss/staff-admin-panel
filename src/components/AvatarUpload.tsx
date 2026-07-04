"use client"

import { useState, useRef } from "react"
import { createClient } from "@supabase/supabase-js"
import { Camera, Loader2 } from "lucide-react"

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  username: string
  onAvatarUpdate: (url: string) => void
}

export function AvatarUpload({ currentAvatarUrl, username, onAvatarUpdate }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Faqat rasmlarni yuklash mumkin")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Rasm hajmi 5MB dan oshmasligi kerak")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const { data, error } = await supabase.functions.invoke("upload-avatar", {
        body: formData,
      })

      if (error) throw error

      const { url } = data as { url: string }

      // Update database
      const { error: updateError } = await supabase
        .from("staff_admin")
        .update({ avatar_url: url })
        .eq("username", username)

      if (updateError) throw updateError

      // Update local state
      onAvatarUpdate(url)
    } catch (error) {
      console.error("Avatar upload error:", error)
      alert("Avatar yuklashda xatolik yuz berdi")
    } finally {
      setIsUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative group cursor-pointer" onClick={handleClick}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
      
      <div className="relative">
        {currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt={username}
            className="h-24 w-24 rounded-full border-2 border-zinc-200 object-cover dark:border-zinc-700"
          />
        ) : (
          <div className="h-24 w-24 rounded-full border-2 border-zinc-200 bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-900">
            <span className="text-3xl font-semibold text-zinc-600 dark:text-zinc-300">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
        
        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}
