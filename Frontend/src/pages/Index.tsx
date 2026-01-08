import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Bot, Check, ArrowRight, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ResearchSection from "@/components/ResearchSection";
import DownloadSection from "@/components/DownloadSection";
import Footer from "@/components/Footer";
import { documentationAPI } from "@/lib/api";

interface Doc {
  id: number;
  type: string;
  title: string;
  platform?: string;
  description: string;
}

const Index = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocumentation();
  }, []);

  const fetchDocumentation = async () => {
    try {
      const response = await documentationAPI.getAllDocumentation();
      setDocs(response.data.data || []);
    } catch (err) {
      console.error("Error fetching docs:", err);
      setDocs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ResearchSection />

      {/* Dynamic Documentation Section - INTEGRATED */}
      {!loading && docs.length > 0 && (
        <section id="documentation" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                <BookOpen className="inline-block w-10 h-10 mr-3 text-blue-600" />
                Documentation & Learning Resources
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Complete guides for implementing OCR solutions and RPA automation with code examples and best practices.
              </p>
            </div>

            {/* OCR Documentation Grid */}
            {docs.filter((d) => d.type === "OCR").length > 0 && (
              <div className="mb-20">
                <h3 className="text-2xl md:text-3xl font-bold mb-8 flex items-center text-gray-900">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mr-3"></div>
                  OCR Implementation Guides
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {docs
                    .filter((d) => d.type === "OCR")
                    .map((doc) => (
                      <Card key={doc.id} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-l-4 border-l-blue-600">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                          <Code2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-lg mb-2 text-gray-900">{doc.title}</h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doc.description}</p>
                        {doc.platform && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{doc.platform}</Badge>
                        )}
                      </Card>
                    ))}
                </div>
                <Link to="/documentation/ocr">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold">
                    Explore OCR Documentation
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            )}

            {/* RPA Documentation Grid */}
            {docs.filter((d) => d.type === "RPA").length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-8 flex items-center text-gray-900">
                  <div className="w-2 h-2 rounded-full bg-orange-600 mr-3"></div>
                  Robot Framework & Automation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {docs
                    .filter((d) => d.type === "RPA")
                    .map((doc) => (
                      <Card key={doc.id} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-l-4 border-l-orange-600">
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                          <Bot className="w-6 h-6 text-orange-600" />
                        </div>
                        <h4 className="font-bold text-lg mb-2 text-gray-900">{doc.title}</h4>
                        <p className="text-gray-600 text-sm line-clamp-2">{doc.description}</p>
                      </Card>
                    ))}
                </div>
                <Link to="/documentation/rpa">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-base font-semibold">
                    Explore RPA Documentation
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      <DownloadSection />
      <Footer />
    </div>
  );
};

export default Index;
