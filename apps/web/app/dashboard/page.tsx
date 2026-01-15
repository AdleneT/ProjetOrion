'use client';

import useSWR from 'swr';
import { JobCard } from '@/components/JobCard';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
    const { data, error, isLoading } = useSWR('/api/jobs', fetcher, { refreshInterval: 5000 });

    if (error) return <div>Failed to load jobs</div>;
    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Campaigns</h1>
                <a
                    href="/dashboard/new"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    New Campaign
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.jobs.map((job: any) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    );
}
