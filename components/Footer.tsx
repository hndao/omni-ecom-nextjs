import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background-light text-charcoal border-t border-charcoal/10 py-12 px-6 md:px-20 mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="text-primary scale-75">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 48 48">
              <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" />
            </svg>
          </div>
          <h3 className="font-serif italic text-xl font-bold text-charcoal">LUXE GEMSTONES</h3>
        </div>

        <div className="flex gap-8">
          <Link href="#" className="tracked-tiny font-medium text-charcoal/60 hover:text-primary transition-colors">
            The Archives
          </Link>
          <Link href="#" className="tracked-tiny font-medium text-charcoal/60 hover:text-primary transition-colors">
            Investment Grade
          </Link>
        </div>

        <p className="text-[10px] uppercase tracking-widest text-charcoal/50">
          Crafting elegance at 100,000x the specialization in handcrafted earth treasures and bespoke jewelry design.
        </p>
      </div>
    </footer>
  );
}

