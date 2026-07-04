"use client"

import { useState, useEffect, useCallback } from "react"
import { createSupabaseClient } from "@/lib/supabase"
import { Search, Building2, MapPin, Star, Phone, Plus, X, Upload, ArrowLeft, ChevronRight, Loader2, Trash } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SanatoriyalarContent() {
  const [search, setSearch] = useState("")
  const [searched, setSearched] = useState("")
  const [showAll, setShowAll] = useState(true)
  const [sanatoriyalar, setSanatoriyalar] = useState<any[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const supabase = createSupabaseClient()

  const fetchSanatoriyalar = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sanatoriums')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setSanatoriyalar(data || [])
    } catch (error) {
      console.error('Error fetching sanatoriyalar:', error)
    }
  }, [supabase])

  // Fetch sanatoriyalar from Supabase on mount
  useEffect(() => {
    fetchSanatoriyalar()
  }, [fetchSanatoriyalar])
  const [newSanatoriya, setNewSanatoriya] = useState({
    name: "",
    description: "",
    region: "",
    district: "",
    specialization: "",
    images: [] as { file: File; preview: string; progress: number; uploading: boolean }[],
    status: "active",
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const regions = [
    "Toshkent shahri",
    "Toshkent viloyati",
    "Samarqand viloyati",
    "Farg'ona viloyati",
    "Andijon viloyati",
    "Namangan viloyati",
    "Buxoro viloyati",
    "Xorazm viloyati",
    "Qashqadaryo viloyati",
    "Surxondaryo viloyati",
    "Jizzax viloyati",
    "Sirdaryo viloyati",
    "Navoiy viloyati",
    "Qoraqalpog'iston Respublikasi",
  ]

  const districts: Record<string, string[]> = {
    "Toshkent shahri": ["Bektemir", "Chilonzor", "Mirobod", "Mirzo Ulug'bek", "Sergeli", "Olmazor", "Uchtepa", "Shayxontohur", "Yakkasaroy", "Yunusobod"],
    "Toshkent viloyati": ["Bekobod", "Bo'ka", "Buvayda", "Chirchiq", "G'allaorol", "Ohangaron", "Oqtepa", "Piskent", "Qo'qon", "Quyi Chirchiq", "Yangiyo'l", "Zangiota"],
    "Samarqand viloyati": ["Bulung'ur", "Jomboy", "Ishtixon", "Kattaqo'rg'on", "Narpay", "Nurobod", "Oqdaryo", "Paxtachi", "Pastdarg'om", "Qo'shrabot", "Samarqand", "Soyib", "Toyloq", "Urgut"],
    "Farg'ona viloyati": ["Beshariq", "Buvayda", "Dang'ara", "Farg'ona", "Furqat", "Qo'qon", "Quva", "Qo'shtepa", "Rishton", "So'x", "Toshloq", "Uchko'prik", "Uzun", "Yozyovon"],
    "Andijon viloyati": ["Andijon", "Asaka", "Baliqchi", "Bo'ston", "Buloqboshi", "Jalaquduq", "Xo'jaobod", "Izboskan", "Qo'rg'ontepa", "Marhamat", "Oltinko'l", "Paxtaobod", "Shahrixon", "Ulug'nor"],
    "Namangan viloyati": ["Chortoq", "Chust", "Chartak", "Kosonsoy", "Mingbuloq", "Namangan", "Namangan", "Norin", "Pop", "To'raqo'rg'on", "Uchqo'rg'on", "Uychi", "Yangibozor"],
    "Buxoro viloyati": ["Buxoro", "G'ijduvon", "Jondor", "Kogon", "Qorako'l", "Qorovulbozor", "Romitan", "Shofirkon", "Vobkent", "Vahdat"],
    "Xorazm viloyati": ["Bog'ot", "Gurlan", "Xiva", "Xonqa", "Qo'shko'prik", "Qoraqalpoq", "Shovot", "Urganch", "Xazorasp", "Yangiariq", "Yashnar"],
    "Qashqadaryo viloyati": ["Chiroqchi", "Dehqonobod", "G'uzor", "Qamashi", "Qarshi", "Kitob", "Koson", "Muborak", "Nishon", "Shahrisabz", "Yakkabog'", "Mirishkor"],
    "Surxondaryo viloyati": ["Angor", "Bandixon", "Boysun", "Jarqo'rg'on", "Muzrabot", "Oltinsoy", "Sariosiyo", "Sherobod", "Termiz", "Uzun", "Qumqo'rg'on", "Qizg'it"],
    "Jizzax viloyati": ["Arnasoy", "Baxmal", "Do'stlik", "G'allaorol", "Jizzax", "Zomin", "Mirzachol", "Paxtakor", "Rishton", "Sharof Rashidov", "Yangiobod", "Zafarobod"],
    "Sirdaryo viloyati": ["Boyovut", "Guliston", "Xovos", "Mirzaobod", "Oqoltin", "Sardoba", "Sayhunobod", "Sirdaryo", "Yangiyer"],
    "Navoiy viloyati": ["G'ijduvon", "Khatirchi", "Karmana", "Konimex", "Navoiy", "Nurota", "Qiziltepa", "Tomdi", "Uchkuduk", "Zarafshon"],
    "Qoraqalpog'iston Respublikasi": ["Amudaryo", "Beruniy", "Chimbay", "Ellikqal'a", "Karakalpak", "Kegeyli", "Qong'irot", "Mo'ynoq", "Nukus", "Qo'ng'irot", "Qorao'zak", "Shumanay", "Takhiatosh", "Xo'jayli"],
  }

  const handleSearch = () => {
    setSearched(search)
    setShowAll(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleSave = async () => {
    if (newSanatoriya.name && newSanatoriya.region && newSanatoriya.specialization) {
      try {
        const { data, error } = await supabase
          .from('sanatoriums')
          .insert({
            name: newSanatoriya.name,
            description: newSanatoriya.description,
            location: `${newSanatoriya.region}, ${newSanatoriya.district}`,
            specialization: newSanatoriya.specialization,
            rating: 4.5,
            phone: "",
            status: newSanatoriya.status,
          })
          .select()
          .single()

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        // Refresh the list
        await fetchSanatoriyalar()

        // Reset form
        setNewSanatoriya({
          name: "",
          description: "",
          region: "",
          district: "",
          specialization: "",
          images: [],
          status: "active",
        })
        setShowAddForm(false)
      } catch (error: any) {
        console.error('Error saving sanatoriya:', error?.message || error)
        alert('Xatolik yuz berdi: ' + (error?.message || 'Noma\'lum xatolik'))
      }
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && newSanatoriya.images.length < 4) {
      const file = e.target.files[0]
      let preview = ''
      
      try {
        preview = URL.createObjectURL(file)
      } catch (error) {
        console.error('Error creating object URL:', error)
        preview = ''
      }
      
      const newImage = {
        file,
        preview,
        progress: 0,
        uploading: true,
      }
      setNewSanatoriya({
        ...newSanatoriya,
        images: [...newSanatoriya.images, newImage],
      })

      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setNewSanatoriya(prev => ({
          ...prev,
          images: prev.images.map((img, idx) => 
            idx === prev.images.length - 1 ? { ...img, progress } : img
          ),
        }))
        if (progress >= 100) {
          clearInterval(interval)
          setNewSanatoriya(prev => ({
            ...prev,
            images: prev.images.map((img, idx) => 
              idx === prev.images.length - 1 ? { ...img, progress: 100, uploading: false } : img
            ),
          }))
        }
      }, 200)
    }
  }

  const handleImageDelete = (index: number) => {
    setNewSanatoriya({
      ...newSanatoriya,
      images: newSanatoriya.images.filter((_, idx) => idx !== index),
    })
  }

  const filtered = showAll
    ? sanatoriyalar
    : sanatoriyalar.filter((s) => {
        const q = searched.toLowerCase()
        return (
          s.name.toLowerCase().includes(q) ||
          s.specialization.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q)
        )
      })

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Sanatoriyalar</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Barcha sanatoriyalarni boshqaring va kuzating
        </p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            placeholder="Sanatoriya qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-28 text-sm shadow-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
          />
          <button
            onClick={handleSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Search className="h-3.5 w-3.5" />
            Qidirish
          </button>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Sanatoriya qo'shish
        </button>
      </div>

      {showAddForm ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-4 mb-6 dark:border-zinc-800">
            <button
              onClick={() => setShowAddForm(false)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Orqaga
            </button>
            <ChevronRight className="h-4 w-4 text-zinc-400" />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Sanatoriyalar</span>
            <ChevronRight className="h-4 w-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-900 dark:text-white">Sanatoriya qo'shish</span>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Yangi sanatoriya qo'shish</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Sanatoriya ma'lumotlarini kiriting
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nomi</Label>
              <Input
                id="name"
                value={newSanatoriya.name}
                onChange={(e) => setNewSanatoriya({ ...newSanatoriya, name: e.target.value })}
                placeholder="Sanatoriya nomi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Tavsif</Label>
              <Input
                id="description"
                value={newSanatoriya.description}
                onChange={(e) => setNewSanatoriya({ ...newSanatoriya, description: e.target.value })}
                placeholder="Sanatoriya haqida qisqacha ma'lumot"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Viloyat</Label>
              <Select
                value={newSanatoriya.region}
                onValueChange={(value: string) => setNewSanatoriya({ ...newSanatoriya, region: value, district: "" })}
              >
                <SelectTrigger id="region">
                  <SelectValue placeholder="Viloyatni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <div className="grid grid-cols-2 gap-1 p-1">
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">Tuman</Label>
              <Select
                value={newSanatoriya.district}
                onValueChange={(value: string) => setNewSanatoriya({ ...newSanatoriya, district: value })}
                disabled={!newSanatoriya.region}
              >
                <SelectTrigger id="district">
                  <SelectValue placeholder={newSanatoriya.region ? "Tumanni tanlang" : "Avval viloyatni tanlang"} />
                </SelectTrigger>
                <SelectContent>
                  {newSanatoriya.region && (
                    <div className="grid grid-cols-2 gap-1 p-1">
                      {districts[newSanatoriya.region]?.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="specialization">Ixtisoslik</Label>
              <Input
                id="specialization"
                value={newSanatoriya.specialization}
                onChange={(e) => setNewSanatoriya({ ...newSanatoriya, specialization: e.target.value })}
                placeholder="Kardiologiya, Nafas olish..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Rasm (maks 4 ta)</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={newSanatoriya.images.length >= 4}
                    className="hidden"
                  />
                  <button
                    onClick={() => document.getElementById('image')?.click()}
                    disabled={newSanatoriya.images.length >= 4}
                    className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <Upload className="h-4 w-4" />
                    Rasm yuklash
                  </button>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {newSanatoriya.images.length}/4
                  </span>
                </div>
                
                {newSanatoriya.images.length > 0 && (
                  <div className="flex flex-wrap gap-[3px]">
                    {newSanatoriya.images.map((img, index) => (
                      <div key={index} className="relative group flex items-center gap-2">
                        <div className="h-[30px] w-[30px] rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 cursor-pointer">
                          <img 
                            src={img.preview} 
                            alt={`Upload ${index + 1}`} 
                            className="w-full h-full object-cover"
                            onClick={() => setSelectedImage(img.preview)}
                          />
                          {img.uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="relative">
                                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                                  <circle 
                                    className="opacity-25" 
                                    cx="12" 
                                    cy="12" 
                                    r="10" 
                                    stroke="currentColor" 
                                    strokeWidth="4" 
                                    fill="none"
                                    style={{ color: 'black' }}
                                  />
                                  <path 
                                    className="opacity-75" 
                                    fill="currentColor" 
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    style={{ color: 'white' }}
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleImageDelete(index)}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-opacity hover:bg-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <button
              onClick={() => setShowAddForm(false)}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
              Bekor qilish
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Saqlash
            </button>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              onClick={() => setShowAddForm(false)}
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
            >
              Bosh sahifa
            </button>
          </div>
        </div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20 dark:border-zinc-800">
              <Building2 className="mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
              <p className="text-sm text-zinc-400 dark:text-zinc-500">Sanatoriya topilmadi</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => (
                <Card key={s.id} className="group rounded-2xl border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                      <Building2 className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <Badge
                      variant={s.status === "active" ? "default" : "secondary"}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        s.status === "active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {s.status === "active" ? "Faol" : "Nofaol"}
                    </Badge>
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-white">{s.name}</h3>
                  <div className="mb-1.5 flex items-center gap-1 text-xs text-zinc-400">
                    <MapPin className="h-3 w-3" />
                    {s.location}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400" />
                      {s.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {s.phone}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(null)
              }}
              className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-900 hover:bg-zinc-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}
