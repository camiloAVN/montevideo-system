import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0F0F0F]">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-600/8 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(233,30,99,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(233,30,99,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Logo mark */}
      <Link href="/inicio" className="absolute top-8 left-8 flex items-center space-x-3 group">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center shadow-lg group-hover:shadow-pink-600/40 transition-shadow duration-200">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">Montevideo CC</span>
      </Link>

      {/* Content */}
      <div className="w-full max-w-md">
        {children}
      </div>

      {/* Back to home link */}
      <Link
        href="/inicio"
        className="absolute bottom-8 text-sm text-zinc-600 hover:text-pink-400 transition-colors"
      >
        ← Volver al inicio
      </Link>
    </div>
  )
}
