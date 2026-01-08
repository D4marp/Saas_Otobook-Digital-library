import { Card, CardContent } from "@/components/ui/card";
import ocrIcon from "@/assets/feature-ocr.png";
import summaryIcon from "@/assets/feature-summary.png";
import rpaIcon from "@/assets/feature-rpa.png";

const features = [
  {
    icon: ocrIcon,
    title: "Scan OCR",
    description: "Penangkapan data otomatis judul, penulis, dan ISBN dari sampul atau halaman buku dengan teknologi OCR canggih.",
  },
  {
    icon: summaryIcon,
    title: "Klasifikasi Instan",
    description: "Pembuatan klasifikasi otomatis dari isi buku menggunakan AI, menghemat waktu dalam proses katalogisasi.",
  },
  {
    icon: rpaIcon,
    title: "RPA Automation",
    description: "Otomasi penuh proses input data ke sistem katalog perpustakaan, mengurangi kesalahan manual hingga 95%.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Fitur Utama <span className="text-primary">Otobook</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">Teknologi terdepan untuk mengubah cara perpustakaan mengelola katalog buku</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="gradient-card border-none shadow-elegant hover:shadow-hover transition-smooth transform hover:-translate-y-2">
              <CardContent className="p-6 md:p-8 text-center space-y-4">
                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 p-4 flex items-center justify-center">
                  <img src={feature.icon} alt={feature.title} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
