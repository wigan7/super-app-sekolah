"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, LogIn, Key, AlertTriangle } from "lucide-react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth) {
      setError("Konfigurasi Firebase belum lengkap. Hubungi admin untuk pengaturan environment Vercel.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError("Email atau Password salah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) {
      setError("Konfigurasi Firebase belum lengkap. Hubungi admin untuk pengaturan environment Vercel.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError(`Gagal login dengan Google: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-tr from-slate-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 rounded-full bg-indigo-300/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 rounded-full bg-purple-300/30 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-75 h-75 rounded-full bg-pink-300/20 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="w-full max-w-55 bg-white/70 rounded-2xl border border-slate-200/70 shadow-lg shadow-slate-900/5 p-3 mb-5"
          >
            <Image
              src="/logo-simaks.png"
              alt="Logo SIMAKS"
              width={880}
              height={320}
              className="w-full h-auto object-contain"
              priority
            />
          </motion.div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-indigo-700 uppercase">
            <Lock className="w-3.5 h-3.5" />
            Portal Resmi Kepala Sekolah
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-900 to-purple-900 mb-2 text-center">
            SIMAKS
          </h1>
          <p className="text-slate-500 font-medium text-center text-sm">
            Sistem Informasi Manajemen Administrasi Kepala Sekolah
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-600"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email Kepala Sekolah</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kepsek@sekolah.sch.id"
                className="pl-12 h-14 rounded-2xl bg-white/50 border-slate-200/60 focus-visible:ring-indigo-500 focus-visible:bg-white text-base transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Key className="w-5 h-5" />
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-12 h-14 rounded-2xl bg-white/50 border-slate-200/60 focus-visible:ring-indigo-500 focus-visible:bg-white text-base transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-base shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Login Sekarang
              </>
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/60"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/70 backdrop-blur-2xl text-slate-500 font-medium">Atau lanjutkan dengan</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            variant="outline"
            className="w-full mt-6 h-14 rounded-2xl bg-white/80 hover:bg-slate-50 border-slate-200/60 text-slate-700 font-bold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3"
          >
            <GoogleIcon className="w-5 h-5" />
            Login dengan Google
          </Button>
        </div>

        <div className="mt-8 text-center border-t border-slate-200/50 pt-6">
          <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Sistem Informasi Terenkripsi & Aman
          </p>
          <p className="mt-2 text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
            SIMAKS
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Shield(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}

function GoogleIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
