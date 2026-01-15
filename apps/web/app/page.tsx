import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-24">
            <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                Orion AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-center max-w-2xl">
                Autonomous AI Agents for High-Performance UGC Video Generation.
            </p>

            <div className="flex gap-4">
                <Link
                    href="/dashboard"
                    className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                    Launch Dashboard
                </Link>
                <a
                    href="https://github.com/your-repo"
                    target="_blank"
                    className="px-6 py-3 rounded-full border border-border hover:bg-muted transition-colors"
                >
                    View Documentation
                </a>
            </div>
        </div>
    )
}
