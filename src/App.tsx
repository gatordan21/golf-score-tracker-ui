import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
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
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/golfers" element={<GolfersPage />} />
            <Route path="/golfers/:id" element={<GolferDetailPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/rounds" element={<RoundsPage />} />
            <Route path="/rounds/new" element={<LogRoundPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
