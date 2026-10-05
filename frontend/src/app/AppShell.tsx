import { NavLink, Outlet } from 'react-router'
import { useUiPreferences } from '../state/uiPreferences'

export default function AppShell() {
  const compactSpacing = useUiPreferences((state) => state.compactSpacing)

  return (
    <div className={`mx-auto max-w-3xl text-slate-900 ${compactSpacing ? 'space-y-4 p-4' : 'space-y-8 p-8'}`}>
      <header>
        <nav aria-label="Main navigation" className="flex gap-4">
          <NavLink to="/" end className="rounded underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 aria-[current=page]:font-semibold">Home</NavLink>
          <NavLink to="/foundation" className="rounded underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 aria-[current=page]:font-semibold">Foundation</NavLink>
        </nav>
      </header>
      <main><Outlet /></main>
    </div>
  )
}
