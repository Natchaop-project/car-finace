import { Link, NavLink } from 'react-router'
import { Button, Icon, cx } from '../ui'

const LINKS = [
  { to: '/', label: 'ภาพรวม', end: true },
  { to: '/vehicles', label: 'สต็อกรถ' },
  { to: '/work-orders', label: 'งานซ่อม' },
]

// Translucent sticky bar in the style of apple.com.
export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-nav backdrop-blur-xl backdrop-saturate-180">
      <div className="mx-auto flex h-13 max-w-280 items-center gap-7 px-5.5 max-sm:gap-4 max-sm:px-4">
        <Link to="/" className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.01em] text-ink hover:no-underline">
          <span className="grid size-6.5 place-items-center rounded-lg bg-linear-135 from-[#0071e3] to-[#5ac8fa] text-white">
            <Icon name="car" size={16} strokeWidth={2} />
          </span>
          <span className="max-sm:hidden">CarFinace</span>
        </Link>

        <nav className="flex flex-1 gap-1.5 overflow-x-auto [scrollbar-width:none]">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cx(
                  'rounded-full px-3 py-1.5 text-[13.5px] whitespace-nowrap transition hover:no-underline',
                  isActive ? 'bg-fill-strong font-medium text-ink' : 'text-ink-2 hover:bg-fill hover:text-ink',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Button to="/vehicles/new" size="sm">
          <Icon name="plus" size={15} strokeWidth={2.2} />
          <span className="max-sm:hidden">รับรถเข้า</span>
        </Button>
      </div>
    </header>
  )
}
