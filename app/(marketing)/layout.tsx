import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="BildOut" className="h-8 w-8" />
            <span className="text-xl font-bold text-brand-slate font-heading">BildOut</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/templates" className="text-sm font-medium text-slate-600 hover:text-brand-orange transition-colors">
              Templates
            </Link>
            <Link href="/guides" className="text-sm font-medium text-slate-600 hover:text-brand-orange transition-colors">
              Guides
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-brand-orange transition-colors">
              Pricing
            </Link>
            <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-brand-orange transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-slate-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Company */}
            <div>
              <h3 className="font-semibold text-brand-slate mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-semibold text-brand-slate mb-4">Products</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/templates" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">
                    Invoice Templates
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">
                    Features
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-brand-slate mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/guides" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">
                    How-To Guides
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-brand-slate mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t pt-8 text-center">
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} BildOut. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
