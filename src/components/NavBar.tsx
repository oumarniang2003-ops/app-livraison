"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconBike, IconLogOut } from "@/components/Icons";

export default function NavBar({ titre, home }: { titre: string; home: string }) {
  const router = useRouter();

  async function deconnexion() {
    await fetch("/api/auth/deconnexion", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 glass-header">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href={home} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <IconBike className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-neutral-900">Yeggo</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                Dakar
              </span>
            </div>
            <span className="text-xs text-neutral-500 font-medium line-clamp-1">{titre}</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={deconnexion}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition"
            title="Se déconnecter"
          >
            <IconLogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
}
