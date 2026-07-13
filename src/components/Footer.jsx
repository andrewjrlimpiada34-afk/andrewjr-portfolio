import { ArrowUpRight } from 'lucide-react'

function Footer() {
  return (
    <footer className="site-footer">
      <a href="#top">Back to top <ArrowUpRight size={18} /></a>
      <a href="/admin">Admin dashboard <ArrowUpRight size={18} /></a>
      <p>&copy; 2026 Andrew B. Limpiada Jr.</p>
    </footer>
  )
}

export default Footer
