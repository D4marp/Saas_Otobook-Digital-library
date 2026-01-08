import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import heroPhone from "@/assets/image.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      <div className="absolute inset-0 gradient-hero -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-center lg:text-left space-y-6 md:space-y-8 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Otobook: Katalogisasi Buku Otomatis, <span className="text-primary">Lebih Cepat 10x Lipat</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Aplikasi revolusioner untuk perpustakaan modern dengan <span className="font-semibold text-foreground">Scan OCR</span>,<span className="font-semibold text-foreground"> Klasifikasi Otomatis</span>, dan{" "}
              <span className="font-semibold text-foreground">Otomasi Proses</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <a href="https://play.google.com/store/apps/details?id=com.otobook.perpustakaan" target="_blank" rel="noopener noreferrer" aria-label="Unduh Otobook di Google Play">
                <Button variant="hero" size="lg" className="gap-2 text-lg group">
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  Unduh Otobook Sekarang
                </Button>
              </a>
              {/* <Button variant="outline" size="lg" className="text-lg">
                Pelajari Lebih Lanjut
              </Button> */}
            </div>

            <div className="flex flex-wrap gap-6 md:gap-8 justify-center lg:justify-start pt-4 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">Scan OCR Cepat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">AI Klasifikasi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">Otomasi RPA</span>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg animate-float">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10" />
              <img src={heroPhone} alt="Otobook App Interface" className="h-auto drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
