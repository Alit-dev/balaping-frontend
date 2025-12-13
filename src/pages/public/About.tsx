import { useState } from 'react';
import {
    Target,
    Heart,
    Users,
    Award,
    Rocket,
    Globe,
    Shield,
    Zap,
    CheckCircle2,
    Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function About() {
    const [language, setLanguage] = useState<'en' | 'bn'>('en');

    const content = {
        en: {
            badge: 'Our Story',
            title: 'About Balaping',
            subtitle: 'Building the future of uptime monitoring, one check at a time.',
            mission: {
                title: 'Our Mission',
                description: 'To empower businesses with reliable, real-time monitoring solutions that ensure their digital presence is always available. We believe downtime should never catch you off guard.',
            },
            story: {
                title: 'Our Story',
                paragraphs: [
                    'Balaping was born out of frustration. As developers, we experienced the pain of discovering our services were down only after angry customer emails started pouring in.',
                    'We built Balaping to solve this problem — not just for ourselves, but for every developer, startup, and enterprise that relies on their online services.',
                    'Today, we monitor millions of endpoints worldwide, helping teams stay ahead of issues before they impact users.',
                ],
            },
            values: {
                title: 'Our Values',
                items: [
                    { icon: Shield, title: 'Reliability First', description: 'We practice what we preach. Our infrastructure is built for 99.99% uptime.' },
                    { icon: Zap, title: 'Speed Matters', description: 'Alerts in seconds, not minutes. Every moment counts during an outage.' },
                    { icon: Heart, title: 'Customer Obsessed', description: 'Your success is our success. We\'re here 24/7 to help you succeed.' },
                    { icon: Globe, title: 'Global Reach', description: 'Monitoring from 180+ locations worldwide for accurate, local insights.' },
                ],
            },
            winning: {
                title: 'Why Choose Us?',
                items: [
                    '99.99% platform uptime guarantee',
                    'Sub-second alert delivery',
                    '24/7 expert support',
                    'Enterprise-grade security',
                    'Transparent pricing, no hidden fees',
                    'Beautiful, intuitive dashboard',
                ],
            },
            team: {
                title: 'Our Team',
                description: 'A passionate team of engineers, designers, and support specialists dedicated to keeping your services online.',
            },
            stats: [
                { value: '50M+', label: 'Daily Checks' },
                { value: '10K+', label: 'Happy Customers' },
                { value: '180+', label: 'Global Locations' },
                { value: '99.99%', label: 'Uptime SLA' },
            ],
        },
        bn: {
            badge: 'আমাদের গল্প',
            title: 'Balaping সম্পর্কে',
            subtitle: 'আপটাইম মনিটরিংয়ের ভবিষ্যৎ তৈরি করছি, প্রতিটি চেকে।',
            mission: {
                title: 'আমাদের মিশন',
                description: 'ব্যবসাগুলোকে নির্ভরযোগ্য, রিয়েল-টাইম মনিটরিং সলিউশন দিয়ে ক্ষমতায়ন করা যাতে তাদের ডিজিটাল উপস্থিতি সবসময় সচল থাকে। আমরা বিশ্বাস করি ডাউনটাইম কখনোই আপনাকে অপ্রস্তুত অবস্থায় পাওয়া উচিত নয়।',
            },
            story: {
                title: 'আমাদের গল্প',
                paragraphs: [
                    'Balaping জন্মেছিল হতাশা থেকে। ডেভেলপার হিসেবে, আমরা সেই কষ্ট অনুভব করেছি যখন রাগান্বিত কাস্টমারদের ইমেইল আসার পর বুঝতে পারতাম যে আমাদের সার্ভিস ডাউন ছিল।',
                    'আমরা Balaping তৈরি করেছি এই সমস্যা সমাধানের জন্য — শুধু নিজেদের জন্য নয়, প্রতিটি ডেভেলপার, স্টার্টআপ এবং এন্টারপ্রাইজের জন্য যারা তাদের অনলাইন সার্ভিসের উপর নির্ভর করে।',
                    'আজ, আমরা বিশ্বব্যাপী লক্ষ লক্ষ এন্ডপয়েন্ট মনিটর করি, টিমদের সমস্যা ইউজারদের প্রভাবিত করার আগেই সামনে থাকতে সাহায্য করি।',
                ],
            },
            values: {
                title: 'আমাদের মূল্যবোধ',
                items: [
                    { icon: Shield, title: 'নির্ভরযোগ্যতা প্রথম', description: 'আমরা যা বলি তা অনুশীলন করি। আমাদের ইনফ্রাস্ট্রাকচার ৯৯.৯৯% আপটাইমের জন্য তৈরি।' },
                    { icon: Zap, title: 'গতি গুরুত্বপূর্ণ', description: 'মিনিট নয়, সেকেন্ডে অ্যালার্ট। আউটেজের সময় প্রতিটি মুহূর্ত গণনা করে।' },
                    { icon: Heart, title: 'কাস্টমার কেন্দ্রিক', description: 'আপনার সফলতা আমাদের সফলতা। আমরা ২৪/৭ আপনাকে সাহায্য করতে এখানে।' },
                    { icon: Globe, title: 'বৈশ্বিক নাগাল', description: 'সঠিক, স্থানীয় অন্তর্দৃষ্টির জন্য ১৮০+ লোকেশন থেকে মনিটরিং।' },
                ],
            },
            winning: {
                title: 'কেন আমাদের বেছে নেবেন?',
                items: [
                    '৯৯.৯৯% প্ল্যাটফর্ম আপটাইম গ্যারান্টি',
                    'সাব-সেকেন্ড অ্যালার্ট ডেলিভারি',
                    '২৪/৭ এক্সপার্ট সাপোর্ট',
                    'এন্টারপ্রাইজ-গ্রেড সিকিউরিটি',
                    'স্বচ্ছ মূল্য, কোনো লুকানো ফি নেই',
                    'সুন্দর, সহজ ড্যাশবোর্ড',
                ],
            },
            team: {
                title: 'আমাদের টিম',
                description: 'ইঞ্জিনিয়ার, ডিজাইনার এবং সাপোর্ট স্পেশালিস্টদের একটি উত্সাহী দল যারা আপনার সার্ভিস অনলাইন রাখতে নিবেদিত।',
            },
            stats: [
                { value: '৫০ মিলিয়ন+', label: 'দৈনিক চেক' },
                { value: '১০ হাজার+', label: 'সন্তুষ্ট গ্রাহক' },
                { value: '১৮০+', label: 'গ্লোবাল লোকেশন' },
                { value: '৯৯.৯৯%', label: 'আপটাইম SLA' },
            ],
        },
    };

    const t = content[language];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50 -z-10" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Language Toggle */}
                        <div className="flex justify-center gap-2 mb-8">
                            <button
                                onClick={() => setLanguage('en')}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    language === 'en'
                                        ? "bg-primary text-white shadow-lg"
                                        : "bg-white border hover:bg-slate-50"
                                )}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setLanguage('bn')}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    language === 'bn'
                                        ? "bg-primary text-white shadow-lg"
                                        : "bg-white border hover:bg-slate-50"
                                )}
                            >
                                বাংলা
                            </button>
                        </div>

                        <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                            <Rocket className="w-4 h-4 mr-2" />
                            {t.badge}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            {t.title}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {t.subtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-gradient-to-r from-primary to-blue-600 text-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {t.stats.map((stat, i) => (
                            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                                <div className="text-primary-100 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl border shadow-sm p-8 md:p-12 mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <Target className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">{t.mission.title}</h2>
                            </div>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {t.mission.description}
                            </p>
                        </div>

                        {/* Story Section */}
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold mb-6 text-center">{t.story.title}</h2>
                            <div className="space-y-4">
                                {t.story.paragraphs.map((para, i) => (
                                    <p key={i} className="text-lg text-muted-foreground leading-relaxed">
                                        {para}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-slate-50 border-y">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-bold mb-12 text-center">{t.values.title}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {t.values.items.map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                    <item.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Winning Points Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center">{t.winning.title}</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {t.winning.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gradient-to-br from-primary/5 to-blue-50">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Users className="w-8 h-8 text-primary" />
                        <h2 className="text-3xl font-bold">{t.team.title}</h2>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
                        {t.team.description}
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="w-20 h-20 bg-gradient-to-br from-primary/20 to-blue-200 rounded-full flex items-center justify-center">
                                <Users className="w-8 h-8 text-primary/50" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
