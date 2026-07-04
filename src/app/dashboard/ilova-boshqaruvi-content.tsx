"use client"

import { useState, useRef } from "react"
import { Smartphone, Plus, Trash, Globe, Save, HelpCircle, Check, Send, Snowflake, ShieldAlert, Sparkles, UploadCloud } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Banner {
  id: number
  imageUrl: string
  title: string
  clickUrl: string
  isActive: boolean
}

const initialBanners: Banner[] = [
  { 
    id: 1, 
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=60", 
    title: "Zomin tog'lari bag'rida dam oling!", 
    clickUrl: "https://sihhat.uz/sanatorium/zomin",
    isActive: true 
  }
]

export function IlovaBoshqaruviContent() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [appVersion, setAppVersion] = useState("1.0.4")
  const [supportLink, setSupportLink] = useState("https://t.me/sihhatuz_support")
  const [showSaved, setShowSaved] = useState(false)

  // App control switches
  const [isFrozen, setIsFrozen] = useState(false)
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(false)
  const [isUpdateReminderActive, setIsUpdateReminderActive] = useState(true)

  // Push notification states
  const [pushTitle, setPushTitle] = useState("")
  const [pushBody, setPushBody] = useState("")
  const [pushSent, setPushSent] = useState(false)
  const [pushImageFile, setPushImageFile] = useState<File | null>(null)
  const [pushImagePreview, setPushImagePreview] = useState<string | null>(null)

  // New Banner/Ad state
  const [newTitle, setNewTitle] = useState("")
  const [newClickUrl, setNewClickUrl] = useState("")
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null)
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null)

  // File Input References
  const pushFileInputRef = useRef<HTMLInputElement>(null)
  const bannerFileInputRef = useRef<HTMLInputElement>(null)

  const handleSaveConfig = () => {
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 2500)
    window.dispatchEvent(new CustomEvent("show-success-notification", { detail: { message: "Ilova sozlamalari muvaffaqiyatli saqlandi!" } }))
  }

  const handleSendPush = () => {
    if (!pushTitle || !pushBody) return
    setPushSent(true)
    setTimeout(() => {
      setPushSent(false)
      setPushTitle("")
      setPushBody("")
      setPushImageFile(null)
      setPushImagePreview(null)
      window.dispatchEvent(new CustomEvent("show-success-notification", { detail: { message: "Push-xabarnoma foydalanuvchilarga muvaffaqiyatli yuborildi!" } }))
    }, 1500)
  }

  const handleAddBanner = () => {
    if (!newTitle || !bannerImagePreview) return
    const newBanner: Banner = {
      id: Date.now(),
      imageUrl: bannerImagePreview,
      title: newTitle,
      clickUrl: newClickUrl || "https://sihhat.uz",
      isActive: true
    }
    setBanners([...banners, newBanner])
    setNewTitle("")
    setBannerImageFile(null)
    setBannerImagePreview(null)
    setNewClickUrl("")
    window.dispatchEvent(new CustomEvent("show-success-notification", { detail: { message: "Yangi reklama banneri muvaffaqiyatli qo'shildi!" } }))
  }

  const handleDeleteBanner = (id: number) => {
    setBanners(banners.filter(b => b.id !== id))
  }

  const toggleBanner = (id: number) => {
    setBanners(banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-indigo-600 dark:text-indigo-400" /> Ilova Boshqaruvi
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Mobil ilova sozlamalari, push bildirishnomalar va reklama bannerlari nazorati</p>
        </div>
        <div>
          {showSaved && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 px-3 py-1.5 rounded-xl mr-3 inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" /> Sozlamalar saqlandi!
            </span>
          )}
          <Button onClick={handleSaveConfig} className="rounded-xl gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="h-4 w-4" /> Sozlamalarni saqlash
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns (Banners & Push Notification) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Push Notification Section */}
          <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Send className="h-4.5 w-4.5 text-blue-500" /> Ilova nomidan push-bildirishnoma yuborish
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="push-title">Xabarnoma sarlavhasi (Title)</Label>
                <Input
                  id="push-title"
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  placeholder="Masalan: Yangi sanatoriya qo'shildi!"
                  className="h-11 rounded-xl bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="push-body">Xabar matni (Body)</Label>
                <Textarea
                  id="push-body"
                  value={pushBody}
                  onChange={(e) => setPushBody(e.target.value)}
                  placeholder="Foydalanuvchilarga yuboriladigan asosiy matnni kiriting..."
                  rows={3}
                  className="rounded-xl py-3 px-4 bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              {/* Upload Push Image instead of URL Input */}
              <div className="space-y-1.5">
                <Label>Xabarnoma rasmi (Upload Image)</Label>
                <input
                  type="file"
                  ref={pushFileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setPushImageFile(file)
                      setPushImagePreview(URL.createObjectURL(file))
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />
                {pushImagePreview ? (
                  <div className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/40">
                    <img
                      src={pushImagePreview}
                      alt="Push preview"
                      className="h-12 w-12 rounded-lg object-cover border border-zinc-200 dark:border-zinc-850"
                    />
                    <div className="flex-1 truncate">
                      <p className="text-xs font-semibold truncate text-zinc-900 dark:text-white">{pushImageFile?.name}</p>
                      <p className="text-[10px] text-zinc-400">{(pushImageFile ? pushImageFile.size / 1024 : 0).toFixed(1)} KB</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setPushImageFile(null)
                        setPushImagePreview(null)
                      }}
                      className="h-8 w-8 text-zinc-400 hover:text-red-500 rounded-lg"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => pushFileInputRef.current?.click()}
                    className="w-full h-11 rounded-xl border-dashed border-zinc-300 dark:border-zinc-800 hover:border-blue-500 text-zinc-500 dark:text-zinc-400 gap-2 bg-zinc-50/50 dark:bg-[#121212]"
                  >
                    <UploadCloud className="h-4 w-4" /> Rasm yuklash (Upload Image)
                  </Button>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <Button 
                  onClick={handleSendPush}
                  disabled={pushSent || !pushTitle || !pushBody}
                  className="rounded-xl gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="h-4 w-4" /> Push-xabarni yuborish
                </Button>
              </div>
            </div>
          </Card>

          {/* Banner / Ad Management */}
          <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">Reklama Bannerlari (Ad Slots)</h3>
            <div className="space-y-4">
              {banners.map((banner) => (
                <div key={banner.id} className="flex gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20 relative group">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-24 h-16 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-zinc-950 dark:text-white">{banner.title}</h4>
                      <p className="text-[10px] text-zinc-400 mt-1 truncate max-w-md">Click URL: {banner.clickUrl}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center gap-1.5 text-xs text-zinc-500 cursor-pointer">
                        <Switch
                          checked={banner.isActive}
                          onCheckedChange={() => toggleBanner(banner.id)}
                        />
                        {banner.isActive ? "Faol" : "Nofaol"}
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-500 p-1 bg-white hover:bg-red-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Banner Form */}
            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-900 space-y-4">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Reklama banneri yuklash qismi</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                  <Label htmlFor="banner-title" className="text-xs">Sarlavha (Title)</Label>
                  <Input
                    id="banner-title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Reklama nomi"
                    className="h-10 rounded-lg text-xs bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>

                {/* Upload Banner Image instead of URL Input */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Banner rasmini yuklash</Label>
                  <input
                    type="file"
                    ref={bannerFileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setBannerImageFile(file)
                        setBannerImagePreview(URL.createObjectURL(file))
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  {bannerImagePreview ? (
                    <div className="flex items-center gap-2 p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 h-10 overflow-hidden">
                      <img
                        src={bannerImagePreview}
                        alt="Banner preview"
                        className="h-6 w-6 rounded object-cover"
                      />
                      <span className="text-[10px] truncate flex-1 text-zinc-800 dark:text-zinc-200">{bannerImageFile?.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setBannerImageFile(null)
                          setBannerImagePreview(null)
                        }}
                        className="h-6 w-6 text-zinc-400 hover:text-red-500 p-0 rounded"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => bannerFileInputRef.current?.click()}
                      className="w-full h-10 rounded-lg border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 gap-1.5 text-xs bg-zinc-50/50 dark:bg-[#121212]"
                    >
                      <UploadCloud className="h-3.5 w-3.5" /> Rasm yuklash
                    </Button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="banner-click-url" className="text-xs">O'tish manzili (Click URL)</Label>
                  <Input
                    id="banner-click-url"
                    value={newClickUrl}
                    onChange={(e) => setNewClickUrl(e.target.value)}
                    placeholder="https://..."
                    className="h-10 rounded-lg text-xs bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
              <Button onClick={handleAddBanner} size="sm" className="rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-black mt-2">
                Banner yuklash va qo'shish
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Dynamic Status Controls & Version details */}
        <div className="space-y-6">
          <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800 space-y-6">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Tezkor Boshqaruvlar</h3>

            {/* Freeze App Toggle */}
            <div className="flex items-center justify-between p-3 border border-zinc-100 dark:border-zinc-900 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/10">
              <div className="space-y-0.5">
                <Label className="text-xs font-bold text-zinc-850 dark:text-zinc-200 flex items-center gap-1.5">
                  <Snowflake className="h-4 w-4 text-blue-500 animate-pulse" /> Ilovani muzlatish
                </Label>
                <p className="text-[10px] text-zinc-400">Vaqtinchalik muzlatish</p>
              </div>
              <Switch checked={isFrozen} onCheckedChange={setIsFrozen} />
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="flex items-center justify-between p-3 border border-zinc-100 dark:border-zinc-900 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/10">
              <div className="space-y-0.5">
                <Label className="text-xs font-bold text-red-650 dark:text-red-400 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" /> Texnik ishlar (Maintenance)
                </Label>
                <p className="text-[10px] text-zinc-400">Texnik ishlar sahifasi</p>
              </div>
              <Switch checked={isMaintenanceActive} onCheckedChange={setIsMaintenanceActive} />
            </div>

            {/* Update Prompt Toggle */}
            <div className="flex items-center justify-between p-3 border border-zinc-100 dark:border-zinc-900 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/10">
              <div className="space-y-0.5">
                <Label className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Yangilanish eslatmasi</Label>
                <p className="text-[10px] text-zinc-400">Yangilanish oynasini chiqarish</p>
              </div>
              <Switch checked={isUpdateReminderActive} onCheckedChange={setIsUpdateReminderActive} />
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-150 dark:border-zinc-800">
              {/* Version config */}
              <div className="space-y-1.5">
                <Label htmlFor="app-ver" className="text-xs">So'nggi versiya (appVersion)</Label>
                <Input
                  id="app-ver"
                  value={appVersion}
                  onChange={(e) => setAppVersion(e.target.value)}
                  className="h-10 rounded-xl font-mono text-xs bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              {/* Support Link */}
              <div className="space-y-1.5">
                <Label htmlFor="support-link" className="text-xs">Telegram Support Link</Label>
                <Input
                  id="support-link"
                  value={supportLink}
                  onChange={(e) => setSupportLink(e.target.value)}
                  className="h-10 rounded-xl text-xs bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
            </div>
          </Card>

          {/* Quick info status */}
          <Card className="p-5 bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-200 dark:border-indigo-900/40 text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
            <h4 className="font-bold mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" /> Boshqaruv yo'riqnomasi
            </h4>
            <p>
              Ushbu sahifadagi 'muzlatish' yoki 'texnik ishlar' tugmalari faollashtirilganda mobil ilova foydalanuvchilariga darhol maxsus ogohlantirish sahifasi ko'rinadi.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
