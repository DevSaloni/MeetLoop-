import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <TopBar />
      <main className="ml-[240px] px-8 pb-8 pt-24 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
