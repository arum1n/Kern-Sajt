"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PriceRangeSliderProps {
    min: number
    max: number
    step?: number
    defaultValue?: [number, number]
    onValueChange?: (value: [number, number]) => void
    currency?: string
}

export function PriceRangeSlider({
    min,
    max,
    step = 10,
    defaultValue = [min, max],
    onValueChange,
    currency = "KM"
}: PriceRangeSliderProps) {
    const [value, setValue] = React.useState<[number, number]>(defaultValue)

    const handleSliderChange = (newValue: number[]) => {
        const newRange = [newValue[0], newValue[1]] as [number, number]
        setValue(newRange)
        onValueChange?.(newRange)
    }

    const handleInputChange = (index: 0 | 1, inputValue: string) => {
        const numValue = parseInt(inputValue)
        if (isNaN(numValue)) return

        const newValue = [...value] as [number, number]
        newValue[index] = numValue
        setValue(newValue)
        onValueChange?.(newValue)
    }

    return (
        <div className="space-y-4">
            <Slider
                defaultValue={defaultValue}
                value={value}
                min={min}
                max={max}
                step={step}
                onValueChange={handleSliderChange}
                className="mt-2"
            />
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Min ({currency})</Label>
                    <Input
                        type="number"
                        value={value[0]}
                        onChange={(e) => handleInputChange(0, e.target.value)}
                        className="h-8 text-sm"
                        min={min}
                        max={value[1]}
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Max ({currency})</Label>
                    <Input
                        type="number"
                        value={value[1]}
                        onChange={(e) => handleInputChange(1, e.target.value)}
                        className="h-8 text-sm"
                        min={value[0]}
                        max={max}
                    />
                </div>
            </div>
        </div>
    )
}
