import { useEffect } from 'react'
import Icon from './Icon'

// Button row at the bottom of a sheet's form.
export function SheetActions({ children }) {
  return <div className="mt-6 flex justify-end gap-2.5">{children}</div>
}

// Centered modal sheet. Children unmount when closed, so form state resets. Closes on Escape or a click on the backdrop.
export default function Sheet({ open, title, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-80 grid animate-fade place-items-center bg-overlay p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[calc(100vh-32px)] w-full max-w-130 animate-rise overflow-y-auto rounded-panel bg-surface p-7 shadow-[0_24px_80px_rgba(0,0,0,0.25)] max-sm:p-5"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-[21px] font-semibold tracking-[-0.01em]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="grid size-7.5 cursor-pointer place-items-center rounded-full bg-fill-strong text-ink-2 hover:text-ink"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
        {children}
        {footer && <div className="mt-6 flex justify-end gap-2.5">{footer}</div>}
      </div>
    </div>
  )
}
