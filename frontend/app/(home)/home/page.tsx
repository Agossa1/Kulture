import HomeNavbar from "@/app/components/shared/navbar/HomeNavbar";
import ListesTickets from "@/app/features/tickets/components/Listes.tickets";
import CategoryFilter from "@/app/features/home/components/CategoryFilter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HomeNavbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Barre de filtres par catégories */}
        <div className="mt-1 max-w-6xl mx-auto">
          <CategoryFilter />
        </div>
        
        <ListesTickets/>
      </main>
    </div>
  );
}