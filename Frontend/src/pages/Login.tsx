import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulasi login
    if (email && password) {
      setTimeout(() => {
        localStorage.setItem("authToken", "demo_token_12345");
        localStorage.setItem("userEmail", email);
        navigate("/dashboard");
      }, 1000);
    } else {
      setError("Silakan isi email dan password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-blue-600">
            OTobook SaaS
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Login to your account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-900 mb-2">
                Demo Credentials:
              </p>
              <div className="text-xs text-blue-800 space-y-1 font-mono">
                <p>Email: demo@otobook.com</p>
                <p>Password: demo123</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
