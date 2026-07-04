"use client"

import { useState } from "react"
import { WalletCards, Plus, Search, CheckCircle2, AlertCircle, Clock, Trash, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Transaction {
  id: string
  booking_id: string
  sanatorium: string
  amount: number
  date: string
  transaction_id: string
  status: "pending" | "half_paid" | "fully_paid" | "refunded"
}

// Single transaction left as a template for backend integration
const initialTransactions: Transaction[] = [
  { 
    id: "1", 
    booking_id: "101", 
    sanatorium: "Zomin Sanatoriysi", 
    amount: 2400000, 
    date: "2026-07-04", 
    transaction_id: "PAYME-987654", 
    status: "fully_paid" 
  }
]

export function MablaghlarContent() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "half_paid" | "fully_paid" | "refunded">("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  
  // New transaction state
  const [newBookingId, setNewBookingId] = useState("")
  const [newSanatorium, setNewSanatorium] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const [newTransactionId, setNewTransactionId] = useState("")
  const [newStatus, setNewStatus] = useState<"pending" | "half_paid" | "fully_paid" | "refunded">("fully_paid")

  const handleAddTransaction = () => {
    if (!newBookingId || !newSanatorium || !newAmount || !newTransactionId) return
    
    const newTx: Transaction = {
      id: String(transactions.length + 1),
      booking_id: newBookingId,
      sanatorium: newSanatorium,
      amount: Number(newAmount),
      date: new Date().toISOString().split("T")[0],
      transaction_id: newTransactionId,
      status: newStatus
    }
    
    setTransactions([newTx, ...transactions])
    setIsAddOpen(false)
    window.dispatchEvent(new CustomEvent("show-success-notification", { detail: { message: "To'lov muvaffaqiyatli qo'shildi!" } }))
    
    // Reset Form
    setNewBookingId("")
    setNewSanatorium("")
    setNewAmount("")
    setNewTransactionId("")
    setNewStatus("fully_paid")
  }

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const filtered = transactions.filter(t => {
    const matchesSearch = t.booking_id.toLowerCase().includes(search.toLowerCase()) || 
                          t.sanatorium.toLowerCase().includes(search.toLowerCase()) ||
                          t.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
                          t.id.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || t.status === filter
    return matchesSearch && matchesFilter
  })

  const totalBalance = transactions
    .filter(t => t.status === "fully_paid" || t.status === "half_paid")
    .reduce((sum, t) => sum + (t.status === "half_paid" ? t.amount / 2 : t.amount), 0)

  const pendingAmount = transactions
    .filter(t => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">Mablag'lar va Tranzaksiyalar (Payments)</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">ERD Payments jadvali asosida loyihalashtirilgan moliyaviy oqimlar ko'rinishi</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="rounded-xl gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4" /> To'lov qo'shish
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Jami Balans</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <WalletCards className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-4 text-zinc-900 dark:text-white">{totalBalance.toLocaleString()} so'm</h3>
          <p className="text-xs text-emerald-600 mt-1">✓ Tasdiqlangan (fully_paid/half_paid) summasi</p>
        </Card>

        <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Kutilayotgan Summa</span>
            <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-4 text-zinc-900 dark:text-white">{pendingAmount.toLocaleString()} so'm</h3>
          <p className="text-xs text-amber-600 mt-1">⌛ Kutilayotgan (pending) to'lovlar</p>
        </Card>

        <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Jami to'lovlar</span>
            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <RefreshCw className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-4 text-zinc-900 dark:text-white">{transactions.length} ta</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Jadvaldagi umumiy yozuvlar soni</p>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Booking ID, Sanatoriya yoki Tranzaksiyadan qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-blue-500/20 dark:bg-zinc-900 dark:border-zinc-800"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {(["all", "pending", "half_paid", "fully_paid", "refunded"] as const).map((btn) => (
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
                {btn === "pending" && "Kutilmoqda"}
                {btn === "half_paid" && "Yarim to'lov"}
                {btn === "fully_paid" && "To'liq to'lov"}
                {btn === "refunded" && "Qaytarilgan"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="overflow-hidden bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <th className="px-6 py-4">ID (PK)</th>
                <th className="px-6 py-4">Booking ID (FK)</th>
                <th className="px-6 py-4">Sanatoriya</th>
                <th className="px-6 py-4">Tranzaksiya ID</th>
                <th className="px-6 py-4">Sana</th>
                <th className="px-6 py-4">Summa (so'm)</th>
                <th className="px-6 py-4">Holat (payment_status)</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-sm">
              <AnimatePresence initial={false}>
                {filtered.map((t) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 text-zinc-700 dark:text-zinc-300"
                  >
                    <td className="px-6 py-4 font-mono font-medium text-xs text-zinc-950 dark:text-white">{t.id}</td>
                    <td className="px-6 py-4 font-mono font-medium text-zinc-500 dark:text-zinc-400">#{t.booking_id}</td>
                    <td className="px-6 py-4 font-medium text-zinc-950 dark:text-white">{t.sanatorium}</td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{t.transaction_id}</td>
                    <td className="px-6 py-4 text-xs text-zinc-400">{t.date}</td>
                    <td className="px-6 py-4 font-semibold text-zinc-950 dark:text-white">
                      {t.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {t.status === "fully_paid" && (
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400 rounded-full gap-1">
                          <CheckCircle2 className="h-3 w-3" /> fully_paid
                        </Badge>
                      )}
                      {t.status === "half_paid" && (
                        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-400 rounded-full gap-1">
                          <Clock className="h-3 w-3" /> half_paid
                        </Badge>
                      )}
                      {t.status === "pending" && (
                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-400 rounded-full gap-1">
                          <Clock className="h-3 w-3" /> pending
                        </Badge>
                      )}
                      {t.status === "refunded" && (
                        <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400 rounded-full gap-1">
                          <AlertCircle className="h-3 w-3" /> refunded
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(t.id)}
                        className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-zinc-400 dark:text-zinc-500">
                    To'lovlar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-950 dark:text-white">Yangi To'lov Qo'shish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tx-booking-id">Booking ID (FK)</Label>
              <Input
                id="tx-booking-id"
                value={newBookingId}
                onChange={(e) => setNewBookingId(e.target.value)}
                placeholder="Buyurtma ID si (masalan: 102)"
                className="h-11 rounded-xl bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tx-sanatorium">Sanatoriya</Label>
              <Input
                id="tx-sanatorium"
                value={newSanatorium}
                onChange={(e) => setNewSanatorium(e.target.value)}
                placeholder="Masalan: Chortoq Sanatoriysi"
                className="h-11 rounded-xl bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tx-amount">To'lov Summasi (so'm)</Label>
              <Input
                id="tx-amount"
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="2400000"
                className="h-11 rounded-xl bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tx-transaction-id">Tranzaksiya ID (Click/Payme)</Label>
              <Input
                id="tx-transaction-id"
                value={newTransactionId}
                onChange={(e) => setNewTransactionId(e.target.value)}
                placeholder="Masalan: CLICK-9912384"
                className="h-11 rounded-xl bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>To'lov Holati (payment_status)</Label>
              <Select value={newStatus} onValueChange={(val: any) => setNewStatus(val)}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Holatni tanlang" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                  <SelectItem value="fully_paid">fully_paid</SelectItem>
                  <SelectItem value="half_paid">half_paid</SelectItem>
                  <SelectItem value="pending">pending</SelectItem>
                  <SelectItem value="refunded">refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl">Bekor qilish</Button>
            <Button onClick={handleAddTransaction} className="rounded-xl bg-blue-600 text-white hover:bg-blue-700">Saqlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
