'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        platform: 'tiktok_ads',
        productName: '',
        usp: '',
        tone: 'energetic'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    platform: formData.platform,
                    brief: {
                        productName: formData.productName,
                        usp: formData.usp,
                        tone: formData.tone
                    }
                }),
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {
                alert('Failed to create job');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">New Campaign</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border border-border">
                <div>
                    <label className="block text-sm font-medium mb-2">Platform</label>
                    <select
                        value={formData.platform}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                        className="w-full p-2 rounded-md border border-input bg-background"
                    >
                        <option value="tiktok_ads">TikTok Ads</option>
                        <option value="tiktok_shop">TikTok Shop</option>
                        <option value="meta_ads">Meta Ads</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <input
                        type="text"
                        required
                        value={formData.productName}
                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        className="w-full p-2 rounded-md border border-input bg-background"
                        placeholder="e.g. SuperGlidr 3000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Unique Selling Proposition (USP)</label>
                    <textarea
                        required
                        value={formData.usp}
                        onChange={(e) => setFormData({ ...formData, usp: e.target.value })}
                        className="w-full p-2 rounded-md border border-input bg-background h-32"
                        placeholder="Why is it special?"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Tone</label>
                    <select
                        value={formData.tone}
                        onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                        className="w-full p-2 rounded-md border border-input bg-background"
                    >
                        <option value="energetic">Energetic</option>
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="humorous">Humorous</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Start Generation'}
                </button>
            </form>
        </div>
    );
}
