"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Search, Star, Wrench } from "lucide-react"
import { useState } from "react"

// Mock Data
const services = [
    {
        id: 1,
        name: "PC Doctor Sarajevo",
        address: "Zmaja od Bosne 14",
        city: "Sarajevo",
        rating: 4.8,
        reviews: 124,
        specialties: ["Hardware Repair", "Data Recovery", "Laptop Screen"],
        image: "/placeholder-service1.jpg",
        online: true
    },
    {
        id: 2,
        name: "TechFix Centar",
        address: "Maršala Tita 50",
        city: "Sarajevo",
        rating: 4.5,
        reviews: 89,
        specialties: ["Software Install", "Cleaning", "Thermal Paste"],
        image: "/placeholder-service2.jpg",
        online: false
    },
    {
        id: 3,
        name: "Gamer's Garage",
        address: "Bulevar Meše Selimovića 2",
        city: "Sarajevo",
        rating: 4.9,
        reviews: 210,
        specialties: ["Custom Builds", "Overclocking", "Water Cooling"],
        image: "/placeholder-service3.jpg",
        online: true
    }
]

export default function ServiceHubPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Wrench className="h-8 w-8 text-primary" /> Servis Hub
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Pronađite provjerene servisere u vašoj blizini.
                    </p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Pretraži servise ili usluge..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">

                {/* Service List */}
                <div className="lg:col-span-1 overflow-y-auto pr-2 space-y-4 pb-4">
                    {filteredServices.map(service => (
                        <Card key={service.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                                <Avatar className="h-12 w-12 border-2 border-muted group-hover:border-primary transition-colors">
                                    <AvatarImage src={service.image} />
                                    <AvatarFallback>{service.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{service.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3" /> {service.address}, {service.city}
                                    </CardDescription>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge variant={service.rating >= 4.5 ? "default" : "secondary"} className="flex gap-1">
                                        <Star className="h-3 w-3 fill-current" /> {service.rating}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">({service.reviews})</span>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {service.specialties.map(spec => (
                                        <Badge key={spec} variant="outline" className="text-xs font-normal">
                                            {spec}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="pt-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full" variant="secondary">Zatraži Ponudu</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Kontaktiraj {service.name}</DialogTitle>
                                            <DialogDescription>
                                                Opišite svoj problem ukratko. Serviser će vam odgovoriti sa procjenom cijene.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="device" className="text-right">
                                                    Uređaj
                                                </Label>
                                                <Input id="device" placeholder="npr. Laptop HP ProBook" className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="issue" className="text-right">
                                                    Opis Kvara
                                                </Label>
                                                <Textarea id="issue" placeholder="Pregrijava se i gasi..." className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="contact" className="text-right">
                                                    Telefon
                                                </Label>
                                                <Input id="contact" placeholder="06x xxx xxx" className="col-span-3" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit">Pošalji Upit</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardFooter>
                        </Card>
                    ))}
                    {filteredServices.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            Nema rezultata za vašu pretragu.
                        </div>
                    )}
                </div>

                {/* Map Placeholder */}
                <div className="lg:col-span-2 bg-muted/30 rounded-xl border border-border/50 relative flex items-center justify-center overflow-hidden min-h-[400px]">
                    {/* Creating a fake map grid pattern */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    />

                    {/* Fake Map Markers */}
                    <div className="absolute top-1/4 left-1/3 animate-bounce duration-1000">
                        <MapPin className="h-10 w-10 text-primary drop-shadow-lg fill-primary/20" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 animate-bounce delay-150 duration-1000">
                        <MapPin className="h-10 w-10 text-red-500 drop-shadow-lg fill-red-500/20" />
                    </div>
                    <div className="absolute bottom-1/3 right-1/4 animate-bounce delay-300 duration-1000">
                        <MapPin className="h-10 w-10 text-blue-500 drop-shadow-lg fill-blue-500/20" />
                    </div>


                    <div className="bg-background/80 backdrop-blur p-6 rounded-2xl border shadow-xl text-center max-w-sm relative z-10">
                        <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Interaktivna Mapa</h3>
                        <p className="text-muted-foreground">
                            Ovdje će biti prikazana Google Maps ili OpenStreetMap integracija sa tačnim lokacijama servisa.
                        </p>
                        <Button className="mt-4" variant="outline">
                            Dozvoli Lokaciju
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
