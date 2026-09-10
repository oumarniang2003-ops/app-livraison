"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavBar({ titre, home }: { titre: string; home: string }) {
  const router = useRouter();

  async function deconnexion() {
    await fetch("/api/auth/deconnexion", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white">
      <Link href={home} className="font-bold text-lg">
        Yeggo <span className="text-neutral-400 font-normal text-sm">· {titre}</span>
      </Link>
      <button
        onClick={deconnexion}
        className="text-sm text-neutral-500 hover:text-neutral-900 transition"
      >
        Déconnexion
      </button>
    </header>
  );
}
