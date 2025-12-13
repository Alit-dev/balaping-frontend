import { useState } from 'react';
import { FileText, AlertTriangle, Scale, Ban, Copyright, RefreshCw, Mail, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Terms() {
    const [language, setLanguage] = useState<'en' | 'bn'>('en');

    const content = {
        en: {
            badge: 'Legal',
            title: 'Terms of Service',
            subtitle: 'Please read these terms carefully before using our services.',
            lastUpdated: 'Last Updated: December 7, 2025',
            sections: [
                {
                    icon: FileText,
                    title: 'Acceptance of Terms',
                    content: [
                        'By accessing or using Balaping ("the Service"), you agree to be bound by these Terms of Service.',
                        'If you do not agree to these terms, please do not use our services.',
                        'We may update these terms at any time. Continued use constitutes acceptance of changes.',
                        'You must be at least 18 years old or have parental consent to use the Service.',
                    ],
                },
                {
                    icon: Scale,
                    title: 'Use of Service',
                    content: [
                        'You may use the Service only for lawful purposes and in accordance with these Terms.',
                        'You are responsible for maintaining the confidentiality of your account credentials.',
                        'You agree not to use the Service to monitor websites without proper authorization.',
                        'Automated access to the Service must comply with our API rate limits and guidelines.',
                        'You may not reverse engineer, decompile, or attempt to extract source code from the Service.',
                    ],
                },
                {
                    icon: Ban,
                    title: 'Prohibited Activities',
                    content: [
                        'Using the Service to engage in any illegal activities',
                        'Attempting to gain unauthorized access to our systems or other users\' accounts',
                        'Transmitting viruses, malware, or any malicious code',
                        'Interfering with or disrupting the Service or servers',
                        'Reselling or redistributing the Service without authorization',
                        'Using the Service to monitor illegal or harmful content',
                    ],
                },
                {
                    icon: Copyright,
                    title: 'Intellectual Property',
                    content: [
                        'The Service, including its original content, features, and functionality, is owned by Balaping.',
                        'Our trademarks and trade dress may not be used without our prior written consent.',
                        'You retain ownership of any data you submit to the Service.',
                        'By using the Service, you grant us a license to process your data to provide the Service.',
                        'User-generated content remains the property of the respective users.',
                    ],
                },
                {
                    icon: RefreshCw,
                    title: 'Service Availability & Changes',
                    content: [
                        'We strive for 99.9% uptime but do not guarantee uninterrupted service.',
                        'We may modify, suspend, or discontinue features with reasonable notice.',
                        'Scheduled maintenance will be announced in advance when possible.',
                        'We reserve the right to refuse service to anyone for any reason.',
                        'Pricing changes will be communicated with at least 30 days notice.',
                    ],
                },
                {
                    icon: AlertTriangle,
                    title: 'Limitation of Liability',
                    content: [
                        'The Service is provided "as is" without warranties of any kind.',
                        'We are not liable for any indirect, incidental, special, or consequential damages.',
                        'Our total liability shall not exceed the amount paid by you in the past 12 months.',
                        'We are not responsible for any loss of data, revenue, or business opportunities.',
                        'You acknowledge that monitoring results may not always be 100% accurate.',
                        'Third-party integrations are provided as-is without additional warranties.',
                    ],
                },
            ],
            termination: {
                title: 'Account Termination',
                content: [
                    'You may terminate your account at any time through your dashboard settings.',
                    'We may terminate accounts that violate these terms without prior notice.',
                    'Upon termination, your data will be deleted within 30 days.',
                    'Provisions that should survive termination (liability, IP rights) will remain in effect.',
                ],
            },
            contact: {
                title: 'Questions About Terms?',
                description: 'If you have questions about these Terms of Service, please contact our legal team:',
                email: 'legal@balaping.com',
            },
        },
        bn: {
            badge: 'আইনি',
            title: 'সেবার শর্তাবলী',
            subtitle: 'আমাদের সেবা ব্যবহার করার আগে অনুগ্রহ করে এই শর্তগুলো সাবধানে পড়ুন।',
            lastUpdated: 'সর্বশেষ আপডেট: ৭ ডিসেম্বর, ২০২৫',
            sections: [
                {
                    icon: FileText,
                    title: 'শর্তাবলী গ্রহণ',
                    content: [
                        'Balaping ("সেবা") অ্যাক্সেস বা ব্যবহার করে, আপনি এই সেবার শর্তাবলী দ্বারা আবদ্ধ হতে সম্মত হন।',
                        'আপনি যদি এই শর্তগুলোতে সম্মত না হন, অনুগ্রহ করে আমাদের সেবা ব্যবহার করবেন না।',
                        'আমরা যেকোনো সময় এই শর্তগুলো আপডেট করতে পারি। ক্রমাগত ব্যবহার পরিবর্তন গ্রহণ গণ্য হবে।',
                        'সেবা ব্যবহার করতে আপনার বয়স কমপক্ষে ১৮ বছর হতে হবে বা অভিভাবকের সম্মতি থাকতে হবে।',
                    ],
                },
                {
                    icon: Scale,
                    title: 'সেবার ব্যবহার',
                    content: [
                        'আপনি শুধুমাত্র আইনসম্মত উদ্দেশ্যে এবং এই শর্তাবলী অনুযায়ী সেবা ব্যবহার করতে পারেন।',
                        'আপনি আপনার অ্যাকাউন্ট শংসাপত্রের গোপনীয়তা বজায় রাখার জন্য দায়ী।',
                        'সঠিক অনুমোদন ছাড়া ওয়েবসাইট মনিটর করতে সেবা ব্যবহার না করতে সম্মত হন।',
                        'সেবায় স্বয়ংক্রিয় অ্যাক্সেস অবশ্যই আমাদের API রেট লিমিট এবং গাইডলাইন অনুসরণ করতে হবে।',
                        'আপনি সেবা থেকে রিভার্স ইঞ্জিনিয়ার, ডিকম্পাইল বা সোর্স কোড বের করার চেষ্টা করতে পারবেন না।',
                    ],
                },
                {
                    icon: Ban,
                    title: 'নিষিদ্ধ কার্যক্রম',
                    content: [
                        'কোনো বেআইনি কার্যক্রমে জড়িত হতে সেবা ব্যবহার করা',
                        'আমাদের সিস্টেম বা অন্য ব্যবহারকারীদের অ্যাকাউন্টে অননুমোদিত অ্যাক্সেস পাওয়ার চেষ্টা করা',
                        'ভাইরাস, ম্যালওয়্যার বা কোনো ক্ষতিকর কোড প্রেরণ করা',
                        'সেবা বা সার্ভারে হস্তক্ষেপ বা বিঘ্ন ঘটানো',
                        'অনুমোদন ছাড়া সেবা পুনঃবিক্রয় বা পুনঃবিতরণ করা',
                        'অবৈধ বা ক্ষতিকর কনটেন্ট মনিটর করতে সেবা ব্যবহার করা',
                    ],
                },
                {
                    icon: Copyright,
                    title: 'মেধা সম্পত্তি',
                    content: [
                        'সেবা, এর মূল কনটেন্ট, ফিচার এবং কার্যকারিতা সহ, Balaping এর মালিকানাধীন।',
                        'আমাদের পূর্ব লিখিত সম্মতি ছাড়া আমাদের ট্রেডমার্ক এবং ট্রেড ড্রেস ব্যবহার করা যাবে না।',
                        'আপনি সেবায় জমা দেওয়া যেকোনো ডেটার মালিকানা বজায় রাখেন।',
                        'সেবা ব্যবহার করে, আপনি আমাদের সেবা প্রদান করতে আপনার ডেটা প্রসেস করার লাইসেন্স দেন।',
                        'ব্যবহারকারী-সৃষ্ট কনটেন্ট সংশ্লিষ্ট ব্যবহারকারীদের সম্পত্তি থাকে।',
                    ],
                },
                {
                    icon: RefreshCw,
                    title: 'সেবার উপলব্ধতা এবং পরিবর্তন',
                    content: [
                        'আমরা ৯৯.৯% আপটাইমের জন্য প্রচেষ্টা করি কিন্তু নিরবচ্ছিন্ন সেবার গ্যারান্টি দিই না।',
                        'আমরা যুক্তিসঙ্গত নোটিশ সহ ফিচার পরিবর্তন, স্থগিত বা বন্ধ করতে পারি।',
                        'নির্ধারিত রক্ষণাবেক্ষণ সম্ভব হলে আগেই ঘোষণা করা হবে।',
                        'আমরা যেকোনো কারণে যেকোনো ব্যক্তিকে সেবা প্রদান প্রত্যাখ্যান করার অধিকার সংরক্ষণ করি।',
                        'মূল্য পরিবর্তন কমপক্ষে ৩০ দিন আগে জানানো হবে।',
                    ],
                },
                {
                    icon: AlertTriangle,
                    title: 'দায়বদ্ধতার সীমাবদ্ধতা',
                    content: [
                        'সেবা কোনো প্রকার ওয়ারেন্টি ছাড়াই "যেমন আছে" প্রদান করা হয়।',
                        'আমরা কোনো পরোক্ষ, আকস্মিক, বিশেষ বা ফলস্বরূপ ক্ষতির জন্য দায়ী নই।',
                        'আমাদের মোট দায়বদ্ধতা গত ১২ মাসে আপনার প্রদত্ত পরিমাণের বেশি হবে না।',
                        'আমরা কোনো ডেটা, রাজস্ব বা ব্যবসায়িক সুযোগ হারানোর জন্য দায়ী নই।',
                        'আপনি স্বীকার করেন যে মনিটরিং ফলাফল সবসময় ১০০% সঠিক নাও হতে পারে।',
                        'তৃতীয় পক্ষের ইন্টিগ্রেশন অতিরিক্ত ওয়ারেন্টি ছাড়াই যেমন-আছে প্রদান করা হয়।',
                    ],
                },
            ],
            termination: {
                title: 'অ্যাকাউন্ট বন্ধ',
                content: [
                    'আপনি যেকোনো সময় আপনার ড্যাশবোর্ড সেটিংস থেকে আপনার অ্যাকাউন্ট বন্ধ করতে পারেন।',
                    'আমরা এই শর্ত লঙ্ঘনকারী অ্যাকাউন্ট পূর্ব নোটিশ ছাড়াই বন্ধ করতে পারি।',
                    'বন্ধ হওয়ার পর, আপনার ডেটা ৩০ দিনের মধ্যে মুছে ফেলা হবে।',
                    'যে বিধানগুলো বন্ধের পরেও টিকে থাকা উচিত (দায়বদ্ধতা, মেধা সম্পত্তি অধিকার) কার্যকর থাকবে।',
                ],
            },
            contact: {
                title: 'শর্তাবলী সম্পর্কে প্রশ্ন?',
                description: 'এই সেবার শর্তাবলী সম্পর্কে আপনার প্রশ্ন থাকলে, অনুগ্রহ করে আমাদের আইনি দলের সাথে যোগাযোগ করুন:',
                email: 'legal@balaping.com',
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
                            <FileText className="w-4 h-4 mr-2" />
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

                        {/* Termination Section */}
                        <div className="bg-orange-50 border-orange-200 rounded-2xl border p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 rounded-xl">
                                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                                </div>
                                <h2 className="text-xl font-bold text-orange-900">{t.termination.title}</h2>
                            </div>
                            <ul className="space-y-3">
                                {t.termination.content.map((item, j) => (
                                    <li key={j} className="flex items-start gap-3 text-orange-800">
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

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
