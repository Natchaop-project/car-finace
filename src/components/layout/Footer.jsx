import { useStore } from '../../store'

export default function Footer() {
  const { dispatch } = useStore()
  return (
    <footer className="px-5.5 pb-10 text-center text-xs text-ink-3">
      CarFinace · ข้อมูลตัวอย่างสำหรับสาธิต ·{' '}
      <button type="button" className="cursor-pointer text-link hover:underline" onClick={() => dispatch({ type: 'reset' })}>
        รีเซ็ตข้อมูล
      </button>
    </footer>
  )
}
