'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast'
import { useToast } from '@/hooks/use-toast'

interface ToastProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: 'default' | 'destructive' | null
}

export function Toaster() {
  const { toasts } = useToast()
  const { theme = 'system' } = useTheme()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }: ToastProps) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
