"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { Cpu, HardDrive, Monitor, X } from "lucide-react"
import { useRouter } from "next/navigation"

// Zod Schema (Validation)
const formSchema = z.object({
    title: z.string().min(5, {
        message: "Naslov mora imati najmanje 5 karaktera.",
    }),
    price: z.coerce.number().min(1, {
        message: "Cijena mora biti veća od 0.",
    }),
    category: z.enum(["COMPUTER", "LAPTOP", "COMPONENT", "PERIPHERAL"], {
        required_error: "Molimo izaberite kategoriju.",
    }),
    // Specs (Conditional logic handled in UI, but fields present)
    cpu: z.string().optional(),
    gpu: z.string().optional(),
    ram: z.string().optional(),
    storage: z.string().optional(),
    motherboard: z.string().optional(),
    psu: z.string().optional(),

    description: z.string().min(10, {
        message: "Opis mora biti detaljniji.",
    }),
})

export default function CreateListingPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const router = useRouter()

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            price: 0,
            description: "",
            cpu: "",
            gpu: "",
            ram: "",
            storage: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        alert("Oglas uspješno kreiran (Simulacija)!\n" + JSON.stringify(values, null, 2))
    }

    return (
        <div className="container max-w-2xl mx-auto py-10 px-4">
            <Card>
                <CardHeader className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-destructive/10"
                        onClick={() => router.back()}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                    <CardTitle className="text-2xl">Kreiraj Novi Oglas</CardTitle>
                    <CardDescription>
                        Popunite formu ispod da biste objavili svoju opremu na KERN Marketplace-u.
                        Sva polja označena sa * su obavezna.
                    </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Osnovne Informacije</h3>

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Naslov Oglasa</FormLabel>
                                            <FormControl>
                                                <Input placeholder="npr. Gaming PC Ryzen 5 5600..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cijena (KM)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kategorija</FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        setSelectedCategory(value);
                                                    }}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Izaberi kategoriju" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="COMPUTER">Računar (Konfiguracija)</SelectItem>
                                                        <SelectItem value="LAPTOP">Laptop</SelectItem>
                                                        <SelectItem value="COMPONENT">Komponenta</SelectItem>
                                                        <SelectItem value="PERIPHERAL">Periferija (Monitor, Miš...)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* Conditional Specs Section */}
                            {(selectedCategory === "COMPUTER" || selectedCategory === "LAPTOP" || selectedCategory === "COMPONENT") && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <h3 className="text-lg font-medium flex items-center gap-2 text-primary">
                                        <Cpu className="h-5 w-5" />
                                        Tehničke Specifikacije
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Molimo unesite tačne specifikacije. Ovo pomaže kupcima da pronađu vaš oglas.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="cpu"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Procesor (CPU)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="npr. Ryzen 5 5600X" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="gpu"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Grafička Kartica (GPU)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="npr. RTX 3060 12GB" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="ram"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>RAM Memorija</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="npr. 16GB DDR4 3200MHz" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="storage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Disk (SSD/HDD)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="npr. 1TB NVMe SSD" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}

                            <Separator />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Detaljan Opis</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Opišite stanje uređaja, koliko je korišten, ima li garanciju..."
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full text-lg h-12">Objavi Oglas</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
