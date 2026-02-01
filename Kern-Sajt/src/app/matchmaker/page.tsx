"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, BrainCircuit, Check, CheckCircle2, Gamepad2, Laptop, MonitorPlay, Palette, Zap, AlertCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"

// Types
type Answer = string | number

interface Step {
    id: string
    phase: number
    question: string
    description?: string
    options: Option[]
    condition?: (answers: Record<string, Answer>) => boolean
}

interface Option {
    id: string
    label: string
    sublabel?: string
    icon?: React.ElementType
}

// Decision Tree Data
const steps: Step[] = [
    // FAZA 1: NAMJENA
    {
        id: "purpose",
        phase: 1,
        question: "Za šta ćete najviše koristiti ovaj uređaj?",
        description: "Odaberite primarnu namjenu - ovim filtriramo 80% ponude",
        options: [
            { id: "GAMING", label: "Gaming (Igrice)", icon: Gamepad2 },
            { id: "WORK", label: "Kancelarijski rad/Škola", icon: BrainCircuit },
            { id: "DESIGN", label: "Profesionalni dizajn/Video", icon: Palette },
            { id: "CASUAL", label: "Samo internet i filmovi", icon: MonitorPlay },
        ]
    },
    {
        id: "form_factor",
        phase: 1,
        question: "Da li vam je potrebna mobilnost?",
        options: [
            { id: "LAPTOP", label: "Da, treba mi Laptop", sublabel: "Prenosivost" },
            { id: "DESKTOP", label: "Ne, želim Desktop", sublabel: "Više snage za manje novca" },
        ]
    },

    // FAZA 2: INTENZITET (Gaming branch)
    {
        id: "game_type",
        phase: 2,
        question: "Koje naslove planirate igrati?",
        condition: (answers) => answers.purpose === "GAMING",
        options: [
            { id: "COMPETITIVE", label: "Takmičarske igre", sublabel: "CS2, Valorant, LoL - brzina" },
            { id: "AAA", label: "Velike avanture", sublabel: "Red Dead Redemption 2, Cyberpunk, Elden Ring" },
            { id: "CASUAL_GAMES", label: "Lagane igrice", sublabel: "Roblox, Minecraft" },
        ]
    },
    {
        id: "resolution",
        phase: 2,
        question: "Na kojoj rezoluciji želite igrati?",
        condition: (answers) => answers.purpose === "GAMING",
        options: [
            { id: "1080P", label: "Standardna (1080p)" },
            { id: "1440P", label: "Visoka (2K/1440p)" },
            { id: "4K", label: "Ultra (4K)" },
        ]
    },

    // FAZA 2: INTENZITET (Work/Design branch)
    {
        id: "software",
        phase: 2,
        question: "Koje programe ćete koristiti?",
        condition: (answers) => answers.purpose === "WORK" || answers.purpose === "DESIGN",
        options: [
            { id: "OFFICE", label: "Office/Web", sublabel: "Word, Excel, Chrome" },
            { id: "ADOBE", label: "Adobe Suite", sublabel: "Photoshop, Premiere" },
            { id: "3D", label: "3D Modelovanje", sublabel: "Blender, AutoCAD" },
        ]
    },
    {
        id: "multitasking",
        phase: 2,
        question: "Koliko često radite više stvari odjednom?",
        condition: (answers) => answers.purpose === "WORK" || answers.purpose === "DESIGN",
        options: [
            { id: "LOW", label: "Rijetko", sublabel: "1-2 programa" },
            { id: "HIGH", label: "Često", sublabel: "50 tabova + 3 programa" },
        ]
    },

    // FAZA 3: ESTETIKA
    {
        id: "size",
        phase: 3,
        question: "Koliko prostora imate na stolu?",
        condition: (answers) => answers.form_factor === "DESKTOP",
        options: [
            { id: "MINI", label: "Jako malo", sublabel: "Mini-PC" },
            { id: "STANDARD", label: "Standardno", sublabel: "Mid Tower" },
            { id: "UNLIMITED", label: "Neograničeno", sublabel: "Big Tower" },
        ]
    },
    {
        id: "aesthetics",
        phase: 3,
        question: "Da li vam je bitan izgled (estetika)?",
        options: [
            { id: "RGB", label: "Želim RGB i staklo", icon: Sparkles },
            { id: "MINIMAL", label: "Minimalistički crni kućište" },
            { id: "NONE", label: "Nije bitno, samo nek radi" },
        ]
    },
    {
        id: "noise",
        phase: 3,
        question: "Koliko vam je bitna tišina pri radu?",
        options: [
            { id: "SILENT", label: "Jako bitna", sublabel: "Premium hlađenje" },
            { id: "NORMAL", label: "Nije bitna", sublabel: "Standardni ventilatori" },
        ]
    },

    // FAZA 4: BUDŽET
    {
        id: "budget",
        phase: 4,
        question: "Koliko planirate potrošiti (maksimalno)?",
        description: "Unesite budžet u KM",
        options: [
            { id: "500", label: "Do 500 KM" },
            { id: "1000", label: "500 - 1000 KM" },
            { id: "1500", label: "1000 - 1500 KM" },
            { id: "2000", label: "1500 - 2000 KM" },
            { id: "2000+", label: "Preko 2000 KM" },
        ]
    },
    {
        id: "upgrade",
        phase: 4,
        question: "Da li planirate nadograđivati računar?",
        options: [
            { id: "YES", label: "Da", sublabel: "Novije matične ploče" },
            { id: "NO", label: "Ne", sublabel: "Kupujem i ne diram 4-5 god" },
        ]
    },
    {
        id: "condition",
        phase: 4,
        question: "Da li prihvatate polovne komponente?",
        options: [
            { id: "NEW_ONLY", label: "Samo novo" },
            { id: "USED_OK", label: "Može i polovno", sublabel: "KERN Verified" },
        ]
    },
]

