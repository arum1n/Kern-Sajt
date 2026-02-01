"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    MapPin,
    Star,
    Verified,
    Edit,
    Cpu,
    Clock,
    Wrench,
    Image as ImageIcon,
    MessageSquare,
    ChevronRight,
    Camera,
    User
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
    const params = useParams()
    const router = useRouter()
    const username = params.username as string
    const [profile, setProfile] = useState<any>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [listings, setListings] = useState<any[]>([])
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editLoading, setEditLoading] = useState(false)
    const [editData, setEditData] = useState({
        full_name: "",
        bio: "",
        address: "",
        user_type: "seller",
        avatar_url: "",
        username: ""
    })
    const [usernameError, setUsernameError] = useState("")
    const supabase = createClient()

    const isOwner = currentUser?.id === profile?.id

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

            // Get current user session
            const { data: { session } } = await supabase.auth.getSession()
            setCurrentUser(session?.user ?? null)

            // First try to fetch by username
            let { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single()

            // If not found by username, try by id
            if (!profileData && profileError) {
                const { data: profileById, error: errorById } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', username)
                    .single()

                if (profileById) {
                    profileData = profileById
                    profileError = null
                }
            }

            if (profileData) {
                setProfile(profileData)
                setEditData({
                    full_name: profileData.full_name || "",
                    bio: profileData.bio || "",
                    address: profileData.address || "",
                    user_type: profileData.user_type || "seller",
                    avatar_url: profileData.avatar_url || "",
                    username: profileData.username || ""
                })

                // Fetch listings for this user
                const { data: listingsData } = await supabase
                    .from('listings')
                    .select('*')
                    .eq('user_id', profileData.id)

                if (listingsData) setListings(listingsData)

                // Fetch services if serviser
                if (profileData.user_type === 'serviser') {
                    const { data: servicesData } = await supabase
                        .from('services_offered')
                        .select('*')
                        .eq('serviser_id', profileData.id)

                    if (servicesData) setServices(servicesData)
                }
            } else if (session?.user && (username === session.user.id || username === session.user.email?.split('@')[0])) {
                // Fallback: If no profile in DB but this is the logged-in user, create a mock profile
                const mockProfile = {
                    id: session.user.id,
                    full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "Korisnik",
                    username: session.user.email?.split('@')[0] || session.user.id.substring(0, 8),
                    email: session.user.email,
                    bio: "",
                    address: "",
                    user_type: "seller",
                    avatar_url: session.user.user_metadata?.avatar_url || "",
                    created_at: session.user.created_at || new Date().toISOString(),
                    rating: 0
                }
                setProfile(mockProfile)
                setEditData({
                    full_name: mockProfile.full_name,
                    bio: mockProfile.bio,
                    address: mockProfile.address,
                    user_type: mockProfile.user_type,
                    avatar_url: mockProfile.avatar_url,
                    username: mockProfile.username
                })
            }

            setLoading(false)
        }

        fetchData()
    }, [username])

    const handleUpdateProfile = async () => {
        if (!currentUser) {
            alert("Morate biti prijavljeni da biste uredili profil.")
            return
        }

        // Validate username
        if (!editData.username || editData.username.trim().length < 3) {
            setUsernameError("Username mora imati najmanje 3 karaktera.")
            setEditLoading(false)
            return
        }

        setEditLoading(true)
        setUsernameError("")

        // Check if username is already taken by another user
        const { data: existingUser, error: checkError } = await supabase
            .from('profiles')
            .select('id, username')
            .eq('username', editData.username.trim())
            .neq('id', currentUser.id)
            .single()

        if (existingUser) {
            setUsernameError("Ovaj username je već zauzet. Molimo izaberite drugi.")
            setEditLoading(false)
            return
        }

        // Use upsert - this will INSERT if no row exists, or UPDATE if it does
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: currentUser.id,
                full_name: editData.full_name,
                bio: editData.bio,
                address: editData.address,
                user_type: editData.user_type,
                avatar_url: editData.avatar_url,
                username: editData.username.trim()
            }, { onConflict: 'id' })

        if (error) {
            console.error("Profile update error:", error)
            // If RLS blocks the update, still update local state so user sees changes
            if (error.message.includes('row-level security') || error.code === '42501') {
                setProfile((prev: any) => ({
                    ...prev,
                    ...editData,
                    id: currentUser.id,
                    username: editData.username.trim(),
                    created_at: prev?.created_at || new Date().toISOString()
                }))
                alert("Profil ažuriran lokalno! (Za trajno spremanje, potrebno je podesiti RLS policy u Supabase)")
            } else {
                alert("Greška pri ažuriranju: " + error.message)
            }
        } else {
            // Update local state immediately
            setProfile((prev: any) => ({ ...prev, ...editData, username: editData.username.trim() }))
            alert("Profil uspješno ažuriran!")
            // Redirect to new username URL if username changed
            if (editData.username.trim() !== profile?.username) {
                window.location.href = `/profile/${editData.username.trim()}`
            } else {
                window.location.reload()
            }
        }
        setEditLoading(false)
    }

    if (loading) {
        return (
            <div className="container mx-auto py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Učitavanje profila...</p>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold">Profil nije pronađen</h1>
                <p className="text-muted-foreground">Korisnik sa ovim imenom ne postoji.</p>
                <Button className="mt-4" asChild>
                    <Link href="/">Nazad na početnu</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-20 pt-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Left Sidebar - Profile Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="relative group w-fit mx-auto md:mx-0">
                            <Avatar className="h-48 w-48 border-4 border-background shadow-xl z-20 relative">
                                <AvatarImage src={profile.avatar_url} className="object-cover" />
                                <AvatarFallback className="text-4xl bg-muted">
                                    {profile.full_name?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {isOwner && (
                                <div className="absolute bottom-2 right-2 z-30 bg-background rounded-full p-1 border shadow-sm cursor-pointer" title="Change Avatar">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[450px]">
                                            <DialogHeader>
                                                <DialogTitle>Uredi Profil</DialogTitle>
                                                <DialogDescription>
                                                    Izvršite promjene na vašem profilu ovdje.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-6 py-4">
                                                <div className="grid gap-2">
                                                    <Label>Tip Profila</Label>
                                                    <RadioGroup
                                                        defaultValue={editData.user_type}
                                                        onValueChange={(val) => setEditData({ ...editData, user_type: val })}
                                                        className="grid grid-cols-2 gap-4"
                                                    >
                                                        <div>
                                                            <RadioGroupItem value="seller" id="seller" className="peer sr-only" />
                                                            <Label
                                                                htmlFor="seller"
                                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                            >
                                                                <User className="mb-2 h-6 w-6" />
                                                                <span className="text-sm font-medium">Prodavac</span>
                                                            </Label>
                                                        </div>
                                                        <div>
                                                            <RadioGroupItem value="serviser" id="serviser" className="peer sr-only" />
                                                            <Label
                                                                htmlFor="serviser"
                                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                            >
                                                                <Wrench className="mb-2 h-6 w-6" />
                                                                <span className="text-sm font-medium">Serviser</span>
                                                            </Label>
                                                        </div>
                                                    </RadioGroup>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="username">Username</Label>
                                                    <Input
                                                        id="username"
                                                        value={editData.username}
                                                        onChange={(e) => {
                                                            setEditData({ ...editData, username: e.target.value })
                                                            setUsernameError("")
                                                        }}
                                                        placeholder="vas_username"
                                                    />
                                                    {usernameError && (
                                                        <p className="text-sm text-red-500">{usernameError}</p>
                                                    )}
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="full_name">Ime i Prezime</Label>
                                                    <Input
                                                        id="full_name"
                                                        value={editData.full_name}
                                                        onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="address">Adresa/Lokacija</Label>
                                                    <Input
                                                        id="address"
                                                        value={editData.address}
                                                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="bio">Biografija</Label>
                                                    <Textarea
                                                        id="bio"
                                                        value={editData.bio}
                                                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                                        rows={4}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="avatar_url">Link Profilne Slike (URL)</Label>
                                                    <Input
                                                        id="avatar_url"
                                                        value={editData.avatar_url}
                                                        onChange={(e) => setEditData({ ...editData, avatar_url: e.target.value })}
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleUpdateProfile} disabled={editLoading} className="w-full">
                                                    {editLoading ? "Spasavam..." : "Spasi promjene"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                            <p className="text-xl text-muted-foreground font-light">
                                {profile.username ? `@${profile.username}` : user_type_label(profile.user_type)}
                            </p>
                        </div>

                        {profile.bio && (
                            <p className="text-sm text-foreground/80 leading-relaxed">
                                {profile.bio}
                            </p>
                        )}

                        <div className="space-y-2 pt-2">
                            {isOwner ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full" variant="outline">
                                            Uredi Profil
                                        </Button>
                                    </DialogTrigger>
                                    {/* Same dialog content structure reused implicitly or we could extract component later. 
                                        For now, since we have edit icon above, this button can just open the same edit dialog 
                                        OR we can assume the user clicks the specialized icon for avatar and this for general settings.
                                        To simplify, let's keep the Dialog definition above in the Avatar section and just duplicate the Trigger logic here or move the content down. 
                                        Actually, for cleaner code, I will duplicate the TRIGGER here but I need to make sure the DIALOG CONTENT is available. 
                                        I will put the Dialog Content in a separate variable or just duplicate the simple logic for now as it's a one-file component. 
                                        Wait, I nested the Dialog in the Avatar section. Let's make the Avatar edit just a trigger for the main Edit button dialog? 
                                        For this specific tool call, I will keep it simple: The main Edit button is below. The avatar edit icon is just a visual indication or trigger. 
                                        Let's wrap the whole sidebar in one Dialog context if possible? No, difficult with layout.
                                        I'll just put the full Dialog logic in this "Edit Profile" button, and make the Avatar icon just scroll here or do nothing for now, 
                                        OR duplicate the content. I'll duplicate content for robustness in this prompt.
                                    */}
                                    <DialogContent className="sm:max-w-[450px]">
                                        {/* ... (Same Dialog Content as above) ... */}
                                        <DialogHeader>
                                            <DialogTitle>Uredi Profil</DialogTitle>
                                            <DialogDescription>Ažurirajte vaše podatke.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-6 py-4">
                                            <div className="grid gap-2">
                                                <Label>Tip Profila</Label>
                                                <RadioGroup
                                                    defaultValue={editData.user_type}
                                                    onValueChange={(val) => setEditData({ ...editData, user_type: val })}
                                                    className="grid grid-cols-2 gap-4"
                                                >
                                                    <div>
                                                        <RadioGroupItem value="seller" id="seller-2" className="peer sr-only" />
                                                        <Label htmlFor="seller-2" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"><User className="mb-2 h-6 w-6" /><span className="text-sm font-medium">Prodavac</span></Label>
                                                    </div>
                                                    <div>
                                                        <RadioGroupItem value="serviser" id="serviser-2" className="peer sr-only" />
                                                        <Label htmlFor="serviser-2" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"><Wrench className="mb-2 h-6 w-6" /><span className="text-sm font-medium">Serviser</span></Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="username-2">Username</Label>
                                                <Input id="username-2" value={editData.username} onChange={(e) => { setEditData({ ...editData, username: e.target.value }); setUsernameError("") }} placeholder="vas_username" />
                                                {usernameError && <p className="text-sm text-red-500">{usernameError}</p>}
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="full_name-2">Ime i Prezime</Label>
                                                <Input id="full_name-2" value={editData.full_name} onChange={(e) => setEditData({ ...editData, full_name: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="address-2">Adresa/Lokacija</Label>
                                                <Input id="address-2" value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="bio-2">Biografija</Label>
                                                <Textarea id="bio-2" value={editData.bio} onChange={(e) => setEditData({ ...editData, bio: e.target.value })} rows={4} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="avatar_url-2">Link Profilne Slike (URL)</Label>
                                                <Input id="avatar_url-2" value={editData.avatar_url} onChange={(e) => setEditData({ ...editData, avatar_url: e.target.value })} placeholder="https://..." />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleUpdateProfile} disabled={editLoading} className="w-full">{editLoading ? "Spasavam..." : "Spasi promjene"}</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <Button className="w-full">Kontaktiraj</Button>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 text-sm text-muted-foreground pt-4 border-t">
                            {profile.address && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {profile.address}</div>}
                            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Član od {new Date(profile.created_at).getFullYear()}.</div>
                            <div className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {profile.rating || 0} rejting</div>
                            {profile.user_type === 'serviser' && <div className="flex items-center gap-2 text-primary font-medium"><Wrench className="h-4 w-4" /> Ovlašteni Serviser</div>}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3">
                        <Tabs defaultValue={profile.user_type === 'serviser' ? "services" : "listings"} className="w-full">
                            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
                                {profile.user_type === 'serviser' && (
                                    <TabsTrigger value="services" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">
                                        Usluge
                                    </TabsTrigger>
                                )}
                                <TabsTrigger value="listings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">
                                    Oglasi <Badge variant="secondary" className="ml-2 text-xs">{listings.length}</Badge>
                                </TabsTrigger>
                                {profile.user_type === 'serviser' && (
                                    <TabsTrigger value="portfolio" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">
                                        Portfolio
                                    </TabsTrigger>
                                )}
                                <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">
                                    Recenzije
                                </TabsTrigger>
                            </TabsList>

                            {/* SERVICES TAB */}
                            {profile.user_type === 'serviser' && (
                                <TabsContent value="services" className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        {services.length > 0 ? (
                                            services.map(service => (
                                                <Card key={service.id}>
                                                    <CardHeader>
                                                        <CardTitle>{service.service_name}</CardTitle>
                                                        <CardDescription>{service.description}</CardDescription>
                                                    </CardHeader>
                                                    <div className="px-6 pb-4 flex justify-end">
                                                        <Badge variant="outline" className="text-lg">{service.price_range || "Po dogovoru"}</Badge>
                                                    </div>
                                                </Card>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 border rounded-xl border-dashed bg-muted/20">
                                                <p className="text-muted-foreground">Trenutno nema aktivnih usluga.</p>
                                            </div>
                                        )}
                                    </div>
                                    {/* Map */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" /> Lokacija Servisa</CardTitle>
                                        </CardHeader>
                                        <div className="h-64 bg-muted w-full relative group cursor-pointer hover:bg-muted/80 transition-colors flex items-center justify-center">
                                            <span className="text-muted-foreground">Mapa nije dostupna u demo verziji</span>
                                        </div>
                                    </Card>
                                </TabsContent>
                            )}

                            {/* LISTINGS TAB */}
                            <TabsContent value="listings">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {listings.length > 0 ? (
                                        listings.map(item => (
                                            <Link key={item.id} href={`/marketplace/${item.id}`} className="block">
                                                <Card className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer h-full">
                                                    <div className="h-40 bg-muted w-full flex items-center justify-center text-muted-foreground relative overflow-hidden">
                                                        {item.images && item.images.length > 0 ? (
                                                            <img src={item.images[0]} className="w-full h-full object-cover" alt={item.title} />
                                                        ) : (
                                                            <Cpu className="h-10 w-10 opacity-20" />
                                                        )}
                                                        <div className="absolute top-2 right-2">
                                                            <Badge className="bg-black/70 hover:bg-black/80 backdrop-blur">{item.price} KM</Badge>
                                                        </div>
                                                    </div>
                                                    <CardHeader className="p-4 space-y-1">
                                                        <CardTitle className="text-base line-clamp-1">{item.title}</CardTitle>
                                                        <CardDescription className="text-xs line-clamp-1 flex gap-2">
                                                            {item.cpu && <span>{item.cpu}</span>}
                                                            {item.gpu && <span>| {item.gpu}</span>}
                                                        </CardDescription>
                                                    </CardHeader>
                                                </Card>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 text-center border rounded-xl border-dashed bg-muted/20">
                                            <p className="text-muted-foreground">Nema aktivnih oglasa.</p>
                                            {isOwner && (
                                                <Button variant="link" asChild className="mt-2">
                                                    <Link href="/marketplace/create">+ Objavi Oglas</Link>
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* REVIEWS TAB */}
                            <TabsContent value="reviews">
                                <div className="py-12 text-center border rounded-xl border-dashed bg-muted/20">
                                    <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
                                    <h3 className="font-semibold">Nema recenzija</h3>
                                    <p className="text-muted-foreground text-sm">Ovaj korisnik još uvijek nema javnih recenzija.</p>
                                </div>
                            </TabsContent>

                            {/* PORTFOLIO TAB */}
                            <TabsContent value="portfolio">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="aspect-video bg-muted rounded-xl flex items-center justify-center text-muted-foreground border">
                                        <ImageIcon className="h-8 w-8 opacity-20" />
                                    </div>
                                    <div className="aspect-video bg-muted rounded-xl flex items-center justify-center text-muted-foreground border">
                                        <ImageIcon className="h-8 w-8 opacity-20" />
                                    </div>
                                </div>
                                <p className="text-center text-muted-foreground mt-6 italic">Portfolio radova uskoro dostupan.</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

function user_type_label(type: string) {
    switch (type) {
        case 'serviser': return 'IT Serviser';
        case 'seller': return 'Prodavac';
        case 'admin': return 'Administrator';
        default: return 'Korisnik';
    }
}
