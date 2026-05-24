import Link from 'next/link';

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white shrink-0 md:block">
      <div className="h-full py-6 pl-8 pr-6 overflow-y-auto">
        <div className="flex flex-col space-y-8">
          
          {/* Section 1 */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Modules</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/addresses" className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                  Adresses
                </Link>
              </li>
              <li>
                <Link href="/medicines" className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                  Médicaments
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Paramètres</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/settings" className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                  Général
                </Link>
              </li>
              <li>
                <Link href="/auth" className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                  Sécurité
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </aside>
  );
};
