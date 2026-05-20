import { type ReactNode, useEffect, useRef } from 'react'

type BaseModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export const BaseModal = ({ isOpen, onClose, children }: BaseModalProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen) {
      dialog?.showModal()
    } else {
      dialog?.close()
    }
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      className="p-m bg-slate-50 rounded-xl border-0 focus-within:border-0 focus:border-0"
    >
      {children}
    </dialog>
  )
}
