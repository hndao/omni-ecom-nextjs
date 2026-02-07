import Image from "next/image";

export default function EthicalSourcing() {
  return (
    <section className="py-20 flex flex-col md:flex-row items-center gap-0">
      <div className="w-full md:w-[60%] relative h-[600px] overflow-hidden rounded-l-xl">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYwVxtUCmpcKdB_7RXhjj4yoQFHuccBgjMyfDupr7BzFVCF7mku2a6Gg8ShyWV-1Ne3LIFN7T0rSXIv6yv8Fr7ml-lsxfVv4AIgREFUcyKdNHZRRQWYircROGHbSB3ViPBTNCUkiOGfnoDZl8Rcg5lMaTOutqEnckK6ZrzNllnut2jKB_uIEp_ZRdyCCFdWs76U8fot0pHaSr7jn6ebVvXyRW3veV_5kXJ5U6NRie9A2AJ_A0MIO_n4bCTlEIYfCVtnyvVW1TRoEU"
          alt="Macro texture of raw geological stone layers"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      <div className="w-full md:w-[40%] bg-charcoal p-12 md:p-20 text-white flex flex-col justify-center rounded-r-xl -ml-0 md:-ml-10 z-10 relative">
        <span className="tracked-tiny text-primary mb-6">Transparency</span>
        <h2 className="font-serif text-5xl mb-8 leading-tight">
          One-of-a-Kind Ethical Origins
        </h2>
        <p className="text-gray-400 font-light leading-relaxed mb-10">
          Our commitment to ethical sourcing ensures every stone is as pure as
          its origin. We partner directly with artisanal mines to ensure
          transparency and GIA certification for every gemstone in our vault.
        </p>
        <div className="flex items-center gap-4 text-primary">
          <span className="h-[1px] w-12 bg-primary"></span>
          <a
            href="#"
            className="tracked-tiny font-bold hover:tracking-[0.3em] transition-all"
          >
            Read Our Charter
          </a>
        </div>
      </div>
    </section>
  );
}
