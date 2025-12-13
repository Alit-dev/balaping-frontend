import { useState } from 'react';
import { Shield, Eye, Lock, Database, Cookie, UserCheck, Mail, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Privacy() {
    const [language, setLanguage] = useState<'en' | 'bn'>('en');

    const content = {
        en: {
            badge: 'Legal',
            title: 'Privacy Policy',
            subtitle: 'Your privacy is important to us. Learn how we collect, use, and protect your data.',
            lastUpdated: 'Last Updated: December 7, 2025',
            sections: [
                {
                    icon: Database,
                    title: 'Information We Collect',
                    content: [
                        'Account Information: When you register, we collect your name, email address, and password.',
                        'Monitor Data: Information about the services you monitor, including URLs, response times, and uptime statistics.',
                        'Usage Data: How you interact with our platform, including pages visited and features used.',
                        'Payment Information: If you subscribe to paid plans, we collect billing details processed securely by Stripe.',
                    ],
                },
                {
                    icon: Eye,
                    title: 'How We Use Your Information',
                    content: [
                        'To provide and maintain our monitoring services',
                        'To send you alerts and notifications about your monitors',
                        'To improve our platform based on usage patterns',
                        'To communicate with you about updates, offers, and support',
                        'To detect and prevent fraud and abuse',
                    ],
                },
                {
                    icon: Lock,
                    title: 'Data Security',
                    content: [
                        'All data is encrypted in transit using TLS 1.3',
                        'Passwords are hashed using bcrypt with salt',
                        'We use secure, SOC 2 compliant data centers',
                        'Regular security audits and penetration testing',
                        'Access to data is strictly limited to authorized personnel',
                    ],
                },
                {
                    icon: Cookie,
                    title: 'Cookies & Tracking',
                    content: [
                        'Essential Cookies: Required for the platform to function properly',
                        'Analytics Cookies: Help us understand how you use our service (opt-out available)',
                        'We do not sell your data to third parties',
                        'You can manage cookie preferences in your browser settings',
                    ],
                },
                {
                    icon: UserCheck,
                    title: 'Your Rights (GDPR/CCPA)',
                    content: [
                        'Right to Access: Request a copy of your personal data',
                        'Right to Rectification: Correct inaccurate personal data',
                        'Right to Erasure: Request deletion of your data ("Right to be Forgotten")',
                        'Right to Data Portability: Export your data in a machine-readable format',
                        'Right to Object: Opt-out of marketing communications',
                        'California residents have additional rights under CCPA',
                    ],
                },
                {
                    icon: Shield,
                    title: 'Data Retention',
                    content: [
                        'Active account data is retained while your account is active',
                        'Monitor history is retained for the period specified in your plan',
                        'Deleted accounts and data are permanently removed within 30 days',
                        'Backup data is retained for up to 90 days for disaster recovery',
                    ],
                },
            ],
            contact: {
                title: 'Contact Us About Privacy',
                description: 'If you have questions about this Privacy Policy or want to exercise your data rights, please contact us:',
                email: 'privacy@balaping.com',
            },
        },
        bn: {
            badge: 'আইনি',
            title: 'প্রাইভেসি পলিসি',
            subtitle: 'আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ। জানুন কীভাবে আমরা আপনার ডেটা সংগ্রহ, ব্যবহার এবং সুরক্ষিত করি।',
            lastUpdated: 'সর্বশেষ আপডেট: ৭ ডিসেম্বর, ২০২৫',
            sections: [
                {
                    icon: Database,
                    title: 'আমরা যে তথ্য সংগ্রহ করি',
                    content: [
                        'অ্যাকাউন্ট তথ্য: রেজিস্ট্রেশনের সময় আমরা আপনার নাম, ইমেইল ঠিকানা এবং পাসওয়ার্ড সংগ্রহ করি।',
                        'মনিটর ডেটা: আপনি যে সার্ভিসগুলো মনিটর করেন সেগুলোর তথ্য, যার মধ্যে URL, রেসপন্স টাইম এবং আপটাইম পরিসংখ্যান অন্তর্ভুক্ত।',
                        'ব্যবহার ডেটা: আপনি কীভাবে আমাদের প্ল্যাটফর্মের সাথে ইন্টারঅ্যাক্ট করেন, যার মধ্যে পরিদর্শিত পৃষ্ঠা এবং ব্যবহৃত ফিচার অন্তর্ভুক্ত।',
                        'পেমেন্ট তথ্য: আপনি যদি পেইড প্ল্যানে সাবস্ক্রাইব করেন, আমরা Stripe দ্বারা নিরাপদে প্রক্রিয়াকৃত বিলিং বিবরণ সংগ্রহ করি।',
                    ],
                },
                {
                    icon: Eye,
                    title: 'আমরা কীভাবে আপনার তথ্য ব্যবহার করি',
                    content: [
                        'আমাদের মনিটরিং সার্ভিস প্রদান এবং রক্ষণাবেক্ষণ করতে',
                        'আপনার মনিটর সম্পর্কে অ্যালার্ট এবং নোটিফিকেশন পাঠাতে',
                        'ব্যবহার প্যাটার্নের উপর ভিত্তি করে আমাদের প্ল্যাটফর্ম উন্নত করতে',
                        'আপডেট, অফার এবং সাপোর্ট সম্পর্কে আপনার সাথে যোগাযোগ করতে',
                        'জালিয়াতি এবং অপব্যবহার সনাক্ত এবং প্রতিরোধ করতে',
                    ],
                },
                {
                    icon: Lock,
                    title: 'ডেটা সিকিউরিটি',
                    content: [
                        'TLS 1.3 ব্যবহার করে ট্রানজিটে সমস্ত ডেটা এনক্রিপ্ট করা হয়',
                        'পাসওয়ার্ড সল্ট সহ bcrypt ব্যবহার করে হ্যাশ করা হয়',
                        'আমরা নিরাপদ, SOC 2 কমপ্লায়েন্ট ডেটা সেন্টার ব্যবহার করি',
                        'নিয়মিত সিকিউরিটি অডিট এবং পেনিট্রেশন টেস্টিং',
                        'অনুমোদিত কর্মীদের মধ্যে ডেটা অ্যাক্সেস কঠোরভাবে সীমিত',
                    ],
                },
                {
                    icon: Cookie,
                    title: 'কুকিজ এবং ট্র্যাকিং',
                    content: [
                        'প্রয়োজনীয় কুকিজ: প্ল্যাটফর্ম সঠিকভাবে কাজ করার জন্য প্রয়োজনীয়',
                        'অ্যানালিটিক্স কুকিজ: আমাদের বুঝতে সাহায্য করে আপনি কীভাবে আমাদের সার্ভিস ব্যবহার করেন (অপ্ট-আউট উপলব্ধ)',
                        'আমরা আপনার ডেটা তৃতীয় পক্ষের কাছে বিক্রি করি না',
                        'আপনি আপনার ব্রাউজার সেটিংসে কুকি পছন্দ পরিচালনা করতে পারেন',
                    ],
                },
                {
                    icon: UserCheck,
                    title: 'আপনার অধিকার (GDPR/CCPA)',
                    content: [
                        'অ্যাক্সেসের অধিকার: আপনার ব্যক্তিগত ডেটার একটি কপি অনুরোধ করুন',
                        'সংশোধনের অধিকার: ভুল ব্যক্তিগত ডেটা সংশোধন করুন',
                        'মুছে ফেলার অধিকার: আপনার ডেটা মুছে ফেলার অনুরোধ করুন ("ভুলে যাওয়ার অধিকার")',
                        'ডেটা পোর্টেবিলিটির অধিকার: মেশিন-রিডেবল ফরম্যাটে আপনার ডেটা এক্সপোর্ট করুন',
                        'আপত্তির অধিকার: মার্কেটিং যোগাযোগ থেকে অপ্ট-আউট করুন',
                        'ক্যালিফোর্নিয়া বাসিন্দাদের CCPA এর অধীনে অতিরিক্ত অধিকার রয়েছে',
                    ],
                },
                {
                    icon: Shield,
                    title: 'ডেটা ধারণ',
                    content: [
                        'আপনার অ্যাকাউন্ট সক্রিয় থাকাকালীন সক্রিয় অ্যাকাউন্ট ডেটা ধরে রাখা হয়',
                        'মনিটর ইতিহাস আপনার প্ল্যানে নির্দিষ্ট সময়ের জন্য ধরে রাখা হয়',
                        'মুছে ফেলা অ্যাকাউন্ট এবং ডেটা ৩০ দিনের মধ্যে স্থায়ীভাবে সরানো হয়',
                        'ব্যাকআপ ডেটা দুর্যোগ পুনরুদ্ধারের জন্য ৯০ দিন পর্যন্ত ধরে রাখা হয়',
                    ],
                },
            ],
            contact: {
                title: 'প্রাইভেসি সম্পর্কে যোগাযোগ করুন',
                description: 'এই প্রাইভেসি পলিসি সম্পর্কে আপনার প্রশ্ন থাকলে বা আপনার ডেটা অধিকার প্রয়োগ করতে চাইলে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:',
                email: 'privacy@balaping.com',
            },
        },
    };

    const t = content[language];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50 -z-10" />

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
                            <Shield className="w-4 h-4 mr-2" />
                            {t.badge}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            {t.title}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-4">
                            {t.subtitle}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {t.lastUpdated}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {t.sections.map((section, i) => (
                            <div key={i} className="bg-white rounded-2xl border shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <section.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold">{section.title}</h2>
                                </div>
                                <ul className="space-y-3">
                                    {section.content.map((item, j) => (
                                        <li key={j} className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Contact Section */}
                        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white text-center">
                            <h3 className="text-2xl font-bold mb-2">{t.contact.title}</h3>
                            <p className="text-white/80 mb-4">{t.contact.description}</p>
                            <a
                                href={`mailto:${t.contact.email}`}
                                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                                {t.contact.email}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
