import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <Link to="/" className="rounded underline focus-visible:outline-2 focus-visible:outline-offset-4">Return home</Link>
    </div>
  )
}
