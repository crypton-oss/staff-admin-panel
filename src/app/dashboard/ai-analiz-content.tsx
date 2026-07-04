"use client"

import { useState, useRef, useEffect } from "react"
import { BrainCircuit, Send, Sparkles, TrendingUp, BarChart3, Bot, User, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  sender: "user" | "ai"
  text: string
  timestamp: string
}

export function AIAnalizContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Salom! Men Sihhat Uz AI tahlilchisiman. Loyihaning moliyaviy holati, foydalanuvchilar oqimi, sanatoriyalar bandligi yoki boshqa istalgan tahlillar bo'yicha savollaringizga javob beraman. Menga savolingizni yozing.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSend = () => {
    if (!inputText.trim()) return

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInputText("")
    setLoading(true)

    // Simulate AI generation
    setTimeout(() => {
      let aiResponseText = ""
      const q = userMsg.text.toLowerCase()

      if (q.includes("mablag'") || q.includes("pul") || q.includes("mablagh") || q.includes("daromad") || q.includes("to'lov")) {
        aiResponseText = "📊 **Moliyaviy tahlil hisoboti (AI):**\n\n- **Umumiy tushum:** 0 so'm (statistika yangilanmoqda).\n- **Kutilayotgan to'lovlar:** 0 so'm.\n- **Tavsiya:** Tranzaksiyalar hajmi hozirda minimal darajada. Foydalanuvchilarni jalb etish uchun sanatoriylarga chegirmalar qo'shish tavsiya etiladi."
      } else if (q.includes("foydalanuvchi") || q.includes("mijoz") || q.includes("user")) {
        aiResponseText = "👥 **Foydalanuvchilar faolligi tahlili (AI):**\n\n- Tizimda faol foydalanuvchilar soni minimal darajada.\n- Ro'yxatdan o'tishlar soni bo'yicha dinamika o'rganilmoqda.\n- **Tavsiya:** Mobil ilovada faollikni oshirish uchun yangi ro'yxatdan o'tgan foydalanuvchilarga promo-kod tizimini yo'lga qo'yish maqsadga muvofiq."
      } else if (q.includes("sanatoriya") || q.includes("joy") || q.includes("bron")) {
        aiResponseText = "🏨 **Sanatoriyalar bandligi tahlili (AI):**\n\n- O'rtacha bandlik darajasi hozirda 0% ni ko'rsatmoqda.\n- Eng ko'p so'rov yuboriladigan hududlar: Zomin, Chortoq.\n- **Tavsiya:** Sanatoriya profillaridagi rasmlar va sharoitlar ma'lumotlarini to'liq to'ldirish bron qilishlar sonini 15% gacha oshirishi mumkin."
      } else {
        aiResponseText = "Savolingiz uchun rahmat. Men Sihhat Uz ma'lumotlar bazasi asosida har qanday statistik hisobotni shakllantira olaman. Iltimos, moliyaviy ko'rsatkichlar, foydalanuvchilar oqimi yoki sanatoriyalar haqida so'rang."
      }

      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, aiMsg])
      setLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-purple-600 dark:text-purple-400" /> Sihhat AI Analiz
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Sun'iy intellekt tahlilchisi bilan to'g'ridan-to'g'ri muloqot va hisobotlar olish oynasi</p>
      </div>

      {/* Stats row - all set to 0 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 shrink-0">
        <Card className="p-4 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">Kelasi oylik bashorat qilingan o'sish</p>
            <p className="text-lg font-bold text-zinc-950 dark:text-white mt-0.5">+0%</p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
            <TrendingUp className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">O'rtacha foydalanuvchi reytingi</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-zinc-950 dark:text-white">0.0 / 5.0</span>
              <div className="flex text-zinc-300 dark:text-zinc-700 text-xs">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>☆</span>
                ))}
              </div>
            </div>
          </div>
          <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
            <BarChart3 className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[450px]">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-[80%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs ${
                  msg.sender === "user" 
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black" 
                    : "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400"
                }`}>
                  {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div>
                  <div className={`rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white rounded-tr-none"
                      : "bg-purple-50/50 text-zinc-800 dark:bg-purple-950/10 dark:text-zinc-200 rounded-tl-none border border-purple-100/40 dark:border-purple-900/30 whitespace-pre-line"
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-zinc-400 mt-1 ${msg.sender === "user" ? "text-right" : ""}`}>{msg.timestamp}</p>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 max-w-[80%]"
              >
                <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100/40 dark:border-purple-900/30 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-600" />
                  <span>AI tahlil qilmoqda...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 shrink-0">
          <div className="flex gap-2 items-center">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="AI tahlilchisidan loyiha haqida so'rang (masalan: 'Mablag'lar holati', 'Sanatoriyalar bandligi')..."
              rows={1}
              className="flex-1 min-h-[44px] max-h-[120px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
            />
            <Button
              onClick={handleSend}
              disabled={loading || !inputText.trim()}
              className="h-11 w-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shrink-0 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
