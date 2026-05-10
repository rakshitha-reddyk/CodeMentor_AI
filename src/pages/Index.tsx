import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CodePreview from "@/components/CodePreview";
import HeroDashboardPreview from "@/components/HeroDashboardPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <Features />
        <CodePreview />
        <HeroDashboardPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
