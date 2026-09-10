"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InscriptionPage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, telephone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.error ?? "Erreur lors de l'inscription");
        return;
      }
      router.push("/app");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
        <h1 className="text-2xl font-bold mb-6">Créer un compte</h1>

        <label className="block text-sm font-medium mb-1">Nom complet</label>
        <input
          required
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full border border-neutral-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <label className="block text-sm font-medium mb-1">Numéro de téléphone</label>
        <input
          type="tel"
          required
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          placeholder="77 123 45 67"
          className="w-full border border-neutral-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <label className="block text-sm font-medium mb-1">Mot de passe</label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-neutral-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {erreur && <p className="text-sm text-red-600 mb-4">{erreur}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white rounded-lg py-2.5 font-medium hover:bg-orange-600 transition disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>

        <p className="text-sm text-neutral-500 mt-4 text-center">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="text-orange-600 font-medium">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}
