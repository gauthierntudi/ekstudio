import Hero from "@/components/Hero";
import Method from "@/components/Method";
import Studio from "@/components/Studio";
import Values from "@/components/Values";
import Clients from "@/components/Clients";
import Footer from "@/components/Footer";
import SectionScroll from "@/components/SectionScroll";

export default function Home() {
  return (
    <main className="relative">
      <SectionScroll />
      <Hero />
      <Method />
      <Studio />
      <Values />
      <Clients />
      <Footer />
    </main>
  );
}
