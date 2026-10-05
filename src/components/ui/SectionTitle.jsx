export default function SectionTitle({ children, action }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-2xl font-bold tracking-[-0.015em]">{children}</h2>
      {action}
    </div>
  )
}
