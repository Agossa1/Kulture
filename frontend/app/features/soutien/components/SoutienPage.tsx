"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LuHeart,
  LuArrowLeft,
  LuStar,
  LuUsers,
  LuMusic,
  LuTrendingUp,
  LuCheck,
  LuShare2,
  LuChevronRight,
  LuSparkles,
  LuCirclePlay,
} from "react-icons/lu";

// ── Types ────────────────────────────────────────────────────────────────────
interface Artist {
  id: string;
  name: string;
  specialty: string;
  city: string;
  image: string;
  coverImage: string;
  raised: number;
  goal: number;
  supporters: number;
  rating: number;
  bio: string;
  tags: string[];
  featured?: boolean;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const ARTISTS: Artist[] = [
  {
    id: "artist-001",
    name: "Awa Kouyaté",
    specialty: "Musique traditionnelle & Kora",
    city: "Dakar, Sénégal",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400",
    coverImage:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=900",
    raised: 485000,
    goal: 750000,
    supporters: 143,
    rating: 4.9,
    bio: "Griotte de renom, Awa perpétue l'art de la kora depuis l'enfance. Son projet vise à enregistrer son premier album studio et sillonner l'Afrique de l'Ouest.",
    tags: ["Kora", "Traditionnel", "Griot"],
    featured: true,
  },
  {
    id: "artist-002",
    name: "Koffi Mensah",
    specialty: "Peinture contemporaine",
    city: "Abidjan, Côte d'Ivoire",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    coverImage:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=900",
    raised: 220000,
    goal: 500000,
    supporters: 67,
    rating: 4.7,
    bio: "Peintre autodidacte qui mêle techniques occidentales et symbolismes africains. Il cherche à financer sa première exposition internationale à Paris.",
    tags: ["Peinture", "Contemporain", "Expressionnisme"],
  },
  {
    id: "artist-003",
    name: "Fatoumata Diallo",
    specialty: "Danse contemporaine & Afrobeats",
    city: "Conakry, Guinée",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    coverImage:
      "https://images.unsplash.com/photo-1540039155732-61122a27b4bb?auto=format&fit=crop&q=80&w=900",
    raised: 310000,
    goal: 400000,
    supporters: 98,
    rating: 4.8,
    bio: "Chorégraphe et danseuse, Fatoumata fusionne la danse contemporaine et les rythmes afrobeats. Son projet : créer une école de danse gratuite pour les jeunes de son quartier.",
    tags: ["Danse", "Afrobeats", "Chorégraphie"],
  },
  {
    id: "artist-004",
    name: "Seydou Traoré",
    specialty: "Hip-Hop & Spoken Word",
    city: "Bamako, Mali",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    coverImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=900",
    raised: 95000,
    goal: 300000,
    supporters: 34,
    rating: 4.6,
    bio: "MC et poète, Seydou utilise sa musique comme vecteur de sensibilisation sociale. Son prochain EP aborde les thèmes de l'exil et de l'identité africaine.",
    tags: ["Hip-Hop", "Rap", "Spoken Word"],
  },
];

const DON_AMOUNTS = [1000, 2500, 5000, 10000, 25000];

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ raised, goal }: { raised: number; goal: number }) {
  const pct = Math.min(100, Math.round((raised / goal) * 100));
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Artist Card ───────────────────────────────────────────────────────────────
function ArtistCard({ artist }: { artist: Artist }) {
  const pct = Math.min(100, Math.round((artist.raised / artist.goal) * 100));
  const fmt = (n: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div
      className={`relative bg-white rounded-sm overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        artist.featured
          ? "border-yellow-300 shadow-lg shadow-yellow-100"
          : "border-gray-100 shadow-sm"
      }`}
    >
      {artist.featured && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-yellow-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow">
          <LuSparkles className="w-3 h-3" /> Coup de cœur
        </div>
      )}

      {/* Cover */}
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        <img
          src={artist.coverImage}
          alt={artist.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Avatar */}
        <div className="absolute -bottom-6 left-5">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-14 h-14 rounded-2xl border-3 border-white object-cover shadow-lg ring-2 ring-white"
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-9 px-5 pb-5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-extrabold text-gray-900 text-lg leading-tight">
              {artist.name}
            </h3>
            <p className="text-xs text-gray-500">{artist.specialty}</p>
          </div>
          <div className="flex items-center gap-1 text-yellow-500 shrink-0 mt-0.5">
            <LuStar className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-bold text-gray-700">{artist.rating}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {artist.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
          {artist.bio}
        </p>

        {/* Progress */}
        <div className="mb-3">
          <ProgressBar raised={artist.raised} goal={artist.goal} />
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>
              <strong className="text-gray-900 font-bold">{fmt(artist.raised)}</strong> collectés
            </span>
            <span>{pct}% de {fmt(artist.goal)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
          <span className="flex items-center gap-1">
            <LuUsers className="w-3.5 h-3.5" />
            {artist.supporters} soutiens
          </span>
          <span className="flex items-center gap-1">
            <LuMusic className="w-3.5 h-3.5" />
            {artist.city}
          </span>
        </div>

        <Link
          href={`/soutien/${artist.id}`}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-yellow-500 hover:text-gray-900 text-white font-bold py-3 rounded-2xl transition-all duration-200 text-sm group"
        >
          <LuHeart className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Soutenir cet artiste
        </Link>
      </div>
    </div>
  );
}

// ── Donation Modal ────────────────────────────────────────────────────────────
function DonationModal({
  artist,
  onClose,
}: {
  artist: Artist;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [done, setDone] = useState(false);

  const fmt = (n: number) =>
    new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
  const amount = selected ?? (custom ? parseInt(custom) : null);

  const handleSubmit = () => {
    if (!amount || amount <= 0) return;
    setDone(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Merci pour votre soutien !</h3>
            <p className="text-gray-500 text-sm mb-6">
              Votre contribution de <strong>{fmt(amount!)}</strong> à {artist.name} a bien été enregistrée.
            </p>
            <button
              onClick={onClose}
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-sm transition-all"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="relative h-28 bg-gray-900 overflow-hidden">
              <img
                src={artist.coverImage}
                alt=""
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center px-6 gap-3">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white"
                />
                <div>
                  <p className="text-white font-extrabold">{artist.name}</p>
                  <p className="text-white/70 text-xs">{artist.specialty}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-3 right-4 text-white/60 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                Choisissez un montant
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                100% de votre don va directement à l'artiste.
              </p>

              {/* Preset amounts */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {DON_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => { setSelected(amt); setCustom(""); }}
                    className={`py-2.5 rounded-2xl text-sm font-bold border-2 transition-all ${
                      selected === amt
                        ? "bg-yellow-500 border-yellow-500 text-gray-900"
                        : "bg-white border-gray-200 text-gray-700 hover:border-yellow-300"
                    }`}
                  >
                    {new Intl.NumberFormat("fr-FR").format(amt)}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="relative mb-6">
                <input
                  type="number"
                  placeholder="Autre montant (FCFA)"
                  value={custom}
                  onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                  className="w-full border-2 border-gray-200 focus:border-yellow-400 outline-none rounded-2xl px-4 py-3 text-sm text-gray-900 transition-colors"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!amount || amount <= 0}
                className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-2xl transition-all text-base"
              >
                <LuHeart className="w-5 h-5" />
                {amount ? `Soutenir avec ${fmt(amount)}` : "Soutenir"}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                Paiement sécurisé · Aucun frais caché
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SoutienPage() {
  const [donateArtist, setDonateArtist] = useState<Artist | null>(null);
  const [filter, setFilter] = useState("Tous");

  const categories = ["Tous", "Musique", "Peinture", "Danse", "Hip-Hop"];

  const filtered =
    filter === "Tous"
      ? ARTISTS
      : ARTISTS.filter((a) =>
          a.tags.some((t) => t.toLowerCase().includes(filter.toLowerCase())) ||
          a.specialty.toLowerCase().includes(filter.toLowerCase())
        );

  const totalRaised = ARTISTS.reduce((s, a) => s + a.raised, 0);
  const totalSupporters = ARTISTS.reduce((s, a) => s + a.supporters, 0);

  const fmt = (n: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gray-950 text-white">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_left,_#f59e0b_0%,_transparent_60%)]" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom_right,_#ec4899_0%,_transparent_60%)]" />

        {/* Back link */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            <LuArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 text-xs font-bold px-4 py-2 rounded-full mb-6 border border-yellow-500/30">
              <LuHeart className="w-3.5 h-3.5 fill-current" />
              Soutenez la culture africaine
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
              Derrière chaque artiste,{" "}
              <span className="text-yellow-400">il y a votre soutien</span>
            </h1>

            <p className="text-white/70 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
              Contribuez directement au projet d'un artiste africain. Chaque
              franc compte pour faire naître une œuvre, un concert, une
              carrière.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: LuHeart, label: "Total collecté", value: fmt(totalRaised) },
                { icon: LuUsers, label: "Donateurs", value: totalSupporters.toLocaleString("fr-FR") },
                { icon: LuTrendingUp, label: "Artistes soutenus", value: ARTISTS.length.toString() },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <Icon className="w-5 h-5 text-yellow-400 mb-2" />
                  <p className="text-xl sm:text-2xl font-extrabold text-white">{value}</p>
                  <p className="text-xs text-white/50 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">
            Comment ça fonctionne ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: LuCirclePlay,
                title: "Découvrez un artiste",
                desc: "Parcourez les profils d'artistes et trouvez celui dont le projet vous inspire.",
              },
              {
                step: "02",
                icon: LuHeart,
                title: "Faites un don",
                desc: "Choisissez le montant qui vous convient. Aucun frais caché, tout va à l'artiste.",
              },
              {
                step: "03",
                icon: LuShare2,
                title: "Partagez & amplifiez",
                desc: "Partagez sur vos réseaux pour que d'autres rejoignent le mouvement.",
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div
                key={step}
                className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100"
              >
                <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <p className="text-xs font-bold text-yellow-600 mb-1">{step}</p>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Artists Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Filter tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Artistes à soutenir
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  filter === cat
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">Aucun artiste dans cette catégorie.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((artist) => (
              <div key={artist.id} className="flex flex-col">
                <ArtistCard artist={artist} />
                <button
                  onClick={() => setDonateArtist(artist)}
                  className="mt-3 flex items-center justify-center gap-1.5 text-sm text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
                >
                  <LuHeart className="w-4 h-4" />
                  Faire un don rapide
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── CTA Banner ── */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Vous êtes un artiste ?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Créez votre profil sur Kulture et commencez à recevoir le soutien de
            votre communauté dès aujourd'hui.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-extrabold px-8 py-4 rounded-full text-lg transition-all shadow-lg shadow-yellow-500/20"
          >
            Rejoindre Kulture
            <LuChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Donation Modal */}
      {donateArtist && (
        <DonationModal
          artist={donateArtist}
          onClose={() => setDonateArtist(null)}
        />
      )}
    </div>
  );
}
