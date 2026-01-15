import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner' // Assuming sonner is used, if not we can add it or remove

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Orion AI - Premium UGC Video Gen',
    description: 'Generate high-performance UGC videos with AI agents.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main className="min-h-screen bg-background">
                    {children}
                </main>
                <Toaster richColors />
            </body>
        </html>
    )
}
