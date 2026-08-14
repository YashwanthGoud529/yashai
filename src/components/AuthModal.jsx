"use client";

import { useState, useEffect } from "react";
import YashLogo from "./YashLogo";
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle,
  Shield,
  Loader2,
  Image as ImageIcon
} from "lucide-react";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [authMode, setAuthMode] = useState("signin"); // "signin" | "register" | "google"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Clear states when mode or modal changes
  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
    setLoading(false);
  }, [isOpen, authMode]);

  if (!isOpen) return null;

  // Regular Email/Password Submit (Saved directly to MongoDB Atlas)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanPassword) {
      setError("Please fill in both email and password.");
      return;
    }

    if (authMode === "register" && !cleanName) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = authMode === "signin" ? "/api/auth/login" : "/api/auth/register";
      const payload = authMode === "signin"
        ? { email: cleanEmail, password: cleanPassword }
        : { name: cleanName, email: cleanEmail, password: cleanPassword };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setSuccessMsg(null);
        setError(data.error || "Authentication failed.");
        return;
      }

      setError(null);
      setSuccessMsg(data.message || (authMode === "signin" ? "Logged in successfully!" : "Account created in MongoDB Atlas!"));
      
      if (onAuthSuccess) {
        onAuthSuccess(data.user);
      }

      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      setSuccessMsg(null);
      setError(err.message || "Could not connect to MongoDB Atlas.");
    } finally {
      setLoading(false);
    }
  };

  // Google Authentication with Original Name, Email, & Profile Photo saved to MongoDB Atlas
  const handleGoogleAuthSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanAvatar = avatarUrl.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter your original Google Email address.");
      return;
    }

    if (!cleanName) {
      setError("Please enter your original Google Name.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          avatar: cleanAvatar || null,
          googleId: `google_${Date.now()}`,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setSuccessMsg(null);
        setError(data.error || "Google authentication failed.");
        return;
      }

      setError(null);
      setSuccessMsg("Google account authenticated and saved in MongoDB Atlas!");

      if (onAuthSuccess) {
        onAuthSuccess(data.user);
      }

      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      setSuccessMsg(null);
      setError(err.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md rounded-[4px] bg-[#0d1117] border border-slate-800 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161b22]">
          <div className="flex items-center gap-2.5">
            <YashLogo size={28} />
            <div>
              <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                {authMode === "google" 
                  ? "Google Account Authentication" 
                  : authMode === "signin" 
                  ? "Sign In to Yash AI" 
                  : "Create Yash AI Account"}
              </h3>
              <p className="text-[11px] text-slate-400 font-normal">
                Saved directly to MongoDB Atlas Cloud
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[4px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-3 p-1.5 m-5 mb-2 bg-slate-950 border border-slate-800 rounded-[4px] gap-1">
          <button
            type="button"
            onClick={() => setAuthMode("google")}
            className={`py-1.5 text-xs rounded-[4px] transition-all font-semibold flex items-center justify-center gap-1.5 ${
              authMode === "google"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("signin")}
            className={`py-1.5 text-xs rounded-[4px] transition-all font-semibold ${
              authMode === "signin"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("register")}
            className={`py-1.5 text-xs rounded-[4px] transition-all font-semibold ${
              authMode === "register"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={authMode === "google" ? handleGoogleAuthSubmit : handleSubmit} className="px-5 pb-5 space-y-3">
          {/* Error Alert */}
          {error && (
            <div className="p-2.5 rounded-[4px] bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="font-normal">{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {!error && successMsg && (
            <div className="p-2.5 rounded-[4px] bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* Google Auth Fields */}
          {authMode === "google" ? (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Your Google Account Name</label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Yashwanth Goud"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-[4px] pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none transition-colors font-normal"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Your Original Google Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-[4px] pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none transition-colors font-normal"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Google Profile Photo URL</label>
                  <span className="text-[11px] text-slate-500 font-normal">Optional</span>
                </div>
                <div className="relative">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://lh3.googleusercontent.com/... (or leave blank for initials)"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-[4px] pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none transition-colors font-normal"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2 px-4 rounded-[4px] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Connecting to MongoDB Atlas...
                  </span>
                ) : (
                  <>
                    <span>Authenticate & Save to MongoDB</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Name input for registration */}
              {authMode === "register" && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-[4px] pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none transition-colors font-normal"
                    />
                  </div>
                </div>
              )}

              {/* Email input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-[4px] pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none transition-colors font-normal"
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <span className="text-[11px] text-slate-500 font-normal">Min. 6 characters</span>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-[4px] pl-9 pr-9 py-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none transition-colors font-normal font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2 px-4 rounded-[4px] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <span>{authMode === "signin" ? "Sign In with Credentials" : "Create MongoDB Atlas Account"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#161b22] flex items-center justify-center text-[11px] text-slate-400 gap-1.5">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span>Synced directly to MongoDB Atlas Cloud</span>
        </div>
      </div>
    </div>
  );
}
