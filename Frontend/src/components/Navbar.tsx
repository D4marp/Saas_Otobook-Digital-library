import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!authToken);
  }, [location]);

  const isLandingPage = location.pathname === "/";

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              O
            </div>
            <span className="text-gray-900">Otobook</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isLandingPage ? (
              <>
                <button
                  onClick={() => scrollToSection("documentation")}
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  Documentation
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
                  Home
                </Link>
                <Link to="/documentation/ocr" className="text-gray-700 hover:text-blue-600 transition font-medium">
                  OCR Docs
                </Link>
                <Link to="/documentation/rpa" className="text-gray-700 hover:text-blue-600 transition font-medium">
                  RPA Docs
                </Link>
              </>
            )}

            {/* Auth Links */}
            <div className="flex gap-3 items-center border-l border-gray-200 pl-8">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button className="bg-blue-600 hover:bg-blue-700">Dashboard</Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col gap-3">
              {isLandingPage ? (
                <>
                  <button
                    onClick={() => scrollToSection("documentation")}
                    className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded font-medium"
                  >
                    Documentation
                  </button>
                </>
              ) : (
                <>
                  <Link to="/">
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded font-medium">
                      Home
                    </button>
                  </Link>
                  <Link to="/documentation/ocr">
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded font-medium">
                      OCR Docs
                    </button>
                  </Link>
                  <Link to="/documentation/rpa">
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded font-medium">
                      RPA Docs
                    </button>
                  </Link>
                </>
              )}
              <hr className="my-2" />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Dashboard</Button>
                  </Link>
                  <Button
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    variant="outline"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="w-full justify-start text-gray-700">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
