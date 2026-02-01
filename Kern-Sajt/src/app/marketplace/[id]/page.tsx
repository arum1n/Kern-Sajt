"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Calendar, User, MessageCircle, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getListingById, type Listing } from "@/data/seed_listings"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"

export default function ListingDetailPage() {
    const params = useParams()
    const id = params.id as string
    const [listing, setListing] = useState<Listing | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchListing = async () => {
            setLoading(true)

            // First check seed data
            const seedListing = getListingById(id)
            if (seedListing) {
                setListing(seedListing)
                setLoading(false)
                return
            }

            // Then check Supabase
            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .eq('id', id)
                .single()

            if (!error && data) {
                setListing(data)
            }
            setLoading(false)
        }
        fetchListing()
    }, [id])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!listing) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Oglas nije pronađen</h1>
                <Button asChild>
                    <Link href="/marketplace">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Nazad na Marketplace
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Button variant="ghost" className="mb-6" asChild>
                <Link href="/marketplace">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Nazad na listu
                </Link>
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Gallery */}
                    <Card className="overflow-hidden">
                        <div className="relative aspect-video bg-muted">
                            {listing.images && listing.images.length > 0 ? (
                                <Image
                                    src={listing.images[0]}
                                    alt={listing.title}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Nema slike
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Title & Price */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant={listing.category === "COMPUTER" ? "default" : listing.category === "COMPONENT" ? "secondary" : "outline"}>
                                {listing.category === "COMPUTER" ? "Konfiguracija" : (listing.category === "LAPTOP" ? "Laptop" : (listing.category === "COMPONENT" ? "Komponenta" : "Periferija"))}
                            </Badge>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{listing.title}</h1>
                        <p className="text-3xl font-bold text-primary">
                            {listing.price.toLocaleString('bs-BA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span className="text-lg font-normal text-muted-foreground ml-1">{listing.currency}</span>
                        </p>
                    </div>

                    <Separator />

                    {/* Specs Table */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Osobine</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {listing.cpu && (
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Procesor (CPU)</span>
                                    <span className="font-medium">{listing.cpu}</span>
                                </div>
                            )}
                            {listing.gpu && (
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Grafička (GPU)</span>
                                    <span className="font-medium">{listing.gpu}</span>
                                </div>
                            )}
                            {listing.ram && (
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">RAM</span>
                                    <span className="font-medium">{listing.ram}</span>
                                </div>
                            )}
                            {listing.storage && (
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Storage</span>
                                    <span className="font-medium">{listing.storage}</span>
                                </div>
                            )}
                            {listing.motherboard && (
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Matična ploča</span>
                                    <span className="font-medium">{listing.motherboard}</span>
                                </div>
                            )}
                            {listing.psu && (
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Napajanje</span>
                                    <span className="font-medium">{listing.psu}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Detailed Specs */}
                    {listing.detailedSpecs && Object.keys(listing.detailedSpecs).length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Detaljne specifikacije</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {Object.entries(listing.detailedSpecs).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">{key}</span>
                                            <span className="font-medium text-right">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <Separator />

                    {/* Description */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Detaljni opis</h2>
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="whitespace-pre-line text-muted-foreground">{listing.description}</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Seller Info */}
                <div className="space-y-4">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold">{listing.seller || "Prodavac"}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {listing.location || "BiH"}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <Button className="w-full" size="lg">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Pošalji poruku
                            </Button>

                            <Button variant="outline" className="w-full" size="lg">
                                <Phone className="mr-2 h-4 w-4" />
                                Prikaži broj
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Date Posted */}
                    {listing.detailedSpecs?.["Datum objave"] && (
                        <Card>
                            <CardContent className="p-4 flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Objavljeno: {listing.detailedSpecs["Datum objave"]}</span>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
