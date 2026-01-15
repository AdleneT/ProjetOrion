import Link from 'next/link';

export function Sidebar() {
    return (
        <div className="w-64 h-screen bg-card border-r border-border p-4 flex flex-col">
            <div className="mb-8 px-2">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                    Orion
                </h2>
            </div>

            <nav className="flex-1 space-y-2">
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/dashboard/new">New Campaign</NavLink>
                <NavLink href="/dashboard/settings">Settings</NavLink>
            </nav>

            <div className="p-4 border-t border-border mt-auto">
                <div className="text-sm text-muted-foreground">Logged in as Admin</div>
            </div>
        </div>
    );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
            {children}
        </Link>
    )
}
