import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Footer from './Footer'
import NavBar from './NavBar'

export default function AppLayout() {
  const { pathname } = useLocation()
  // Block body on purpose: newer browsers return a Promise from scrollTo, and an
  // effect must return nothing or a cleanup function.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-280 px-5.5 pt-12 pb-24 max-sm:px-4 max-sm:pt-8">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
