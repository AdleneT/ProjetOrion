import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export function JobCard({ job }: { job: any }) {
    return (
        <Link href={`/dashboard/jobs/${job.id}`} className="block">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
            ${job.status === 'SUCCEEDED' ? 'bg-green-100 text-green-700' :
                            job.status === 'RUNNING' ? 'bg-blue-100 text-blue-700' :
                                job.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'}`}>
                        {job.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    </span>
                </div>

                <h3 className="font-semibold text-foreground mb-1">
                    {job.input?.productName || 'Untitled Campaign'}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                    {job.input?.usp || 'No description provided'}
                </p>

                <div className="mt-3 flex items-center gap-2">
                    {/* Platform Icon placeholder */}
                    <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {job.platform}
                    </div>
                </div>
            </div>
        </Link>
    )
}
