import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppShell from '@/components/layout/AppShell'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import Home from '@/pages/Home'
import DashboardView from '@/pages/DashboardView'
import AdminHome from '@/pages/admin/AdminHome'
import DatasetList from '@/pages/admin/DatasetList'
import DatasetNew from '@/pages/admin/DatasetNew'
import DatasetDetail from '@/pages/admin/DatasetDetail'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import { useAuthStore } from '@/stores/authStore'

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 2, retry: 1 } },
})

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate)
  useEffect(() => { hydrate() }, [])
  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <AuthHydrator>
          <Routes>
            {/* public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* protected */}
            <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
              <Route index element={<Home />} />
              <Route path="dashboard/:id" element={<DashboardView />} />
              <Route
                path="admin"
                element={<ProtectedRoute requiredRole="admin"><AdminHome /></ProtectedRoute>}
              />
              <Route
                path="admin/datasets"
                element={<ProtectedRoute requiredRole="admin"><DatasetList /></ProtectedRoute>}
              />
              <Route
                path="admin/datasets/new"
                element={<ProtectedRoute requiredRole="admin"><DatasetNew /></ProtectedRoute>}
              />
              <Route
                path="admin/datasets/:id"
                element={<ProtectedRoute requiredRole="admin"><DatasetDetail /></ProtectedRoute>}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthHydrator>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
