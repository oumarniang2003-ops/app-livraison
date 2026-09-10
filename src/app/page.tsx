import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <span className="text-xl font-bold tracking-tight">Yeggo</span>
        <nav className="flex gap-3 text-sm">
          <Link href="/connexion" className="px-4 py-2 rounded-full hover:bg-neutral-200 transition">
            Connexion
          </Link>
          <Link
            href="/inscription"
            className="px-4 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-700 transition"
          >
            Créer un compte
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-5xl mx-auto w-full px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Envoyez un colis à Dakar,{" "}
              <span className="text-orange-500">suivez-le en vrai temps réel</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-600">
              Fini les livreurs injoignables et les colis qui se perdent. Avec Yeggo,
              vous voyez où est votre colis à chaque instant, du départ jusqu&apos;à la remise en main propre.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/inscription"
                className="px-6 py-3 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
              >
                Envoyer un colis
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              {
                titre: "Suivi en direct",
                texte: "Localisez votre livreur sur la carte, sans avoir à l'appeler.",
              },
              {
                titre: "Preuve de livraison",
                texte: "Statut confirmé à chaque étape : récupéré, en route, livré.",
              },
              {
                titre: "Paiement flexible",
                texte: "Cash, Wave ou Orange Money selon ce qui vous arrange.",
              },
            ].map((f) => (
              <div key={f.titre} className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
                <h3 className="font-semibold">{f.titre}</h3>
                <p className="text-sm text-neutral-600 mt-1">{f.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="text-center text-sm text-neutral-400 py-6">
        Yeggo — Dakar, Sénégal
      </footer>
    </div>
  );
}
