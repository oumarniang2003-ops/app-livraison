export const STATUT_LABEL: Record<string, string> = {
  en_attente: "En attente d'un livreur",
  assignee: "Livreur assigné",
  colis_recupere: "Colis récupéré",
  en_livraison: "En livraison",
  livre: "Livré",
  annule: "Annulé",
};

export const STATUT_COLOR: Record<string, string> = {
  en_attente: "bg-neutral-100 text-neutral-700",
  assignee: "bg-blue-100 text-blue-700",
  colis_recupere: "bg-amber-100 text-amber-700",
  en_livraison: "bg-orange-100 text-orange-700",
  livre: "bg-green-100 text-green-700",
  annule: "bg-red-100 text-red-700",
};
