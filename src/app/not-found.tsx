import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-3xl font-bold tracking-tight mb-3">Page Not Found</h2>
      <p className="text-zinc-400 mb-6">The photo or page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-full bg-zinc-100 text-zinc-900 font-medium text-sm hover:bg-zinc-200 transition-colors"
      >
        Return to Gallery
      </Link>
    </div>
  )
}
