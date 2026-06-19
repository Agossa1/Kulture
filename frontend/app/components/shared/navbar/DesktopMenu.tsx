import Link from "next/link";
import { LuChevronDown } from "react-icons/lu";
import { NavGroup } from "./navbar.config";

interface DesktopMenuProps {
  navGroups: NavGroup[];
  openDropdown: string | null;
  setOpenDropdown: (id: string | null) => void;
}

export default function DesktopMenu({ navGroups, openDropdown, setOpenDropdown }: DesktopMenuProps) {
  return (
    <ul className="hidden lg:flex flex-row gap-8 text-[16px] font-semibold text-gray-600 py-2 items-center">
      <li>
        <Link href="/products" className="transition hover:text-black">
          Product
        </Link>
      </li>

      {navGroups.map((group) => (
        <li key={group.id} className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === group.id ? null : group.id)}
            className="flex items-center gap-1 transition hover:text-black focus:outline-none"
          >
            {group.label}
            <LuChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                openDropdown === group.id ? "rotate-180" : ""
              }`}
            />
          </button>

          {openDropdown === group.id && (
            <div
              className={`absolute left-1/2 -translate-x-1/2 top-full mt-3 ${group.width} max-w-[calc(100vw-2rem)] rounded-lg border border-gray-100 bg-white p-4 shadow-2xl ring-1 ring-black/5 z-50`}
>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2">
                {group.items.map(({ href, icon: Icon, bg, color, label, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3.5 rounded-xl p-3 hover:bg-gray-50 transition group"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-black">{label}</p>
                      {desc && <p className="text-xs text-gray-500 mt-0.5 leading-snug">{desc}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
