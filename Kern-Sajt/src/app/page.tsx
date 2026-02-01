import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Cpu, Laptop, Wrench } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-background">
        <div className="container mx-auto relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
              KERN
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              IT Marketplace & Service Hub. <br className="hidden sm:inline" />
              Kupuj pametno, održavaj profesionalno.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="h-12 px-8 text-lg" asChild>
                <Link href="/matchmaker">
                  Pronađi idealan PC <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg" asChild>
                <Link href="/marketplace">
                  Pretraži Oglase
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Cpu className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Smart Matchmaker</h3>
              <p className="text-muted-foreground">
                Ne znate koji PC vam treba? Ispunite kratku anketu i naš algoritam će pronaći savršenu konfiguraciju za vas.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Laptop className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Verified Marketplace</h3>
              <p className="text-muted-foreground">
                Sigurna kupovina i prodaja. Svi tehnički podaci su standardizovani, a prodavci verifikovani.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Wrench className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Service Hub</h3>
              <p className="text-muted-foreground">
                Pronađite najbliži servis, zatražite procjenu popravke i pratite status svog uređaja online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-background border-t border-border/50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Zašto KERN?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Verifikovani Prodavci",
              "Fiksne Specifikacije",
              "Edukativni Sadržaj",
              "Lokalna Podrška"
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center space-x-2 text-lg font-medium text-foreground/80">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
