import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import Home from '@/pages/Home'
import DashboardView from '@/pages/DashboardView'
import AdminHome from '@/pages/admin/AdminHome'
import DatasetList from '@/pages/admin/DatasetList'
import DatasetNew from '@/pages/admin/DatasetNew'
import DatasetDetail from '@/pages/admin/DatasetDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="dashboard/:id" element={<DashboardView />} />
          <Route path="admin" element={<AdminHome />} />
          <Route path="admin/datasets" element={<DatasetList />} />
          <Route path="admin/datasets/new" element={<DatasetNew />} />
          <Route path="admin/datasets/:id" element={<DatasetDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
