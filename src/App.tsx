import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/context/AuthContext'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { AppShell } from '@/components/layout/AppShell'
import HomePage from '@/pages/HomePage'
import GolfersPage from '@/pages/GolfersPage'
import GolferDetailPage from '@/pages/GolferDetailPage'
import CoursesPage from '@/pages/CoursesPage'
import CourseDetailPage from '@/pages/CourseDetailPage'
import RoundsPage from '@/pages/RoundsPage'
import LogRoundPage from '@/pages/LogRoundPage'
import StatsPage from '@/pages/StatsPage'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
              <Route path="/golfers" element={<ErrorBoundary><GolfersPage /></ErrorBoundary>} />
              <Route path="/golfers/:id" element={<ErrorBoundary><GolferDetailPage /></ErrorBoundary>} />
              <Route path="/courses" element={<ErrorBoundary><CoursesPage /></ErrorBoundary>} />
              <Route path="/courses/:id" element={<ErrorBoundary><CourseDetailPage /></ErrorBoundary>} />
              <Route path="/rounds" element={<ErrorBoundary><RoundsPage /></ErrorBoundary>} />
              <Route path="/rounds/new" element={<ErrorBoundary><LogRoundPage /></ErrorBoundary>} />
              <Route path="/stats" element={<ErrorBoundary><StatsPage /></ErrorBoundary>} />
            </Route>
          </Routes>
          <Toaster richColors position="bottom-right" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
