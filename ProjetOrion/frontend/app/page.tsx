import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ShieldCheck, FileText, Zap } from "lucide-react"

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 bg-slate-50">
            <div className="text-center mb-12 max-w-2xl">
                <h1 className="text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                    InvoiceCheck 2026
                </h1>
                <p className="text-xl text-slate-600 mb-8">
                    La conformité Factur-X et PPF simplifiée pour les entreprises.
                    <br />Anticipez la réforme 2026 dès aujourd'hui.
                </p>

                <div className="flex gap-4 justify-center">
                    <Link href="/dashboard">
                        <Button size="lg" className="shadow-lg">Accéder au Dashboard</Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" size="lg">Se connecter</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                            Conformité Légale
                        </CardTitle>
                        <CardDescription>
                            Validation automatique des SIRET et mentions obligatoires.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Autopilot Fix
                        </CardTitle>
                        <CardDescription>
                            Correction intelligente des erreurs de calcul et formats.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-green-600" />
                            Compatible Factur-X
                        </CardTitle>
                        <CardDescription>
                            Export direct au format structuré pour le PPF.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </main>
    )
}
