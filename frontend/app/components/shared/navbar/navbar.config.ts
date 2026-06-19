import { ElementType } from "react";
import {
  LuHeartHandshake,
  LuAward,
  LuUsers,
  LuTicket,
  LuPalette,
  LuCalendar,
  LuMusic,
  LuMic,
  LuTent,
  LuGlassWater,
  LuImage,
  LuPartyPopper,
  LuStore,
  LuBriefcase,
  LuSparkles,
  LuDribbble
} from "react-icons/lu";

export interface NavItem {
  href: string;
  icon: ElementType;
  bg: string;
  color: string;
  label: string;
  desc: string;
}

export interface NavGroup {
  id: string;
  label: string;
  width: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    id: "features",
    label: "Features",
    width: "w-[1000px]",
    items: [
      {
        href: "/soutien",
        icon: LuHeartHandshake,
        bg: "bg-pink-50",
        color: "text-pink-600",
        label: "Soutien aux artistes",
        desc: "Soutenez vos artistes locaux préférés.",
      },
      {
        href: "/classement-organisateurs",
        icon: LuAward,
        bg: "bg-yellow-50",
        color: "text-yellow-600",
        label: "Meilleurs organisateurs",
        desc: "Découvrez les organisateurs les mieux notés.",
      },
      {
        href: "/classement-artistes",
        icon: LuUsers,
        bg: "bg-blue-50",
        color: "text-blue-600",
        label: "Meilleurs artistes",
        desc: "Les talents les plus appréciés du moment.",
      },
      {
        href: "/outils-partenaires",
        icon: LuUsers,
        bg: "bg-blue-50",
        color: "text-blue-600",
        label: "Outils partenaires",
        desc: "Nous sommes à vos côtés pour faire grandir votre audience.",
      },
      {
        href: "/communications",
        icon: LuUsers,
        bg: "bg-blue-50",
        color: "text-blue-600",
        label: "Communications",
        desc: "Restez connectés au prets de votre public avec nos outils de communication intégrés.",
      },
      {
        href: "/cagnotte",
        icon: LuUsers,
        bg: "bg-blue-50",
        color: "text-blue-600",
        label: "Cagnottes",
        desc: "Créez des cagnottes pour soutenir vos projets artistiques et culturels.",
      },
      {
        href: "/promotions-sons-albums",
        icon: LuUsers,
        bg: "bg-blue-50",
        color: "text-blue-600",
        label: "Promotions de sons et albums",
        desc: "Promouvez vos sons et albums directement sur notre plateforme pour toucher un public plus large.",
      },
       {
        href: "/Ventes d'œuvres et d'objets d'art",
        icon: LuUsers,
        bg: "bg-blue-50",
        color: "text-blue-600",
        label: " Ventes d'œuvres et d'objets d'art",
        desc: " Vendez vos œuvres et objets d'art directement sur notre marketplace pour atteindre des collectionneurs et amateurs d'art.",
      },
    ],
  },
  {
    id: "marketplace",
    label: "Marketplace",
    width: "w-[1000px]",
    items: [
      {
        href: "/list-tickets",
        icon: LuTicket,
        bg: "bg-orange-50",
        color: "text-orange-600",
        label: "Ventes de tickets",
        desc: "Achetez vos billets en quelques clics.",
      },
      {
        href: "/marketplace/oeuvres",
        icon: LuPalette,
        bg: "bg-purple-50",
        color: "text-purple-600",
        label: "Œuvres artistiques",
        desc: "Découvrez et achetez des œuvres uniques.",
      },
      {
        href: "/marketplace/evenements",
        icon: LuCalendar,
        bg: "bg-blue-50",
        color: "text-blue-600",
        label: "Événements",
        desc: "Parcourez tous les événements à venir.",
      },
    ],
  },
  {
    id: "categories",
    label: "Catégories",
    width: "w-[1000px]",
    items: [
      {
        href: "/marketplace/clubs-soirees",
        icon: LuGlassWater,
        bg: "bg-cyan-100",
        color: "text-cyan-600",
        label: "Clubs & soirées",
        desc: "",
      },
      {
        href: "/marketplace/concerts",
        icon: LuMusic,
        bg: "bg-pink-100",
        color: "text-pink-600",
        label: "Concerts & spectacles",
        desc: "",
      },
      {
        href: "/marketplace/festivals",
        icon: LuTent,
        bg: "bg-lime-100",
        color: "text-lime-600",
        label: "Festivals",
        desc: "",
      },
      {
        href: "/marketplace/expositions",
        icon: LuImage,
        bg: "bg-yellow-100",
        color: "text-yellow-600",
        label: "Expositions et lieux culturels",
        desc: "",
      },
      {
        href: "/marketplace/fetes-plein-air",
        icon: LuPartyPopper,
        bg: "bg-orange-100",
        color: "text-orange-600",
        label: "Fêtes en plein air",
        desc: "",
      },
      {
        href: "/marketplace/salons-grand-public",
        icon: LuStore,
        bg: "bg-red-100",
        color: "text-red-600",
        label: "Salons grand public",
        desc: "",
      },
      {
        href: "/marketplace/salons-professionnels",
        icon: LuBriefcase,
        bg: "bg-purple-100",
        color: "text-purple-600",
        label: "Salons professionnels",
        desc: "",
      },
      {
        href: "/marketplace/conferences",
        icon: LuMic,
        bg: "bg-sky-100",
        color: "text-sky-600",
        label: "Conférences",
        desc: "",
      },
      {
        href: "/marketplace/evenements-etudiants",
        icon: LuSparkles,
        bg: "bg-fuchsia-100",
        color: "text-fuchsia-600",
        label: "Événements étudiants",
        desc: "",
      },
      {
        href: "/marketplace/sport",
        icon: LuDribbble,
        bg: "bg-green-100",
        color: "text-green-600",
        label: "Sport",
        desc: "",
      },
    ],
  },
];
