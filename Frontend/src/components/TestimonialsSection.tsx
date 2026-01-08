import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Wijaya",
    role: "Kepala Perpustakaan Universitas Indonesia",
    content: "Otobook benar-benar mengubah cara kami mengelola katalog. Proses yang dulu memakan waktu berminggu-minggu kini hanya butuh beberapa hari. Efisiensi luar biasa!",
  },
  {
    name: "Prof. Budi Santoso",
    role: "Dosen Ilmu Perpustakaan UGM",
    content: "Sebagai peneliti, saya sangat terkesan dengan akurasi OCR dan kemampuan summarization AI-nya. Ini adalah terobosan nyata untuk dunia perpustakaan Indonesia.",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Apa Kata <span className="text-primary">Mereka?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Testimoni dari para profesional perpustakaan dan akademisi yang telah merasakan manfaat Otobook
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="gradient-card border-none shadow-elegant hover:shadow-hover transition-smooth"
            >
              <CardContent className="p-6 md:p-8 space-y-4">
                <Quote className="w-10 h-10 text-primary opacity-50" />
                <p className="text-muted-foreground text-base md:text-lg italic">
                  "{testimonial.content}"
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
