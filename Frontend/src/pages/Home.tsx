import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Bot,
  Users,
  BarChart3,
  ArrowRight,
  Check,
  BookOpen,
} from "lucide-react";
import { documentationAPI } from "@/lib/api";

interface Doc {
  id: number;
  type: string;
  title: string;
  platform?: string;
  description: string;
}

export default function Home() {
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

  const features = [
    {
      icon: Code2,
      title: "OCR Solutions",
      description: "Extract text from images with high accuracy across Web, Android, and iOS platforms",
    },
    {
      icon: Bot,
      title: "RPA Automation",
      description: "Automate business processes using Robot Framework with comprehensive documentation",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Complete dashboard for managing users, roles, and permissions efficiently",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Real-time insights and detailed analytics about your automations and OCR usage",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      description: "Perfect for individuals",
      features: [
        "Up to 1,000 OCR requests/month",
        "1 RPA automation",
        "Basic analytics",
        "Email support",
      ],
    },
    {
      name: "Professional",
      price: "$99",
      description: "For growing teams",
      features: [
        "Up to 50,000 OCR requests/month",
        "10 RPA automations",
        "Advanced analytics",
        "Priority support",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited OCR requests",
        "Unlimited RPA automations",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
      ],
    },
  ];

  return (
    <div className="w-full">
      {/* Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            OTobook SaaS
          </Link>
          <div className="flex gap-4 items-center">
            <a href="#features" className="text-gray-700 hover:text-blue-600">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600">
              Pricing
            </a>
            <Link to="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Automation & OCR Made Simple
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Complete SaaS platform for OCR solutions and RPA automation. Extract text,
            automate workflows, and manage your team all in one place.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="p-6 hover:shadow-lg transition">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-lg w-fit mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documentation Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Complete Documentation</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* OCR Documentation */}
            <Card className="p-8 hover:shadow-lg transition">
              <Code2 className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">OCR Implementation</h3>
              <p className="text-gray-600 mb-6">
                Learn how to integrate Optical Character Recognition in your applications.
                Comprehensive guides for Web, Android, and iOS platforms with code examples
                and best practices.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  Web (JavaScript/React)
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  Android (Java/Kotlin)
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  iOS (Swift)
                </div>
              </div>
              <Link to="/documentation/ocr">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  View OCR Documentation
                </Button>
              </Link>
            </Card>

            {/* RPA Documentation */}
            <Card className="p-8 hover:shadow-lg transition">
              <Bot className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Robot Framework & RPA</h3>
              <p className="text-gray-600 mb-6">
                Master Robotic Process Automation using Robot Framework. From installation
                to advanced techniques, including CI/CD integration and OTobook platform
                integration examples.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  Installation & Setup
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  Basics to Advanced
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  CI/CD Integration
                </div>
              </div>
              <Link to="/documentation/rpa">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  View RPA Documentation
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Dynamic Documentation Section */}
      {!loading && docs.length > 0 && (
        <section id="documentation" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              <BookOpen className="inline-block w-8 h-8 mr-2" />
              Complete Documentation
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Everything you need to implement OCR and RPA solutions. Browse our comprehensive guides and code examples.
            </p>

            {/* OCR Documentation */}
            {docs.filter((d) => d.type === "OCR").length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Code2 className="w-6 h-6 mr-2 text-blue-600" />
                  OCR Implementation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {docs
                    .filter((d) => d.type === "OCR")
                    .map((doc) => (
                      <Card key={doc.id} className="p-6 hover:shadow-lg transition">
                        <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                          <Code2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-bold mb-2">{doc.title}</h4>
                        <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
                        {doc.platform && (
                          <Badge className="bg-blue-100 text-blue-800">{doc.platform}</Badge>
                        )}
                      </Card>
                    ))}
                </div>
                <Link to="/documentation/ocr" className="block mt-6">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    View All OCR Documentation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}

            {/* RPA Documentation */}
            {docs.filter((d) => d.type === "RPA").length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Bot className="w-6 h-6 mr-2 text-orange-600" />
                  Robot Framework & RPA
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {docs
                    .filter((d) => d.type === "RPA")
                    .map((doc) => (
                      <Card key={doc.id} className="p-6 hover:shadow-lg transition">
                        <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                          <Bot className="w-5 h-5 text-orange-600" />
                        </div>
                        <h4 className="font-bold mb-2">{doc.title}</h4>
                        <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
                      </Card>
                    ))}
                </div>
                <Link to="/documentation/rpa" className="block mt-6">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    View All RPA Documentation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-6 flex flex-col ${
                  plan.popular ? "ring-2 ring-blue-600 relative" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-gray-600">/month</span>
                  )}
                </div>
                <Button
                  className={`mb-6 ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  Get Started
                </Button>
                <div className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses automating their workflows with OTobook SaaS
          </p>
          <Link to="/dashboard">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Start Free Trial Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><Link to="/documentation/ocr" className="hover:text-white">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Guides</a></li>
              <li><a href="#" className="hover:text-white">API Docs</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
              <li><a href="#" className="hover:text-white">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 OTobook SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
