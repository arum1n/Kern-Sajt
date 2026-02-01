"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { seedListings } from "@/data/seed_listings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
    Cpu,
    Monitor as Motherboard,
    Zap,
    Database,
    GripVertical,
    HardDrive,
    CheckCircle2,
    AlertTriangle,
    ShoppingCart,
    Share2,
    Trash2,
    Loader2,
    Wrench
} from "lucide-react"

type ComponentType = 'CPU' | 'MOTHERBOARD' | 'RAM' | 'GPU' | 'PSU' | 'CASE' | 'STORAGE'

interface BuildPart {
    type: ComponentType
    label: string
    icon: any
    selected: any | null
}

export default function PCBuilderPage() {
    const [step, setStep] = useState<number>(0)
    const [parts, setParts] = useState<BuildPart[]>([
        { type: 'CPU', label: 'Procesor', icon: Cpu, selected: null },
        { type: 'MOTHERBOARD', label: 'Matična ploča', icon: Motherboard, selected: null },
        { type: 'RAM', label: 'Memorija (RAM)', icon: Database, selected: null },
        { type: 'GPU', label: 'Grafička kartica', icon: GripVertical, selected: null },
        { type: 'STORAGE', label: 'Disk (SSD/HDD)', icon: HardDrive, selected: null },
        { type: 'PSU', label: 'Napajanje', icon: Zap, selected: null },
    ])

    const [options, setOptions] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const currentPart = parts[step]
    const totalPrice = parts.reduce((sum, p) => sum + (p.selected?.price || 0), 0)
    const totalWattage = parts.reduce((sum, p) => sum + (p.selected?.wattage || 0), 0)

    useEffect(() => {
        if (step < parts.length) {
            fetchOptions()
        }
    }, [step, parts])

    const fetchOptions = async () => {
        setLoading(true)
        // Fetch both COMPUTER and COMPONENT categories to have a wider selection
        let query = supabase
            .from('listings')
            .select('*')
            .in('category', ['COMPUTER', 'COMPONENT'])
            .order('price', { ascending: true })

        const { data, error } = await query

        // Only use COMPONENT category for individual parts (exclude complete PCs)
        const seedComponents = seedListings.filter(item =>
            item.category === 'COMPONENT'
        )

        // Merge both sources (Supabase first, then seed data)
        // Filter Supabase data to only include COMPONENT category
        const supabaseComponents = (data || []).filter((item: any) => item.category === 'COMPONENT')
        const allListings = [...supabaseComponents, ...seedComponents]

        // Remove duplicates based on id
        const uniqueListings = allListings.filter((item, index, self) =>
            index === self.findIndex(t => t.id === item.id)
        )

        let filtered = uniqueListings.filter(item => {
            const title = item.title.toLowerCase()
            const desc = item.description?.toLowerCase() || ""
            const cpu = item.cpu?.toLowerCase() || ""
            const gpu = item.gpu?.toLowerCase() || ""
            const motherboard = item.motherboard?.toLowerCase() || ""
            const storage = item.storage?.toLowerCase() || ""

            // Exclude complete PC builds and laptops
            if (title.includes('gaming pc') || title.includes('konfiguracija') || title.includes('laptop')) {
                return false
            }

            // Better component identification logic
            if (currentPart.type === 'CPU') {
                return (title.includes('ryzen') || title.includes('intel') || title.includes('core i') || title.includes('procesor')) &&
                    !title.includes('ploča') && !title.includes('motherboard') && !title.includes('laptop') && !title.includes('gaming pc')
            }
            if (currentPart.type === 'MOTHERBOARD') {
                return title.includes('ploča') || title.includes('motherboard') || title.includes('b450') ||
                    title.includes('b550') || title.includes('z790') || title.includes('b650')
            }
            if (currentPart.type === 'RAM') return title.includes('ram') || title.includes('ddr') || title.includes('memorija')
            if (currentPart.type === 'GPU') return (title.includes('rtx') || title.includes('gtx') || title.includes('radeon') || title.includes('rx ') || title.includes('grafička')) && !title.includes('laptop') && !title.includes('gaming pc')
            if (currentPart.type === 'PSU') return title.includes('napajanje') || title.includes('psu') || title.includes(' w ') || title.includes('watt') || title.includes('850w') || title.includes('750w') || title.includes('650w') || title.includes('1000w') || desc.includes('napajanje') || desc.includes('modularno')
            if (currentPart.type === 'STORAGE') return title.includes('ssd') || title.includes('nvme') || title.includes('hdd') || title.includes('disk') || storage.includes('nvme') || storage.includes('ssd')
            return true
        })

        // COMPATIBILITY LOGIC
        const selectedCPU = parts.find(p => p.type === 'CPU')?.selected
        const selectedMB = parts.find(p => p.type === 'MOTHERBOARD')?.selected

        filtered = filtered.filter(item => {
            // CPU <-> Motherboard (Socket)
            if (currentPart.type === 'MOTHERBOARD' && selectedCPU) {
                return item.socket_type === selectedCPU.socket_type
            }
            if (currentPart.type === 'CPU' && selectedMB) {
                return item.socket_type === selectedMB.socket_type
            }

            // MB <-> RAM (DDR Generation)
            if (currentPart.type === 'RAM' && selectedMB) {
                return item.ram_type === selectedMB.ram_type
            }
            if (currentPart.type === 'MOTHERBOARD' && parts.find(p => p.type === 'RAM')?.selected) {
                return item.ram_type === parts.find(p => p.type === 'RAM')?.selected?.ram_type
            }

            return true
        })

        setOptions(filtered)
        setLoading(false)
    }

    const selectPart = (partData: any) => {
        const newParts = [...parts]
        newParts[step].selected = partData
        setParts(newParts)
        if (step < parts.length - 1) {
            setStep(step + 1)
        }
    }

    const removePart = (index: number) => {
        const newParts = [...parts]
        newParts[index].selected = null
        setParts(newParts)
        setStep(index)
    }

    return (
        <div className="container mx-auto px-4 py-10 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                {/* Left Side: Builder Steps */}
                <div className="w-full md:w-1/3 space-y-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Wrench className="h-6 w-6 text-primary" /> Vaša Konfiguracija
                    </h2>
                    <div className="space-y-3">
                        {parts.map((p, idx) => (
                            <div
                                key={idx}
                                onClick={() => setStep(idx)}
                                className={`
                                    relative p-4 rounded-xl border-2 transition-all cursor-pointer
                                    ${step === idx ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:bg-muted/50'}
                                    ${p.selected ? 'bg-green-500/5 border-green-500/20' : ''}
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${p.selected ? 'bg-green-500/20 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                                            <p.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{p.label}</p>
                                            <p className="font-semibold">{p.selected ? p.selected.title : 'Nije izabrano'}</p>
                                        </div>
                                    </div>
                                    {p.selected && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm">{p.selected.price} KM</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removePart(idx)
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Selection Area */}
                <div className="w-full md:w-2/3">
                    {step < parts.length ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold">Izaberite {currentPart.label}</h3>
                                    <p className="text-muted-foreground text-sm">Prikazujemo samo kompatibilne oglase iz baze.</p>
                                </div>
                                <Badge variant="outline" className="px-3 py-1">
                                    Korak {step + 1} / {parts.length}
                                </Badge>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                    <p className="text-muted-foreground">Provjeravam kompatibilnost...</p>
                                </div>
                            ) : options.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {options.map((option) => (
                                        <Card
                                            key={option.id}
                                            className="overflow-hidden hover:border-primary transition-all cursor-pointer group"
                                            onClick={() => selectPart(option)}
                                        >
                                            <CardHeader className="p-4 pb-2">
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-base line-clamp-1">{option.title}</CardTitle>
                                                    <div className="font-bold text-primary">{option.price} KM</div>
                                                </div>
                                                <CardDescription className="text-xs">
                                                    {option.socket_type && <span>Socket: {option.socket_type} | </span>}
                                                    {option.ram_type && <span>RAM: {option.ram_type}</span>}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0">
                                                <div className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Specifikacije:</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {option.cpu && <Badge variant="secondary" className="text-[10px] h-5">{option.cpu}</Badge>}
                                                    {option.gpu && <Badge variant="secondary" className="text-[10px] h-5">{option.gpu}</Badge>}
                                                    {option.wattage && <Badge variant="outline" className="text-[10px] h-5">{option.wattage}W</Badge>}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/30">
                                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold">Nema dostupnih dijelova</h4>
                                    <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                                        Trenutno nema kompatibilnih {currentPart.label.toLowerCase()} u oglasima koji odgovaraju tvom dosadašnjem izboru.
                                    </p>
                                    <Button variant="outline" className="mt-4" onClick={() => removePart(step - 1)}>
                                        Vrati se korak unazad
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Card className="border-primary bg-primary/5 text-center py-10">
                            <CardHeader>
                                <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                                <CardTitle className="text-3xl font-bold">Build je završen!</CardTitle>
                                <CardDescription>Sve komponente su kompatibilne i spremne za narudžbu.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-extrabold text-primary mb-6">{totalPrice} KM</div>
                                <div className="flex gap-4 justify-center">
                                    <Button size="lg" className="gap-2">
                                        <ShoppingCart className="h-5 w-5" /> Kontaktiraj prodavce
                                    </Button>
                                    <Button size="lg" variant="outline" className="gap-2">
                                        <Share2 className="h-5 w-5" /> Podijeli Build
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Sticky Summary Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border p-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex gap-8 items-center">
                        <div className="hidden sm:block">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Ukupna Cijena</p>
                            <p className="text-2xl font-black text-primary">{totalPrice} KM</p>
                        </div>
                        <div className="h-10 w-[1px] bg-border hidden sm:block"></div>
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Potrošnja (TDP)</p>
                            <div className="flex items-center gap-2">
                                <span className={`text-xl font-bold ${totalWattage > 800 ? 'text-red-500' : 'text-green-500'}`}>
                                    {totalWattage}W
                                </span>
                                {totalWattage > 0 && (
                                    <Badge variant="outline" className="text-[10px]">
                                        Preporučeno PSU: {totalWattage + 150}W+
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {step > 0 && (
                            <Button variant="ghost" onClick={() => setStep(step - 1)}>
                                Prethodni korak
                            </Button>
                        )}
                        <Button
                            className="bg-primary text-primary-foreground font-bold px-8 shadow-lg shadow-primary/20"
                            disabled={!currentPart?.selected && step < parts.length}
                            onClick={() => {
                                if (step < parts.length) setStep(step + 1)
                            }}
                        >
                            {step < parts.length - 1 ? 'Sledeća komponenta' : step === parts.length - 1 ? 'Završi Build' : 'Naruči konfiguraciju'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
