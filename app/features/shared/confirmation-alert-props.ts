export interface ConfirmationAlertProps<T> {
  message?: string
  onCancel: () => void
  isOpen: boolean
  item: T | null
}
