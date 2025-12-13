import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageSquare,
    Clock,
    CheckCircle2,
    Headphones,
    Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [language, setLanguage] = useState<'en' | 'bn'>('en');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const content = {
        en: {
            title: 'Contact Us',
            subtitle: 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
            form: {
                name: 'Your Name',
                email: 'Email Address',
                subject: 'Subject',
                message: 'Your Message',
                submit: 'Send Message',
                sending: 'Sending...',
            },
            success: {
                title: 'Message Sent!',
                message: 'Thank you for reaching out. We\'ll get back to you within 24 hours.',
            },
            support: {
                title: 'Support',
                description: 'Our team is here to help you 24/7',
                email: 'support@balaping.com',
            },
            sales: {
                title: 'Sales',
                description: 'Get in touch for enterprise solutions',
                email: 'sales@balaping.com',
            },
            office: {
                title: 'Office',
                address: 'Dhaka, Bangladesh',
                hours: 'Mon-Fri: 9AM - 6PM (BST)',
            },
            phone: {
                title: 'Phone',
                number: '+880 1XXX-XXXXXX',
                description: 'Available during business hours',
            },
        },
        bn: {
            title: 'যোগাযোগ করুন',
            subtitle: 'প্রশ্ন আছে? আমরা আপনার কথা শুনতে চাই। আমাদের মেসেজ পাঠান, আমরা দ্রুত উত্তর দেব।',
            form: {
                name: 'আপনার নাম',
                email: 'ইমেইল ঠিকানা',
                subject: 'বিষয়',
                message: 'আপনার বার্তা',
                submit: 'মেসেজ পাঠান',
                sending: 'পাঠানো হচ্ছে...',
            },
            success: {
                title: 'মেসেজ পাঠানো হয়েছে!',
                message: 'যোগাযোগ করার জন্য ধন্যবাদ। আমরা ২৪ ঘণ্টার মধ্যে উত্তর দেব।',
            },
            support: {
                title: 'সাপোর্ট',
                description: 'আমাদের টিম ২৪/৭ সাহায্যের জন্য প্রস্তুত',
                email: 'support@balaping.com',
            },
            sales: {
                title: 'সেলস',
                description: 'এন্টারপ্রাইজ সলিউশনের জন্য যোগাযোগ করুন',
                email: 'sales@balaping.com',
            },
            office: {
                title: 'অফিস',
                address: 'ঢাকা, বাংলাদেশ',
                hours: 'সোম-শুক্র: সকাল ৯টা - সন্ধ্যা ৬টা',
            },
            phone: {
                title: 'ফোন',
                number: '+৮৮০ ১XXX-XXXXXX',
                description: 'অফিস সময়ে যোগাযোগযোগ্য',
            },
        },
    };

    const t = content[language];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50 -z-10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

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
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'Get in Touch' : 'যোগাযোগ করুন'}
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

            {/* Main Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl border shadow-sm p-8">
                                {isSubmitted ? (
                                    <div className="text-center py-12 animate-fade-in">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">{t.success.title}</h3>
                                        <p className="text-muted-foreground">{t.success.message}</p>
                                        <Button
                                            className="mt-6"
                                            variant="outline"
                                            onClick={() => {
                                                setIsSubmitted(false);
                                                setFormData({ name: '', email: '', subject: '', message: '' });
                                            }}
                                        >
                                            {language === 'en' ? 'Send Another Message' : 'আরেকটি মেসেজ পাঠান'}
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">{t.form.name}</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                    className="h-12"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">{t.form.email}</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                    className="h-12"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">{t.form.subject}</Label>
                                            <Input
                                                id="subject"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                required
                                                className="h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">{t.form.message}</Label>
                                            <Textarea
                                                id="message"
                                                value={formData.message}
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                                                required
                                                rows={6}
                                                className="resize-none"
                                            />
                                        </div>
                                        <Button type="submit" size="lg" className="w-full h-12" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                    {t.form.sending}
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5 mr-2" />
                                                    {t.form.submit}
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-6">
                            <ContactCard
                                icon={<Headphones className="w-6 h-6" />}
                                iconBg="bg-blue-100 text-blue-600"
                                title={t.support.title}
                                description={t.support.description}
                                link={`mailto:${t.support.email}`}
                                linkText={t.support.email}
                            />
                            <ContactCard
                                icon={<Building2 className="w-6 h-6" />}
                                iconBg="bg-purple-100 text-purple-600"
                                title={t.sales.title}
                                description={t.sales.description}
                                link={`mailto:${t.sales.email}`}
                                linkText={t.sales.email}
                            />
                            <ContactCard
                                icon={<MapPin className="w-6 h-6" />}
                                iconBg="bg-green-100 text-green-600"
                                title={t.office.title}
                                description={t.office.address}
                                linkText={t.office.hours}
                            />
                            <ContactCard
                                icon={<Phone className="w-6 h-6" />}
                                iconBg="bg-orange-100 text-orange-600"
                                title={t.phone.title}
                                description={t.phone.description}
                                link={`tel:${t.phone.number}`}
                                linkText={t.phone.number}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Response Time Banner */}
            <section className="py-12 bg-gradient-to-r from-primary to-blue-600 text-white">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Clock className="w-6 h-6" />
                        <span className="text-2xl font-bold">
                            {language === 'en' ? 'Average Response Time: Under 2 Hours' : 'গড় উত্তর সময়: ২ ঘণ্টার কম'}
                        </span>
                    </div>
                    <p className="text-white/80">
                        {language === 'en'
                            ? 'We prioritize your queries and strive to respond as quickly as possible.'
                            : 'আমরা আপনার প্রশ্নকে অগ্রাধিকার দিই এবং দ্রুত উত্তর দেওয়ার চেষ্টা করি।'
                        }
                    </p>
                </div>
            </section>
        </div>
    );
}

function ContactCard({
    icon,
    iconBg,
    title,
    description,
    link,
    linkText
}: {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    description: string;
    link?: string;
    linkText: string;
}) {
    return (
        <div className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", iconBg)}>
                {icon}
            </div>
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{description}</p>
            {link ? (
                <a href={link} className="text-primary font-medium hover:underline">
                    {linkText}
                </a>
            ) : (
                <span className="text-sm text-muted-foreground">{linkText}</span>
            )}
        </div>
    );
}
