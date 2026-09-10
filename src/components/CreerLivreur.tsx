"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreerLivreur() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [zone, setZone] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/livreurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, telephone, password, zone: zone || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.error ?? "Erreur");
        return;
      }
      setNom("");
      setTelephone("");
      setPassword("");
      setZone("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-neutral-100 p-5 grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          placeholder="Nom complet"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          required
          type="tel"
          placeholder="Téléphone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          required
          type="password"
          placeholder="Mot de passe"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          placeholder="Zone (facultatif)"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      {erreur && <p className="text-sm text-red-600">{erreur}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-orange-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-orange-600 transition disabled:opacity-50"
      >
        {loading ? "..." : "Ajouter ce livreur"}
      </button>
    </form>
  );
}
