"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Cpu, Filter, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { seedListings } from "@/data/seed_listings"
import Image from "next/image"
import { PriceRangeSlider } from "@/components/marketplace/price-range-slider"
import { FilterAccordionItem } from "@/components/ui/filter-accordion"


export default function MarketplacePage() {
    const [listings, setListings] = useState<any[]>([])
    const [filteredListings, setFilteredListings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
    const [searchQuery, setSearchQuery] = useState("")
    const supabase = createClient()

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true)
            let allListings = [...seedListings];

            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .order('created_at', { ascending: false })

            if (!error && data) {
                allListings = [...data, ...allListings];
            }

            // Initial filter to remove items without images
            allListings = allListings.filter(item =>
                item.images &&
                Array.isArray(item.images) &&
                item.images.length > 0 &&
                item.images[0].length > 0
            );

            setListings(allListings)
            setFilteredListings(allListings)
            setLoading(false)
        }
        fetchListings()
    }, [])

    // Filter Logic
    useEffect(() => {
        let result = listings;

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                (item.cpu && item.cpu.toLowerCase().includes(query)) ||
                (item.gpu && item.gpu.toLowerCase().includes(query)) ||
                JSON.stringify(item.detailedSpecs || {}).toLowerCase().includes(query)
            );
        }

        // Price Filter
        result = result.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

        // Category & Spec Filters
        for (const [category, values] of Object.entries(selectedFilters)) {
            if (values.length === 0) continue;

            result = result.filter(item => {
                if (category === 'category') {
                    return values.includes(item.category);
                }
                if (category === 'condition') {
                    // Simple heuristic for condition
                    const isNew = item.description.toLowerCase().includes('novo') || item.detailedSpecs?.['Stanje'] === 'Novo';
                    const isUsed = !isNew;
                    if (values.includes('new') && isNew) return true;
                    if (values.includes('used') && isUsed) return true;
                    return false;
                }

                // General text search in specs for other filters
                // This is a loose filter implementation to support the UI structure requested
                const specsText = JSON.stringify(item.detailedSpecs || {}).toLowerCase() + " " + (item.cpu || "") + " " + (item.gpu || "");
                return values.some(val => specsText.includes(val.toLowerCase()));
            });
        }

        setFilteredListings(result);
    }, [listings, priceRange, selectedFilters, searchQuery]);

    const handleFilterChange = (category: string, value: string) => {
        setSelectedFilters(prev => {
            const current = prev[category] || [];
            if (current.includes(value)) {
                return { ...prev, [category]: current.filter(v => v !== value) };
            } else {
                return { ...prev, [category]: [...current, value] };
            }
        });
    }

    const FilterCheckbox = ({ category, value, label }: { category: string, value: string, label: string }) => (
        <div className="flex items-center space-x-2">
            <Checkbox
                id={`${category}-${value}`}
                checked={selectedFilters[category]?.includes(value)}
                onCheckedChange={() => handleFilterChange(category, value)}
            />
            <label htmlFor={`${category}-${value}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                {label}
            </label>
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
                    <p className="text-muted-foreground mt-1">
                        Kupujte i prodajite provjerenu IT opremu - Povučeno iz baze podataka.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/marketplace/create">
                            + Prodaj Opremu
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="hidden lg:block space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <Filter className="h-4 w-4" /> Filteri
                        </h3>
                        <Separator className="mb-4" />

                        {/* Price Slider */}
                        <div className="mb-6">
                            <Label className="mb-2 block font-semibold">Cijena (KM)</Label>
                            <PriceRangeSlider
                                min={0}
                                max={10000}
                                step={50}
                                defaultValue={[0, 10000]}
                                onValueChange={setPriceRange}
                            />
                        </div>

                        {/* Categories */}
                        <div className="space-y-1">
                            <FilterAccordionItem title="Kategorija" defaultOpen={true}>
                                <div className="space-y-2">
                                    <FilterCheckbox category="category" value="COMPUTER" label="Računari" />
                                    <FilterCheckbox category="category" value="COMPONENT" label="Komponente" />
                                    <FilterCheckbox category="category" value="PERIPHERAL" label="Periferija" />
                                </div>
                            </FilterAccordionItem>

                            <FilterAccordionItem title="Stanje">
                                <div className="space-y-2">
                                    <FilterCheckbox category="condition" value="new" label="Novo" />
                                    <FilterCheckbox category="condition" value="used" label="Korišteno" />
                                </div>
                            </FilterAccordionItem>

                            <FilterAccordionItem title="CPU Brand">
                                <div className="space-y-2">
                                    <FilterCheckbox category="cpu" value="Intel" label="Intel" />
                                    <FilterCheckbox category="cpu" value="AMD" label="AMD" />
                                </div>
                            </FilterAccordionItem>

                            <FilterAccordionItem title="CPU Core Count">
                                <div className="space-y-2">
                                    <FilterCheckbox category="cpu_cores" value="6" label="6-Core" />
                                    <FilterCheckbox category="cpu_cores" value="8" label="8-Core" />
                                    <FilterCheckbox category="cpu_cores" value="12" label="12-Core" />
                                    <FilterCheckbox category="cpu_cores" value="16" label="16-Core" />
                                    <FilterCheckbox category="cpu_cores" value="24" label="24-Core" />
                                </div>
                            </FilterAccordionItem>

                            <FilterAccordionItem title="CPU Socket">
                                <div className="space-y-2">
                                    <FilterCheckbox category="socket" value="AM4" label="AM4" />
                                    <FilterCheckbox category="socket" value="AM5" label="AM5" />
                                    <FilterCheckbox category="socket" value="LGA1700" label="LGA 1700" />
                                </div>
                            </FilterAccordionItem>

                            <FilterAccordionItem title="GPU Brand">
                                <div className="space-y-2">
                                    <FilterCheckbox category="gpu" value="NVIDIA" label="NVIDIA" />
                                    <FilterCheckbox category="gpu" value="AMD" label="AMD" />
                                    <FilterCheckbox category="gpu" value="Intel" label="Intel" />
                                </div>
                            </FilterAccordionItem>

                            <FilterAccordionItem title="GPU Memory">
                                <div className="space-y-2">
                                    <FilterCheckbox category="gpu_mem" value="8GB" label="8 GB" />
                                    <FilterCheckbox category="gpu_mem" value="12GB" label="12 GB" />
                                    <FilterCheckbox category="gpu_mem" value="16GB" label="16 GB" />
                                    <FilterCheckbox category="gpu_mem" value="24GB" label="24 GB" />
                                </div>
                            </FilterAccordionItem>

                            <FilterAccordionItem title="Memory (RAM)">
                                <div className="space-y-2">
                                    <FilterCheckbox category="ram" value="16GB" label="16 GB" />
                                    <FilterCheckbox category="ram" value="32GB" label="32 GB" />
                                    <FilterCheckbox category="ram" value="64GB" label="64 GB" />
                                    <FilterCheckbox category="ram" value="DDR4" label="DDR4" />
                                    <FilterCheckbox category="ram" value="DDR5" label="DDR5" />
                                </div>
                            </FilterAccordionItem>

                            <FilterAccordionItem title="Storage">
                                <div className="space-y-2">
                                    <FilterCheckbox category="storage" value="500GB" label="500 GB" />
                                    <FilterCheckbox category="storage" value="1TB" label="1 TB" />
                                    <FilterCheckbox category="storage" value="2TB" label="2 TB" />
                                    <FilterCheckbox category="storage" value="4TB" label="4 TB" />
                                    <FilterCheckbox category="storage" value="NVMe" label="NVMe" />
                                </div>
                            </FilterAccordionItem>

                            <FilterAccordionItem title="Motherboard">
                                <div className="space-y-2">
                                    <FilterCheckbox category="mobo" value="ASUS" label="ASUS" />
                                    <FilterCheckbox category="mobo" value="Gigabyte" label="Gigabyte" />
                                    <FilterCheckbox category="mobo" value="MSI" label="MSI" />
                                </div>
                            </FilterAccordionItem>
                        </div>
                    </div>
                </div>

                {/* Listings Grid */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Search Top Bar */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Pretraži po nazivu, komponenti..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            {/* Mobile Filter Trigger could go here */}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredListings.map((item) => (
                                <Link key={item.id} href={`/marketplace/${item.id}`} className="block">
                                    <Card className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer h-full">
                                        <div className="h-48 bg-muted w-full flex items-center justify-center text-muted-foreground relative overflow-hidden">
                                            {item.images && item.images.length > 0 ? (
                                                <Image
                                                    src={item.images[0]}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover transition-transform hover:scale-105"
                                                />
                                            ) : (
                                                <Cpu className="h-12 w-12 opacity-20" />
                                            )}
                                        </div>

                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex justify-between items-start">
                                                <Badge variant={item.category === "COMPUTER" ? "default" : "secondary"} className="mb-2">
                                                    {item.category === "COMPUTER" ? "Konfiguracija" : (item.category === "LAPTOP" ? "Laptop" : (item.category === "COMPONENT" ? "Komponenta" : "Periferija"))}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-lg line-clamp-1" title={item.title}>{item.title}</CardTitle>
                                        </CardHeader>

                                        <CardContent className="p-4 pt-2 text-sm text-muted-foreground space-y-1">
                                            {item.cpu && item.cpu !== '-' && <p className="line-clamp-1"><span className="font-semibold text-foreground/80">CPU:</span> {item.cpu}</p>}
                                            {item.gpu && item.gpu !== '-' && <p className="line-clamp-1"><span className="font-semibold text-foreground/80">GPU:</span> {item.gpu}</p>}
                                            {item.ram && item.ram !== '-' && <p className="line-clamp-1"><span className="font-semibold text-foreground/80">RAM:</span> {item.ram}</p>}
                                            {(!item.cpu && !item.gpu) && <p className="line-clamp-2">{item.description}</p>}
                                        </CardContent>

                                        <CardFooter className="p-4 border-t bg-muted/20 flex justify-between items-center">
                                            <div className="font-bold text-lg">
                                                {item.price.toLocaleString('bs-BA', { minimumFractionDigits: 0 })} <span className="text-xs font-normal text-muted-foreground">{item.currency}</span>
                                            </div>
                                            <Button variant="outline" size="sm" asChild>
                                                <span className="cursor-pointer">Detalji</span>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                            {filteredListings.length === 0 && (
                                <div className="col-span-full py-12 text-center text-muted-foreground">
                                    <p className="text-lg font-semibold">Nema rezultata za odabrane filtere.</p>
                                    <Button variant="link" onClick={() => {
                                        setPriceRange([0, 10000]);
                                        setSelectedFilters({});
                                    }}>Poništi filtere</Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
