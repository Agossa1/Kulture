import Navbar from "./components/shared/navbar";
import HeroSection from "./components/home/HeroSection";
import FeatureSection from "./components/home/FeatureSection";
import TrendingEvents from "./components/home/TrendingEvents";
import TopArtistsSection from "./components/home/TopArtistsSection";
import TestimonialsSection from "./components/home/TestimonialsSection";
import FaqSection from "./components/home/FaqSection";
import CtaSection from "./components/home/CtaSection";
import Footer from "./components/shared/Footer";
import FadeIn from "./components/ui/FadeIn";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FadeIn><FeatureSection /></FadeIn>
        <FadeIn><TrendingEvents /></FadeIn>
        <FadeIn><TopArtistsSection /></FadeIn>
        <FadeIn><TestimonialsSection /></FadeIn>
        <FadeIn><FaqSection /></FadeIn>
        <FadeIn><CtaSection /></FadeIn>
      </main>
      <Footer />
    </div>
  );
}
