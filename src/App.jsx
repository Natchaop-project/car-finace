import { BrowserRouter, Route, Routes } from 'react-router'
import AppLayout from './components/layout/AppLayout'
import { Empty } from './components/ui'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import VehicleDetail from './pages/VehicleDetail'
import VehicleNew from './pages/VehicleNew'
import WorkOrders from './pages/WorkOrders'
import { StoreProvider } from './store'

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="vehicles" element={<Inventory />} />
            <Route path="vehicles/new" element={<VehicleNew />} />
            <Route path="vehicles/:id" element={<VehicleDetail />} />
            <Route path="work-orders" element={<WorkOrders />} />
            <Route path="*" element={<Empty>ไม่พบหน้านี้</Empty>} />
          </Route>
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  )
}
