import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background-light dark:bg-background-dark border-t border-charcoal/5 dark:border-white/5 py-12 px-6 md:px-20 mt-10">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="text-primary scale-75">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 48 48">
              <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" />
            </svg>
          </div>
          <h3 className="font-serif italic text-xl font-bold">ETHEREAL</h3>
        </div>

        <div className="flex gap-8">
          <Link href="#" className="tracked-tiny font-medium hover:text-primary transition-colors">
            Instagram
          </Link>
          <Link href="#" className="tracked-tiny font-medium hover:text-primary transition-colors">
            Pinterest
          </Link>
          <Link href="#" className="tracked-tiny font-medium hover:text-primary transition-colors">
            Journal
          </Link>
        </div>

        <p className="text-[10px] uppercase tracking-widest text-charcoal/40 dark:text-white/40">
          © 2024 Ethereal Earth Gems. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

