import { ToastActionElement } from '../components/ui/toast'

type ToasterToast = {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
}

export function useToast(): {
  toasts: ToasterToast[]
  toast: (props: Omit<ToasterToast, 'id'>) => {
    id: string
    dismiss: () => void
    update: (props: ToasterToast) => void
  }
  dismiss: (toastId?: string) => void
}

export function toast(props: Omit<ToasterToast, 'id'>): {
  id: string
  dismiss: () => void
  update: (props: ToasterToast) => void
}
