
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { Logo } from '../components/Logo';

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-warm-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-coral-light rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gold/20 rounded-full blur-3xl opacity-60"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-warm-gray rounded-[32px] shadow-soft p-8 relative z-10">
        
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex justify-center animate-float">
             <Logo size={80} className="drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight mb-2">
            {isLogin ? 'Welcome Back' : 'Join Aura'}
          </h1>
          <p className="text-text-sec text-sm">
            {isLogin ? 'Your digital twin missed you.' : 'Let your Aura find your people.'}
          </p>
        </div>

        {/* Social Login */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white border border-warm-gray hover:bg-gray-50 text-text-main font-bold py-3.5 rounded-2xl transition-all shadow-sm mb-6"
        >
           <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-warm-gray" />
          <span className="text-xs uppercase tracking-wider text-text-muted font-bold">or</span>
          <div className="flex-1 h-px bg-warm-gray" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-sec ml-1 uppercase">Email</label>
            <input
              type="email"
              required
              className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-text-main placeholder-text-muted focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all font-medium"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-sec ml-1 uppercase">Password</label>
            <input
              type="password"
              required
              className="w-full bg-warm-white border border-warm-gray rounded-xl px-4 py-3 text-text-main placeholder-text-muted focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-text-main hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg shadow-black/10 transition-all mt-4 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                 <Icons.Loader2 className="animate-spin" size={20} />
                 Processing...
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="text-center pt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-semibold text-text-sec hover:text-coral transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>

      </div>
    </div>
  );
};
