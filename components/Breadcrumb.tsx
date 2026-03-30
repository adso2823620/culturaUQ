import Link from 'next/link'

interface Crumb {
  label: string
  href?: string
}

interface Props {
  crumbs: Crumb[]
}

export default function Breadcrumb({ crumbs }: Props) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-gray-300">›</span>}
            {isLast || !crumb.href ? (
              <span className="font-medium" style={{ color: '#0f4c75' }}>
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="transition-colors hover:underline"
                style={{ color: '#2a9d8f' }}
              >
                {crumb.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}