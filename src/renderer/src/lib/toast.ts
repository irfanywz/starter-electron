import { useToastStore, type ToastOptions } from '@/store/useToastStore'

type Options = Omit<ToastOptions, 'type'>

/**
 * Pakai dari mana aja (komponen, store, event handler), nggak perlu hook:
 *   toast.success('Saved')
 *   toast.error('Gagal', { duration: 8000 })
 */
export const toast = {
  info: (message: string, options?: Options) =>
    useToastStore.getState().show(message, { ...options, type: 'info' }),
  success: (message: string, options?: Options) =>
    useToastStore.getState().show(message, { ...options, type: 'success' }),
  warning: (message: string, options?: Options) =>
    useToastStore.getState().show(message, { ...options, type: 'warning' }),
  error: (message: string, options?: Options) =>
    useToastStore.getState().show(message, { ...options, type: 'error' }),
  dismiss: (id: number) => useToastStore.getState().dismiss(id)
}
