import Link from "next/link";
import {
  IconBike,
  IconPackage,
  IconMapPin,
  IconNavigation,
  IconShield,
  IconClock,
  IconCheckCircle,
  IconArrowRight,
  IconSparkles,
  IconPhone,
  IconWhatsApp,
} from "@/components/Icons";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Navigation Top Bar */}
      <header className="sticky top-0 z-50 glass-header">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25">
              <IconBike className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-neutral-900">Yeggo</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-700">
                  Dakar
                </span>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/connexion"
              className="px-3.5 sm:px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="px-4 sm:px-5 py-2 text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl shadow-sm hover:shadow transition active:scale-95"
            >
              Créer un compte
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-10 pb-16 sm:py-20">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-orange-200/40 via-amber-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Text & CTA */}
              <div className="lg:col-span-7 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-semibold mb-6 shadow-xs">
                  <IconSparkles className="w-3.5 h-3.5 text-orange-500 animate-spin" />
                  <span>Livraison express à Dakar avec géolocalisation en direct</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight leading-[1.15]">
                  Envoyez vos colis à Dakar,{" "}
                  <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                    suivez le livreur en direct
                  </span>
                </h1>

                <p className="mt-5 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Fini le stress des livreurs injoignables. Suivez votre course virage par virage sur la carte, de la
                  récupération jusqu’à la remise en main propre.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                  <Link
                    href="/inscription"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all flex items-center justify-center gap-2 group active:scale-98"
                  >
                    <span>Commander une course</span>
                    <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/connexion"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-base border border-neutral-200/90 shadow-xs transition active:scale-98 text-center"
                  >
                    Suivre une livraison
                  </Link>
                </div>

                {/* Micro social proof badges */}
                <div className="mt-10 pt-8 border-t border-neutral-200/70 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-neutral-900">~35 min</div>
                    <div className="text-xs text-neutral-500 font-medium">Délai moyen Dakar</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-orange-600">100%</div>
                    <div className="text-xs text-neutral-500 font-medium">Suivi GPS direct</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-neutral-900">0 FCFA</div>
                    <div className="text-xs text-neutral-500 font-medium">Frais d&apos;inscription</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Mockup Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md">
                  {/* Decorative background layers */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000"></div>

                  <div className="relative bg-white/95 backdrop-blur-md rounded-3xl border border-neutral-200 shadow-xl p-6 overflow-hidden">
                    {/* Mockup Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                          <IconPackage className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs text-neutral-400 font-medium">Livraison #YG-8492</div>
                          <div className="text-sm font-bold text-neutral-900">Sacré-Cœur ➔ Almadies</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        <span>En cours</span>
                      </div>
                    </div>

                    {/* Mockup Map Graphic Preview */}
                    <div className="my-4 relative h-40 bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200/70 flex items-center justify-center">
                      <div
                        className="absolute inset-0 opacity-40"
                        style={{
                          backgroundImage:
                            "radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #f8fafc 1px)",
                          backgroundSize: "20px 20px",
                          backgroundPosition: "0 0, 10px 10px",
                        }}
                      />
                      {/* Simulated Route */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 160" fill="none">
                        <path
                          d="M 50 120 C 100 110, 120 50, 250 40"
                          stroke="#F97316"
                          strokeWidth="4"
                          strokeDasharray="6 6"
                        />
                      </svg>
                      {/* Departure pin */}
                      <div className="absolute left-10 bottom-6 flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                          D
                        </div>
                        <span className="text-[10px] font-semibold bg-white/90 px-1.5 rounded shadow-xs mt-1">
                          Sacré-Cœur
                        </span>
                      </div>
                      {/* Driver live pulse pin */}
                      <div className="absolute left-[135px] top-[60px] flex flex-col items-center">
                        <div className="relative">
                          <span className="absolute -inset-1 rounded-full bg-orange-400 animate-ping opacity-75"></span>
                          <div className="relative w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                            <IconBike className="w-4 h-4" />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-neutral-900 text-white px-2 py-0.5 rounded-full shadow mt-1">
                          Moussa (Livreur)
                        </span>
                      </div>
                      {/* Destination pin */}
                      <div className="absolute right-8 top-6 flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                          A
                        </div>
                        <span className="text-[10px] font-semibold bg-white/90 px-1.5 rounded shadow-xs mt-1">
                          Almadies
                        </span>
                      </div>
                    </div>

                    {/* Mockup Driver Contact Bar */}
                    <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                          MD
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-neutral-900">Moussa Diop</div>
                          <div className="text-[11px] text-neutral-500">Yamaha 125cc · 4.9 ★</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
                          <IconPhone className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Progress steps mini bar */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-3 gap-1 text-center text-[11px] font-medium text-neutral-400">
                      <div className="text-orange-600 font-bold flex items-center justify-center gap-1">
                        <IconCheckCircle className="w-3 h-3" /> Récupéré
                      </div>
                      <div className="text-orange-600 font-bold flex items-center justify-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500" /> En route
                      </div>
                      <div>Livré</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features & Benefits */}
        <section className="py-16 bg-white border-y border-neutral-200/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                Pourquoi choisir Yeggo
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 mt-3 tracking-tight">
                La livraison à Dakar, enfin simple et fiable
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base mt-2">
                Pensé spécialement pour les réalités dakarois : adresses par repères, suivi GPS précis et équipe dédiée.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <IconNavigation className="w-6 h-6 text-orange-500" />,
                  title: "Suivi en direct",
                  desc: "Localisez votre livreur sur la carte en temps réel sans avoir à l’appeler toutes les 5 minutes.",
                },
                {
                  icon: <IconMapPin className="w-6 h-6 text-amber-500" />,
                  title: "Repères & Adresses de Dakar",
                  desc: "Indiquez facilement votre boutique, villa ou point de repère familier, avec pointage précis sur la carte.",
                },
                {
                  icon: <IconShield className="w-6 h-6 text-emerald-500" />,
                  title: "Livreurs vérifiés",
                  desc: "Une équipe rigoureusement sélectionnée et encadrée pour garantir l'intégrité de tous vos colis.",
                },
                {
                  icon: <IconClock className="w-6 h-6 text-blue-500" />,
                  title: "Historique & Transparence",
                  desc: "Chaque étape est horodatée. Vous savez exactement quand le colis a été pris en charge et remis.",
                },
                {
                  icon: <IconPackage className="w-6 h-6 text-purple-500" />,
                  title: "Tarif clair & juste",
                  desc: "Estimation instantanée du prix selon la distance (ex: Plateau ➔ Ngor / Almadies). Pas de mauvaise surprise.",
                },
                {
                  icon: <IconWhatsApp className="w-6 h-6 text-green-500" />,
                  title: "Paiement souple",
                  desc: "Réglez comme vous préférez : espèces à la livraison, Wave ou Orange Money en toute simplicité.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="bg-neutral-50/80 hover:bg-white rounded-2xl p-6 border border-neutral-200/80 hover:border-orange-300 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white group-hover:scale-110 border border-neutral-200/80 flex items-center justify-center mb-4 transition-transform shadow-xs">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3-Step Guide */}
        <section className="py-16 bg-[#F8FAFC]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
                Comment ça marche en 3 étapes
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative">
              {[
                {
                  step: "01",
                  title: "Renseignez la course",
                  desc: "Indiquez l'adresse de départ, d'arrivée et les coordonnées du destinataire en moins d'une minute.",
                },
                {
                  step: "02",
                  title: "Un livreur est assigné",
                  desc: "Notre régulateur attribue le coursier le plus proche et confirme le tarif de la course.",
                },
                {
                  step: "03",
                  title: "Suivez et réceptionnez",
                  desc: "Suivez le livreur sur la carte en temps réel jusqu'à la remise sécurisée en main propre.",
                },
              ].map((s, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs relative">
                  <span className="text-3xl font-black text-orange-500/20">{s.step}</span>
                  <h3 className="text-base font-bold text-neutral-900 mt-2 mb-1.5">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Bottom CTA Banner */}
            <div className="mt-14 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-3xl p-8 sm:p-10 text-center shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Prêt à expédier un colis ?</h3>
              <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-md mx-auto">
                Créez votre compte en 30 secondes et lancez votre première livraison dès aujourd&apos;hui.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/inscription"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md transition active:scale-95"
                >
                  Créer mon compte
                </Link>
                <Link
                  href="/connexion"
                  className="px-6 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm transition"
                >
                  J&apos;ai déjà un compte
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200/80 py-8 text-center text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">Yeggo</span>
            <span>·</span>
            <span>Livraison & Logistique Urbaine Dakar 🇸🇳</span>
          </div>
          <div>© {new Date().getFullYear()} Yeggo. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  );
}
