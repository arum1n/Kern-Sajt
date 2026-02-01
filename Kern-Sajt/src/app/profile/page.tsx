"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { Loader2 } from "lucide-react"

export default function ProfileRedirectPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (session?.user) {
                // Try to get profile username, fallback to ID
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', session.user.id)
                    .single()

                const target = profile?.username || session.user.id
                router.replace(`/profile/${target}`)
            } else {
                router.replace('/login?redirect=/profile')
            }
        }

        checkSession()
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Učitavanje profila...</p>
            </div>
        </div>
    )
}
