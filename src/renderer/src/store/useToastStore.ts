import { create } from 'zustand'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastOptions {
  type?: ToastType
  /** ms. 0 = nggak hilang sendiri. Default: 3500 (error: 5000) */
  duration?: number
}

export interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastStore {
  toasts: Toast[]
  show: (message: string, options?: ToastOptions) => number
  dismiss: (id: number) => void
}

const MAX_VISIBLE = 4
let nextId = 1
const timers = new Map<number, ReturnType<typeof setTimeout>>()

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  show: (message, { type = 'info', duration } = {}) => {
    const id = nextId++
    const ms = duration ?? (type === 'error' ? 5000 : 3500)

    // Kalau kebanyakan, yang paling lama dibuang
    set((s) => ({ toasts: [...s.toasts, { id, type, message }].slice(-MAX_VISIBLE) }))
    if (ms > 0) timers.set(id, setTimeout(() => get().dismiss(id), ms))
    return id
  },

  dismiss: (id) => {
    clearTimeout(timers.get(id))
    timers.delete(id)
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
  }
}))
