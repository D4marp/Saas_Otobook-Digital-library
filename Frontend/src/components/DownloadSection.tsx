import { Button } from "@/components/ui/button";
import { Download, Smartphone } from "lucide-react";

const DownloadSection = () => {
  return (
    <section id="download" className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-16 shadow-elegant">
          <div className="relative z-10 text-center space-y-6 md:space-y-8">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 mb-4">
              <Smartphone className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Siap Meningkatkan Efisiensi Perpustakaan Anda?</h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">Bergabunglah dengan perpustakaan yang telah merasakan revolusi katalogisasi digital dengan Otobook</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a href="https://play.google.com/store/apps/details?id=com.otobook.perpustakaan" target="_blank" rel="noopener noreferrer" aria-label="Unduh Otobook di Google Play">
                <Button variant="hero" size="lg" className="gap-2 text-lg group">
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  Unduh Otobook Sekarang
                </Button>
              </a>
              {/* <Button variant="outline" size="lg" className="text-lg border-2">
                Hubungi Kami
              </Button> */}
            </div>

            <p className="text-sm text-muted-foreground">Tersedia untuk Android & iOS • Gratis untuk institusi pendidikan</p>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-0" />
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
