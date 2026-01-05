import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const AuthScreen: React.FC = () => {
  const { signIn, signUp, signInWithGoogle, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err) {
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    clearError();

    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google sign-in error:", err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearError();
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #FFF9F5 0%, #FFE5E5 50%, #FFF9F5 100%)",
      }}
    >
      <div
        className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8 flex flex-col gap-6"
        style={{
          background: "white",
          border: "1px solid #F0E6E0",
          boxShadow: "0 20px 60px rgba(255, 107, 107, 0.15)",
        }}
      >
        {/* Logo & Title */}
        <div className="text-center">
          <div
            className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #FF6B6B, #FF8E53)" }}
          >
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h1
            className="text-2xl font-semibold tracking-wide mb-2"
            style={{ color: "#2D3436" }}
          >
            {isLogin ? "Welcome Back" : "Join Aura"}
          </h1>
          <p style={{ color: "#636E72", fontSize: "14px" }}>
            {isLogin
              ? "Sign in to access your digital twin."
              : "Create an account to begin your journey."}
          </p>
        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex items-center justify-center gap-3 font-medium py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "#FFF9F5",
            border: "1px solid #F0E6E0",
            color: "#2D3436",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#FFE5E5")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#FFF9F5")}
        >
          {isGoogleLoading ? (
            <span className="flex items-center gap-2">
              <span
                className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: "#F0E6E0", borderTopColor: "#FF6B6B" }}
              />
              Connecting...
            </span>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px" style={{ background: "#F0E6E0" }} />
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "#B2BEC3" }}
          >
            or
          </span>
          <div className="flex-1 h-px" style={{ background: "#F0E6E0" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              className="text-xs uppercase tracking-wider font-semibold ml-1"
              style={{ color: "#FF6B6B" }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm transition-all"
              style={{
                background: "#FFF9F5",
                border: "1px solid #F0E6E0",
                color: "#2D3436",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FF6B6B";
                e.target.style.boxShadow =
                  "0 0 0 3px rgba(255, 107, 107, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#F0E6E0";
                e.target.style.boxShadow = "none";
              }}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-xs uppercase tracking-wider font-semibold ml-1"
              style={{ color: "#FF6B6B" }}
            >
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm transition-all"
              style={{
                background: "#FFF9F5",
                border: "1px solid #F0E6E0",
                color: "#2D3436",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FF6B6B";
                e.target.style.boxShadow =
                  "0 0 0 3px rgba(255, 107, 107, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#F0E6E0";
                e.target.style.boxShadow = "none";
              }}
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="rounded-xl p-3 text-sm text-center"
              style={{
                background: "rgba(255, 107, 107, 0.1)",
                border: "1px solid rgba(255, 107, 107, 0.3)",
                color: "#E55555",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full font-semibold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
            style={{
              background: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
              color: "white",
              boxShadow: "0 4px 14px rgba(255, 107, 107, 0.4)",
            }}
            onMouseOver={(e) => {
              if (!isLoading && !isGoogleLoading) {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(255, 107, 107, 0.5)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(255, 107, 107, 0.4)";
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{
                    borderColor: "rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                  }}
                />
                Processing...
              </span>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2">
          <button
            onClick={toggleMode}
            className="text-sm transition-colors"
            style={{ color: "#636E72" }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#FF6B6B")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#636E72")}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
