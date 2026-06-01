"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  headmasterData: { nama: string; nip: string } | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, headmasterData: null, logout: async () => {} });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [headmasterData, setHeadmasterData] = useState<{ nama: string; nip: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && db) {
        try {
          const colRef = collection(db, currentUser.uid);
          const snapshot = await getDocs(colRef);
          if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            setHeadmasterData({
              nama: data.nama || "",
              nip: data.nip || "",
            });
          } else {
            setHeadmasterData(null);
          }
        } catch (error: any) {
          console.error("Gagal mengambil data Kepala Sekolah dari Firestore:", error);
          setHeadmasterData(null);
        }
      } else {
        setHeadmasterData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    if (!auth) {
      router.push("/login");
      return;
    }

    await signOut(auth);
    router.push("/login");
  }, [router]);

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/login") {
        router.push("/login");
      } else if (user && pathname === "/login") {
        router.push("/");
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  // If not logged in and not on login page, don't render children to prevent flash of content
  if (!user && pathname !== "/login") {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, headmasterData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
