import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  Factory,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-[#006600]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-blue-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#006600] to-[#004d00] p-12 text-white">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Factory className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Apex ERP</h1>
                <p className="text-white/70 text-sm">Manufacturing System</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Streamline Your
              <br />
              Manufacturing
              <br />
              Operations
            </h2>

            <p className="text-white/80 text-lg leading-relaxed">
              Integrated ERP solution for production planning, inventory
              management, and quality control. Empower your team with real-time
              visibility and data-driven decisions.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Production Planning</p>
                <p className="text-white/70 text-sm">
                  Efficient material requirement planning
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Inventory Control</p>
                <p className="text-white/70 text-sm">
                  Real-time stock visibility
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Quality Assurance</p>
                <p className="text-white/70 text-sm">
                  Photo validation & QC tracking
                </p>
              </div>
            </div>
          </div>

          <div className="text-white/50 text-sm">
            © 2024 Apex Manufacturing. All rights reserved.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <div className="lg:hidden flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#006600] rounded-lg flex items-center justify-center">
                <Factory className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Apex ERP</h1>
                <p className="text-slate-500 text-sm">Manufacturing System</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome back
            </h2>
            <p className="text-slate-500">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "pl-10 h-12",
                    error && !email && "border-red-500 focus-visible:ring-red-500"
                  )}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium"
                >
                  Password
                </Label>
                <button
                  type="button"
                  className="text-sm text-[#006600] hover:text-[#005500] font-medium"
                  onClick={() =>
                    alert("Please contact your administrator to reset password")
                  }
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "pl-10 pr-10 h-12",
                    error &&
                      !password &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#006600] hover:bg-[#005500] text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-3">Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@apex-erp.com");
                  setPassword("admin123");
                }}
                className="text-left p-2 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
              >
                <span className="font-medium text-slate-700">Super Admin</span>
                <br />
                <span className="text-slate-500">admin@apex-erp.com</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("planning.supervisor@apex-erp.com");
                  setPassword("supervisor123");
                }}
                className="text-left p-2 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
              >
                <span className="font-medium text-slate-700">Planning</span>
                <br />
                <span className="text-slate-500">planning.supervisor@...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
