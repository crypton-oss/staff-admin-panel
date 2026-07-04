"use client"

import { useState } from "react"
import { Users, Plus, Search, CheckCircle2, Ban, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserItem {
  id: string
  full_name: string
  username: string
  role: "patient" | "sanatorium_admin" | "super_admin"
  sanatorium_id: string | null
  created_at: string
  status: "active" | "blocked"
}

// Single user matching updated ERD diagram schema (email replaced by username)
const initialUsers: UserItem[] = [
  { 
    id: "1", 
    full_name: "Farrux Olimov", 
    username: "farrux_olimov", 
    role: "patient", 
    sanatorium_id: null, 
    created_at: "2026-06-15", 
    status: "active" 
  }
]

export function FoydalanuvchilarContent() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "blocked">("all")
  const [isAddOpen, setIsAddOpen] = useState(false)

  // New user state
  const [newFullName, setNewFullName] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newRole, setNewRole] = useState<"patient" | "sanatorium_admin" | "super_admin">("patient")
  const [newSanatoriumId, setNewSanatoriumId] = useState("")
  const [newStatus, setNewStatus] = useState<"active" | "blocked">("active")

  const handleAddUser = () => {
    if (!newFullName || !newUsername) return
    const newUser: UserItem = {
      id: String(users.length + 1),
      full_name: newFullName,
      username: newUsername.trim(),
      role: newRole,
      sanatorium_id: newRole === "sanatorium_admin" && newSanatoriumId ? newSanatoriumId : null,
      created_at: new Date().toISOString().split("T")[0],
      status: newStatus
    }
    setUsers([newUser, ...users])
    setIsAddOpen(false)
    window.dispatchEvent(new CustomEvent("show-success-notification", { detail: { message: "Yangi foydalanuvchi muvaffaqiyatli qo'shildi!" } }))

    // Reset Form
    setNewFullName("")
    setNewUsername("")
    setNewRole("patient")
    setNewSanatoriumId("")
    setNewStatus("active")
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
  }

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === "active" ? "blocked" : "active" }
      }
      return u
    }))
  }

  const filtered = users.filter(u => {
    const matchesSearch = u.full_name.toLowerCase().includes(search.toLowerCase()) || 
                          u.username.toLowerCase().includes(search.toLowerCase()) || 
                          u.id.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || u.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" /> Foydalanuvchilar (Users)
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">ERD users jadvali asosida loyihalashtirilgan foydalanuvchilar ro'yxati</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="rounded-xl gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4" /> Yangi a'zo qo'shish
        </Button>
      </div>

      {/* Filter Card */}
      <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Ism, foydalanuvchi nomi yoki ID orqali qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="h-4 w-4 text-zinc-400" />}
              className="h-11 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-blue-500/20 dark:bg-zinc-900 dark:border-zinc-800"
            />
          </div>

          <div className="flex gap-2">
            {(["all", "active", "blocked"] as const).map((btn) => (
              <button
                key={btn}
                onClick={() => setFilter(btn)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  filter === btn
                    ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-black"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {btn === "all" && "Barchasi"}
                {btn === "active" && "Faollar"}
                {btn === "blocked" && "Bloklanganlar"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <th className="px-6 py-4">ID (PK)</th>
                <th className="px-6 py-4">Ism-familiya (full_name)</th>
                <th className="px-6 py-4">Foydalanuvchi nomi (username)</th>
                <th className="px-6 py-4">Rol (role)</th>
                <th className="px-6 py-4">Sanatoriya ID</th>
                <th className="px-6 py-4">Yaratilgan sana</th>
                <th className="px-6 py-4">Holat</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-sm">
              <AnimatePresence initial={false}>
                {filtered.map((u) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 text-zinc-700 dark:text-zinc-300"
                  >
                    <td className="px-6 py-4 font-mono font-medium text-xs text-zinc-950 dark:text-white">{u.id}</td>
                    <td className="px-6 py-4 font-medium text-zinc-950 dark:text-white">{u.full_name}</td>
                    <td className="px-6 py-4 font-mono text-xs">@{u.username}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-zinc-900 dark:text-zinc-100">{u.role}</td>
                    <td className="px-6 py-4 text-xs text-zinc-400">{u.sanatorium_id || "NULL"}</td>
                    <td className="px-6 py-4 text-xs text-zinc-400">{u.created_at}</td>
                    <td className="px-6 py-4">
                      {u.status === "active" ? (
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400 rounded-full gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Faol
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400 rounded-full gap-1">
                          <Ban className="h-3 w-3" /> Bloklangan
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleStatus(u.id)}
                          className={`h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors ${
                            u.status === "active"
                              ? "hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/25 text-zinc-500"
                              : "hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/25 text-zinc-500"
                          }`}
                          title={u.status === "active" ? "Bloklash" : "Blokdan chiqarish"}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(u.id)}
                          className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                          title="O'chirish"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-zinc-400 dark:text-zinc-500">
                    Foydalanuvchilar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-950 dark:text-white">Yangi A'zo Kiritish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="usr-name">Ism-familiya (full_name)</Label>
              <Input
                id="usr-name"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="Masalan: Farrux Olimov"
                className="h-11 rounded-xl bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usr-username">Foydalanuvchi nomi (username)</Label>
              <Input
                id="usr-username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Masalan: farrux_olimov"
                className="h-11 rounded-xl bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Rol (role)</Label>
              <Select value={newRole} onValueChange={(val: any) => setNewRole(val)}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Rolni tanlang" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                  <SelectItem value="patient">patient (Oddiy foydalanuvchi)</SelectItem>
                  <SelectItem value="sanatorium_admin">sanatorium_admin (Sanatoriya admini)</SelectItem>
                  <SelectItem value="super_admin">super_admin (Bosh admin)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newRole === "sanatorium_admin" && (
              <div className="space-y-2">
                <Label htmlFor="usr-sanatorium-id">Sanatoriya ID</Label>
                <Input
                  id="usr-sanatorium-id"
                  value={newSanatoriumId}
                  onChange={(e) => setNewSanatoriumId(e.target.value)}
                  placeholder="Sanatoriya raqami (masalan: 1)"
                  className="h-11 rounded-xl bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Holati</Label>
              <Select value={newStatus} onValueChange={(val: any) => setNewStatus(val)}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Holatni tanlang" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                  <SelectItem value="active">Faol (active)</SelectItem>
                  <SelectItem value="blocked">Bloklangan (blocked)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl">Bekor qilish</Button>
            <Button onClick={handleAddUser} className="rounded-xl bg-blue-600 text-white hover:bg-blue-700">Saqlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