export default function MatchmakerPage() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, Answer>>({})
    const [isCompleted, setIsCompleted] = useState(false)
    const [showPanic, setShowPanic] = useState(false)
    const [recommendation, setRecommendation] = useState<any>(null)
    const [loadingResult, setLoadingResult] = useState(false)

    const supabase = createClient()

    // Filter steps based on conditions
    const activeSteps = steps.filter(step => !step.condition || step.condition(answers))
    const currentStep = activeSteps[currentStepIndex]
    const currentPhase = currentStep?.phase || 1
    const progress = ((currentStepIndex + 1) / activeSteps.length) * 100

    const handleOptionSelect = (optionId: string) => {
        setAnswers({ ...answers, [currentStep.id]: optionId })
    }

    const nextStep = () => {
        if (currentStepIndex < activeSteps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1)
        } else {
            generateFinalRecommendation()
        }
    }

    const prevStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1)
        }
    }

    const generateFinalRecommendation = async () => {
        setLoadingResult(true)
        setIsCompleted(true)

        let query = supabase.from('listings').select('*')

        // Apply filters based on answers
        if (answers.purpose === "GAMING") {
            if (answers.game_type === "AAA") {
                query = query.gte('price', 2000)
            } else if (answers.game_type === "COMPETITIVE") {
                query = query.gte('price', 1500).lte('price', 2500)
            }
        } else if (answers.purpose === "CASUAL") {
            query = query.lte('price', 1000)
        }

        if (answers.budget) {
            const budgetVal = parseInt(answers.budget.toString())
            if (!isNaN(budgetVal)) {
                query = query.lte('price', budgetVal + 200) // Small margin
            }
        }

        const { data, error } = await query.limit(5)

        if (data && data.length > 0) {
            // Pick the best match (simplified)
            const bestMatch = data[0]
            setRecommendation({
                title: bestMatch.title,
                description: bestMatch.description,
                specs: `${bestMatch.cpu} / ${bestMatch.gpu} / ${bestMatch.ram} / ${bestMatch.storage}`,
                explanation: `Na osnovu tvojih odgovora, ${bestMatch.title} nudi najbolji omijer cijene i onoga što tebi treba.`,
                budget: bestMatch.price,
                formFactor: answers.form_factor,
                id: bestMatch.id,
                count: data.length
            })
        } else {
            // Fallback if no exact match found
            setRecommendation({
                title: "Custom Balanced PC",
                description: "Nismo pronašli tačan meč u bazi, ali ovo bi bila idealna preporuka za tebe.",
                specs: "Ryzen 5 5600 / RTX 3060 / 16GB RAM",
                explanation: "Trenutno nema oglasa koji 100% odgovaraju tvom filteru, ali ova konfiguracija je najpribližnija tvom budžetu.",
                budget: answers.budget,
                formFactor: answers.form_factor,
                count: 0
            })
        }
        setLoadingResult(false)
    }

    const handlePanicButton = () => {
        setShowPanic(true)
        // Auto-fill with sensible defaults
        const defaults: Record<string, Answer> = {
            purpose: "WORK",
            form_factor: "DESKTOP",
            budget: "1000",
            upgrade: "NO",
            condition: "USED_OK",
            aesthetics: "NONE",
            noise: "NORMAL"
        }
        setAnswers(defaults)
        setTimeout(() => generateFinalRecommendation(), 1000)
    }

    if (showPanic || loadingResult) {
        return (
            <div className="container max-w-2xl mx-auto py-20 px-4 text-center">
                <div className="mb-6 flex justify-center animate-pulse">
                    <Zap className="h-16 w-16 text-yellow-500" />
                </div>
                <h1 className="text-3xl font-bold mb-4">{loadingResult ? "Analiziramo bazu..." : "Panic Mode aktiviran!"}</h1>
                <p className="text-muted-foreground">Tražimo najbolju opciju za vas...</p>
            </div>
        )
    }

    if (isCompleted && recommendation) {
        return (
            <div className="container max-w-3xl mx-auto py-10 px-4">
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-green-500/10 p-4 animate-in zoom-in">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-2 text-center">Pronašli smo vaš idealan PC!</h1>
                <p className="text-muted-foreground mb-8 text-center text-lg">
                    Na osnovu vaših {Object.keys(answers).length} odgovora iz baze smo izvukli najbolje:
                </p>

                <Card className="border-primary/50 relative overflow-hidden mb-6">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-3xl text-primary mb-2">{recommendation.title}</CardTitle>
                                <CardDescription className="text-base">{recommendation.description}</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-lg px-3 py-1">
                                ~{recommendation.budget} KM
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-6 bg-muted/50 rounded-lg border">
                            <h3 className="font-bold mb-3 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Trenutno dostupno u oglasu:
                            </h3>
                            <p className="font-mono text-sm font-semibold text-foreground leading-relaxed">{recommendation.specs}</p>
                        </div>

                        <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                            <h3 className="font-bold mb-3 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-primary" />
                                Zašto ovaj model?
                            </h3>
                            <p className="text-sm leading-relaxed">{recommendation.explanation}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button size="lg" className="w-full" asChild>
                            <Link href={recommendation.id ? `/marketplace/${recommendation.id}` : `/marketplace?type=${recommendation.formFactor}`}>
                                {recommendation.id ? "Vidi Oglas" : "Pretraži slično"} ({recommendation.count || 0})
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.reload()}>
                            Pokreni ponovo
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    if (!currentStep) return null

    return (
        <div className="container max-w-4xl mx-auto py-10 px-4">
            {/* Phase Indicator */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((phase) => (
                            <div
                                key={phase}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${phase === currentPhase
                                    ? "bg-primary text-primary-foreground"
                                    : phase < currentPhase
                                        ? "bg-green-500/20 text-green-600"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                Faza {phase}
                            </div>
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {currentStepIndex + 1} / {activeSteps.length}
                    </span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <Card className="min-h-[450px] flex flex-col relative">
                {/* Panic Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 text-xs"
                    onClick={handlePanicButton}
                >
                    <Zap className="h-3 w-3 mr-1" />
                    Ne razumijem se, daj najbolje
                </Button>

                <CardHeader className="pb-4">
                    <Badge variant="outline" className="w-fit mb-2">
                        {currentPhase === 1 ? "Namjena" : currentPhase === 2 ? "Intenzitet" : currentPhase === 3 ? "Estetika" : "Budžet"}
                    </Badge>
                    <CardTitle className="text-2xl md:text-3xl leading-tight">
                        {currentStep.question}
                    </CardTitle>
                    {currentStep.description && (
                        <CardDescription className="text-base">{currentStep.description}</CardDescription>
                    )}
                </CardHeader>

                <CardContent className="flex-1 flex items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {currentStep.options.map((option) => {
                            const Icon = option.icon || Check
                            const isSelected = answers[currentStep.id] === option.id
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionSelect(option.id)}
                                    className={`
                    relative flex flex-col items-start justify-center p-5 gap-2 rounded-xl border-2 transition-all text-left
                    ${isSelected
                                            ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                                        }
                  `}
                                >
                                    {option.icon && <Icon className={`h-6 w-6 mb-1 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />}
                                    <span className="font-semibold text-base">{option.label}</span>
                                    {option.sublabel && (
                                        <span className="text-xs text-muted-foreground">{option.sublabel}</span>
                                    )}
                                    {isSelected && (
                                        <div className="absolute top-3 right-3">
                                            <div className="rounded-full bg-primary p-1">
                                                <Check className="h-3 w-3 text-primary-foreground" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t p-6">
                    <Button variant="ghost" onClick={prevStep} disabled={currentStepIndex === 0}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Nazad
                    </Button>
                    <Button onClick={nextStep} disabled={!answers[currentStep.id]}>
                        {currentStepIndex === activeSteps.length - 1 ? "Prikaži Rezultat" : "Dalje"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
