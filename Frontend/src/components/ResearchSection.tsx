import research1 from "@/assets/otobook-perpus.jpg";
import research2 from "@/assets/pens-loc.jpg";
import research3 from "@/assets/testing-ocr.jpeg";

const images = [
  { src: research1, alt: "Penelitian Otobook di Perpustakaan" },
  { src: research2, alt: "Pameran PENSASI di PENS" },
  { src: research3, alt: "Pengujian Fitur Scan OCR" },
];

const ResearchSection = () => {
  return (
    <section id="research" className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Divalidasi Melalui <span className="text-primary">Penelitian Akademis</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">Otobook telah melalui riset mendalam dan pengujian komprehensif di berbagai perpustakaan untuk memastikan efektivitas dan keandalan sistem</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {images.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl shadow-elegant hover:shadow-hover transition-smooth aspect-video">
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover transform group-hover:scale-110 transition-smooth" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-6">
                <p className="text-background font-semibold">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-primary">10x</div>
            <p className="text-muted-foreground">Lebih Cepat</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-primary">95%</div>
            <p className="text-muted-foreground">Akurasi Data</p>
          </div>
          {/* <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-primary">50+</div>
            <p className="text-muted-foreground">Perpustakaan Partner</p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
