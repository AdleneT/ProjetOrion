import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'InvoiceCheck 2026',
    description: 'Mise en conformité Factur-X & 2026',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
                {children}
            </body>
        </html>
    )
}
