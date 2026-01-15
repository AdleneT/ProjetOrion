'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Influencer {
    id: string;
    name: string;
    language: string;
    persona: any;
}

export default function NewJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [selectedInfluencer, setSelectedInfluencer] = useState<string>('');
    const [formData, setFormData] = useState({
        platform: 'tiktok_ads',
        productName: '',
        productUrl: '',
        price: '',
        usp: '',
        keyBenefits: '',
        tone: 'authentique',
        duration: '30',
        language: 'fr',
        setting: '',
        outfit: '',
        script_mode: 'natural'
    });

    useEffect(() => {
        const loadInfluencers = async () => {
            try {
                const res = await fetch('/api/influencers');
                if (!res.ok) throw new Error('Failed to load influencers');
                const data = await res.json();

                if (Array.isArray(data)) {
                    setInfluencers(data);
                    if (data.length > 0) setSelectedInfluencer(data[0].id);
                }
            } catch (err) {
                console.error(err);
                toast.error('Impossible de charger les influenceurs');
            }
        };
        loadInfluencers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!selectedInfluencer) {
                toast.error('Veuillez sélectionner un influenceur');
                return;
            }

            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    platform: formData.platform,
                    influencerId: selectedInfluencer,
                    brief: {
                        productName: formData.productName,
                        productUrl: formData.productUrl,
                        price: formData.price,
                        usp: formData.usp,
                        keyBenefits: formData.keyBenefits.split('\n').filter(Boolean),
                        tone: formData.tone,
                        duration: formData.duration,
                        language: formData.language,
                        setting: formData.setting,
                        outfit: formData.outfit,
                        script_mode: formData.script_mode
                    }
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Campagne créée avec succès !');
                router.push('/dashboard');
            } else {
                console.error(data);
                toast.error(data.error || 'Erreur lors de la création');
            }
        } catch (error) {
            console.error(error);
            toast.error('Une erreur inattendue est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Nouvelle Campagne</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className="space-y-6 bg-card p-6 rounded-xl border border-border">
                    <h2 className="text-xl font-semibold">1. Détails du Produit</h2>
                    <div>
                        <label className="block text-sm font-medium mb-2">Plateforme</label>
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
                        <label className="block text-sm font-medium mb-2">Nom du Produit</label>
                        <input
                            type="text"
                            required
                            value={formData.productName}
                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                            className="w-full p-2 rounded-md border border-input bg-background"
                            placeholder="ex: SuperGlidr 3000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">URL du Produit</label>
                        <input
                            type="url"
                            value={formData.productUrl}
                            onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
                            className="w-full p-2 rounded-md border border-input bg-background"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Points Forts (USP)</label>
                        <textarea
                            required
                            value={formData.usp}
                            onChange={(e) => setFormData({ ...formData, usp: e.target.value })}
                            className="w-full p-2 rounded-md border border-input bg-background h-24"
                            placeholder="Pourquoi ce produit est unique ?"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Bénéfices Clés (un par ligne)</label>
                        <textarea
                            value={formData.keyBenefits}
                            onChange={(e) => setFormData({ ...formData, keyBenefits: e.target.value })}
                            className="w-full p-2 rounded-md border border-input bg-background h-24"
                            placeholder="- Gain de temps&#10;- Économie d'argent"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                        <h2 className="text-xl font-semibold">2. Choix de l'Influenceur</h2>
                        <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
                            {influencers.length === 0 && <div className="text-muted-foreground text-sm">Chargement des influenceurs...</div>}
                            {influencers.map((inf) => (
                                <div
                                    key={inf.id}
                                    onClick={() => setSelectedInfluencer(inf.id)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedInfluencer === inf.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold">{inf.name}</div>
                                            <div className="text-xs text-muted-foreground">{inf.language.toUpperCase()} • {inf.persona?.style || 'Standard'}</div>
                                        </div>
                                        {selectedInfluencer === inf.id && <div className="text-primary">✓</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                        <h2 className="text-xl font-semibold">3. Direction Artistique</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Ton</label>
                                <select
                                    value={formData.tone}
                                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                    className="w-full p-2 rounded-md border border-input bg-background"
                                >
                                    <option value="authentique">Authentique</option>
                                    <option value="fun">Fun</option>
                                    <option value="premium">Premium</option>
                                    <option value="sérieux">Sérieux</option>
                                    <option value="agressif-soft">Agressif (Soft)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Durée</label>
                                <select
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full p-2 rounded-md border border-input bg-background"
                                >
                                    <option value="15">15s</option>
                                    <option value="30">30s</option>
                                    <option value="45">45s</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Mode de Script</label>
                            <select
                                value={formData.script_mode}
                                onChange={(e) => setFormData({ ...formData, script_mode: e.target.value })}
                                className="w-full p-2 rounded-md border border-input bg-background"
                            >
                                <option value="natural">Naturel (Recommandé)</option>
                                <option value="strict">Strict (Mot à mot)</option>
                                <option value="improvised">Improvisé</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Décor (Optionnel)</label>
                            <input
                                type="text"
                                value={formData.setting}
                                onChange={(e) => setFormData({ ...formData, setting: e.target.value })}
                                className="w-full p-2 rounded-md border border-input bg-background"
                                placeholder="ex: Salon lumineux"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Tenue (Optionnel)</label>
                            <input
                                type="text"
                                value={formData.outfit}
                                onChange={(e) => setFormData({ ...formData, outfit: e.target.value })}
                                className="w-full p-2 rounded-md border border-input bg-background"
                                placeholder="ex: Casual chic"
                            />
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 pb-12">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                Génération en cours...
                            </>
                        ) : (
                            'Lancer la Génération 🚀'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
