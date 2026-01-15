'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function JobDetailPage() {
    const params = useParams();
    const { data: job, error, isLoading } = useSWR(params.id ? `/api/jobs/${params.id}` : null, fetcher, { refreshInterval: 5000 });

    if (error) return <div>Failed to load job</div>;
    if (isLoading) return <div>Loading...</div>;

    // Find audio asset
    const audioAsset = job.assets?.find((a: any) => a.type === 'audio');
    const influencerName = job.influencerId ? job.influencerId : 'N/A'; // We might want to fetch influencer details or include them in API

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{job.input?.productName}</h1>
                    <p className="text-muted-foreground">Run ID: <span className="font-mono text-xs">{job.runId}</span></p>
                    {job.influencerId && (
                        <div className="mt-2 text-sm text-foreground flex items-center gap-2">
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase">Influencer</span>
                            {/* We assume the API returns expanded influencer or we just show ID for now if not relation included */}
                            {/* Ideally API should include: include: { influencer: true } */}
                            {job.influencer?.name || job.influencerId}
                        </div>
                    )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium 
            ${job.status === 'SUCCEEDED' ? 'bg-green-100 text-green-700' :
                        job.status === 'RUNNING' ? 'bg-blue-100 text-blue-700' :
                            job.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'}`}>
                    {job.status}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold">Progress</h2>
                    <div className="bg-card border border-border rounded-xl p-6">
                        {job.steps && job.steps.map((step: any, index: number) => (
                            <div key={step.id} className="flex gap-4 mb-6 last:mb-0">
                                {/* Simple status indicator */}
                                <div className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 
                             ${step.status === 'succeeded' ? 'bg-green-500' :
                                        step.status === 'running' ? 'bg-blue-500 animate-pulse' :
                                            step.status === 'failed' ? 'bg-red-500' : 'bg-gray-300'
                                    }`}
                                />
                                <div>
                                    <h3 className="font-medium text-foreground capitalize">{step.step.replace('_', ' ')}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {step.status}
                                        {step.finishedAt && ` • ${new Date(step.finishedAt).toLocaleTimeString()}`}
                                    </p>

                                    {/* Render step output if available/interesting */}
                                    {step.output && (
                                        <div className="bg-muted/50 p-3 rounded-lg text-xs font-mono overflow-auto max-h-40 w-full">
                                            <pre>{JSON.stringify(step.output, null, 2)}</pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {(!job.steps || job.steps.length === 0) && (
                            <p className="text-muted-foreground">Job queued. Waiting for worker...</p>
                        )}
                    </div>
                </div>

                {/* Assets / Details */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Assets</h2>
                    <div className="bg-card border border-border rounded-xl p-6 space-y-6">

                        {/* Audio Player */}
                        {audioAsset && (
                            <div>
                                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <span>🎵</span> Generated Audio
                                </h3>
                                <audio controls src={audioAsset.url} className="w-full" />
                                <div className="text-xs text-muted-foreground mt-1">
                                    Voice ID: {audioAsset.metadata?.voiceId}
                                </div>
                            </div>
                        )}

                        {job.status === 'SUCCEEDED' ? (
                            <div className="space-y-4">
                                <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white">
                                    {/* Placeholder for video player */}
                                    <span>Video Player Placeholder</span>
                                </div>
                                <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg">Download Video</button>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground text-sm">
                                Video generation pending...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
