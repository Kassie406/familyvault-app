export default function Footer() {
  return (
    <footer className="footer py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="mb-4 md:mb-0">
            <p className="text-[var(--muted)]">&copy; 2024 FamilyCircle Secure. All rights reserved.</p>
          </div>

          {/* Links */}
          <div className="flex space-x-6">
            <a href="#" className="text-[var(--muted)] hover:text-[var(--brand)] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[var(--muted)] hover:text-[var(--brand)] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-[var(--muted)] hover:text-[var(--brand)] transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
