import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const newsArticles = [
        {
            title: "New RA Treatment Guidelines 2025",
            summary: "Summary of recent guidelines for rheumatoid arthritis treatment published by ACR.",
            link: "https://www.rheumatology.org/Portals/0/Files/ACR-Guideline-RA-2025.pdf",
        },
        {
            title: "Emerging Therapies in Lupus Management",
            summary: "Breakthrough studies show promising results with biologic drugs in SLE patients.",
            link: "https://www.rheumatologyadvisor.com/home/topics/lupus/",
        },
        {
            title: "Psoriatic Arthritis and Gut Microbiome",
            summary: "New connections found between microbiome health and inflammation in PsA.",
            link: "https://pubmed.ncbi.nlm.nih.gov/?term=psoriatic+arthritis+microbiome",
        },
    ];

    return (
        <>
            <Head title="Rheumatology Registry Home" />
            <div className="bg-gray-50 text-black/70 dark:bg-black dark:text-white/70 min-h-screen px-6">
                <header className="flex justify-between items-center py-6 border-b border-gray-200 dark:border-gray-800">
                    <h1 className="text-2xl font-bold">Rheumatology Clinic Data Registry</h1>
                   <div>
                        {auth.user ? (
                            <Link href={route('dashboard')} className="px-4 py-2 rounded hover:underline">
                                Dashboard
                            </Link> ) : 
                            (
                                <>
                                    <Link href={route('login')} className="px-4 py-2 rounded hover:underline">
                                        Login
                                    </Link>
                                
                                    <Link href={route('register')} className="hidden">
                                        Register
                                    </Link>
                                </>
                            )}
                    </div>

                </header>

                    <div className="w-full h-[400px] my-6 overflow-hidden rounded-lg shadow">
                        <img
                            src="/images/clinic-banner6.JPG"
                            alt="Rheumatology Illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>

                <main className="mt-10">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Latest in Rheumatology</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {newsArticles.map((article, index) => (
                                <a
                                    key={index}
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-6 bg-white dark:bg-zinc-800 rounded shadow hover:shadow-md transition"
                                >
                                    <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                                    <p className="text-sm">{article.summary}</p>
                                    <span className="mt-3 block text-blue-600 dark:text-blue-400">Read more →</span>
                                </a>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="text-center mt-16 py-6 text-sm text-gray-600 dark:text-gray-400">
                    Laravel v{laravelVersion} (PHP v{phpVersion}) — Rheumatology Clinic Data Registry of Sri Lanka
                </footer>
            </div>
        </>
    );
}
