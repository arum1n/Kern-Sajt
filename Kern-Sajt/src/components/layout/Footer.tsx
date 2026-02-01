import Link from "next/link";
import { Monitor } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t border-border/40 bg-zinc-950 text-zinc-400 py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand */}
                <div className="space-y-4">
                    <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-zinc-100">
                        <Monitor className="h-6 w-6" />
                        <span>KERN</span>
                    </Link>
                    <p className="text-sm">
                        Vaš pouzdan partner za kupovinu i servisiranje IT opreme.
                        Pronađite idealan računar ili popravite svoj stari.
                    </p>
                </div>

                {/* Marketplace */}
                <div className="space-y-3">
                    <h3 className="text-zinc-100 font-medium">Marketplace</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/marketplace?cat=pc" className="hover:text-white transition-colors">Gotove Konfiguracije</Link></li>
                        <li><Link href="/marketplace?cat=components" className="hover:text-white transition-colors">Komponente</Link></li>
                        <li><Link href="/marketplace?cat=peripherals" className="hover:text-white transition-colors">Periferija</Link></li>
                    </ul>
                </div>

                {/* Servis & Info */}
                <div className="space-y-3">
                    <h3 className="text-zinc-100 font-medium">Platforma</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/services" className="hover:text-white transition-colors">Pronađi Servis</Link></li>
                        <li><Link href="/matchmaker" className="hover:text-white transition-colors">Smart Matchmaker</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-colors">O Nama</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div className="space-y-3">
                    <h3 className="text-zinc-100 font-medium">Podrška</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/faq" className="hover:text-white transition-colors">Česta pitanja</Link></li>
                        <li><Link href="/terms" className="hover:text-white transition-colors">Uslovi korištenja</Link></li>
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Politika privatnosti</Link></li>
                    </ul>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-zinc-900 text-center text-xs">
                &copy; {new Date().getFullYear()} KERN. All rights reserved. Built with precision.
            </div>
        </footer>
    );
}
