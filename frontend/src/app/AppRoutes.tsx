import { Route, Routes } from 'react-router'
import HomePage from '../pages/HomePage'
import FoundationPage from '../pages/FoundationPage'
import NotFoundPage from '../pages/NotFoundPage'
import AppShell from './AppShell'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="foundation" element={<FoundationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
