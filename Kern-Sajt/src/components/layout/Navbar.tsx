"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Monitor, Wrench, Cpu, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            }
        };

        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (data) setProfile(data);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="mr-6 flex items-center space-x-2 font-bold text-xl tracking-tight">
                    <Monitor className="h-6 w-6 text-primary" />
                    <span>KERN</span>
                </Link>

                {/* Navigation Links (Desktop) */}
                <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <Link href="/marketplace" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1">
                        <Cpu className="h-4 w-4" />
                        Marketplace
                    </Link>
                    <Link href="/services" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1">
                        <Wrench className="h-4 w-4" />
                        Servis Hub
                    </Link>
                    <Link href="/builder" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1">
                        <Settings className="h-4 w-4" />
                        Sklopi Računar
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex items-center space-x-2 w-1/3 max-w-sm ml-4">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Pretraži CPU, GPU, Servise..."
                            className="w-full pl-9 bg-muted/50"
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                                        <AvatarImage src={profile?.avatar_url} alt={user.email} />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {profile?.full_name?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{profile?.full_name || "Korisnik"}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={`/profile/${profile?.username || user.id}`} className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Moj Profil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/listings" className="cursor-pointer">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Moji Oglasi</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings" className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Postavke</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer focus:text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Odjavi se</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/login">Prijava</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
