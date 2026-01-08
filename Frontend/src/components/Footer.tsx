import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">O</span>
              </div>
              <span className="text-xl font-bold">Otobook</span>
            </div>
            <p className="text-muted-foreground">
              Aplikasi revolusioner untuk katalogisasi buku otomatis dengan teknologi OCR, AI Summarization, dan RPA.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tautan Cepat</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-smooth">
                  Fitur
                </a>
              </li>
              <li>
                <a href="#research" className="hover:text-foreground transition-smooth">
                  Penelitian
                </a>
              </li>
              {/* <li>
                <a href="#testimonials" className="hover:text-foreground transition-smooth">
                  Testimoni
                </a>
              </li> */}
              <li>
                <a href="#download" className="hover:text-foreground transition-smooth">
                  Unduh
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Kontak</h3>
            <ul className="space-y-3 text-muted-foreground">
              {/* <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@otobook.id</span>
              </li> */}
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+62 896-0132-1118</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Surabaya, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Otobook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
