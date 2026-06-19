import Link from "next/link";
import { LuChevronDown } from "react-icons/lu";
import { NavGroup } from "./navbar.config";

interface MobileMenuProps {
  navGroups: NavGroup[];
  openDropdown: string | null;
  setOpenDropdown: (id: string | null) => void;
  onClose: () => void;
}

export default function MobileMenu({ navGroups, openDropdown, setOpenDropdown, onClose }: MobileMenuProps) {
  return (
    <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-2xl z-50 max-h-[85vh] overflow-y-auto">
      <div className="flex flex-col px-4 py-6 gap-6">
        <Link href="/products" className="text-[16px] font-medium text-gray-700 hover:text-black" onClick={onClose}>
          Product
        </Link>

        {navGroups.map((group) => {
          const mobileId = `${group.id}-mobile`;
          const isOpen = openDropdown === mobileId;
          return (
            <div key={group.id} className="flex flex-col gap-3">
              <button
                onClick={() => setOpenDropdown(isOpen ? null : mobileId)}
                className="flex items-center justify-between text-[16px] font-medium text-gray-700 hover:text-black focus:outline-none"
              >
                {group.label}
                <LuChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="flex flex-col gap-3 pl-4 border-l-2 border-yellow-100 mt-1">
                  {group.items.map(({ href, icon: Icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={onClose}
                      className="flex items-center gap-3 text-[14px] text-gray-600 hover:text-black font-medium"
                    >
                      <Icon className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <hr className="border-gray-100 my-2" />

        <div className="flex flex-col gap-4 font-medium">
          <Link
            href="/login"
            onClick={onClose}
            className="w-full text-center py-3 text-gray-700 border border-gray-200 rounded-xl transition hover:bg-gray-50"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            onClick={onClose}
            className="w-full text-center py-3 bg-yellow-500 text-white rounded-xl shadow-md shadow-yellow-500/10 transition hover:bg-yellow-600 font-semibold"
          >
            Inscription
          </Link>
        </div>
      </div>
    </div>
  );
}
