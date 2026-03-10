import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user, changePassword, logout } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const validatePassword = (password: string): boolean => {
    // Min 8 chars, must contain letter and number
    if (password.length < 8) return false;
    if (!/[a-zA-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (!validatePassword(formData.newPassword)) {
      setError(
        "Password must be at least 8 characters and contain both letters and numbers"
      );
      return;
    }

    if (formData.newPassword === formData.currentPassword) {
      setError("New password must be different from current password");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess(true);

      // Auto redirect after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 3) return { score, label: "Fair", color: "bg-yellow-500" };
    if (score <= 4) return { score, label: "Good", color: "bg-blue-500" };
    return { score, label: "Strong", color: "bg-green-500" };
  };

  const strength = passwordStrength(formData.newPassword);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#006600] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Change Your Password
          </h1>
          <p className="text-slate-500 mt-2">
            {user?.forceChangePassword
              ? "You must change your password before continuing"
              : "Update your password for security"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-green-700">
                  Password changed successfully! Redirecting...
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="text-slate-700 font-medium"
              >
                Current Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  placeholder="Enter current password"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                  className="pl-10 pr-10"
                  disabled={isLoading || success}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      current: !showPasswords.current,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-slate-700 font-medium"
              >
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className={cn(
                    "pl-10 pr-10",
                    formData.newPassword &&
                      !validatePassword(formData.newPassword) &&
                      "border-yellow-500"
                  )}
                  disabled={isLoading || success}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-300",
                          strength.color
                        )}
                        style={{ width: `${(strength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        strength.score <= 2
                          ? "text-red-600"
                          : strength.score <= 3
                          ? "text-yellow-600"
                          : strength.score <= 4
                          ? "text-blue-600"
                          : "text-green-600"
                      )}
                    >
                      {strength.label}
                    </span>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500">
                Password must be at least 8 characters and contain both letters
                and numbers
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-slate-700 font-medium"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className={cn(
                    "pl-10 pr-10",
                    formData.confirmPassword &&
                      formData.newPassword !== formData.confirmPassword &&
                      "border-red-500"
                  )}
                  disabled={isLoading || success}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {formData.confirmPassword &&
                formData.newPassword !== formData.confirmPassword && (
                  <p className="text-xs text-red-500">
                    Passwords do not match
                  </p>
                )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#006600] hover:bg-[#005500] text-white font-semibold"
              disabled={
                isLoading ||
                success ||
                !formData.currentPassword ||
                !formData.newPassword ||
                !formData.confirmPassword ||
                formData.newPassword !== formData.confirmPassword ||
                !validatePassword(formData.newPassword)
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  Update Password
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => logout()}
              disabled={isLoading}
            >
              Sign Out
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Having trouble? Contact your system administrator
        </p>
      </div>
    </div>
  );
}
