import { Card, CardContent } from "@/Components/UI/Card";
import { useTranslations } from "@/Hooks/useTranslations";
import UserLayout from "@/Layouts/FrontendLayout";
import {
    ExternalLink,
    Facebook,
    Globe,
    Instagram,
    Linkedin,
    Mail,
    MessageCircle,
    MessageSquare,
    Music,
    Phone,
    Send,
    Twitter,
    Youtube
} from "lucide-react";

export default function Support({ support_links = [], email }: any) {

    const { t } = useTranslations();

    /* ================= ICON MAP ================= */
    const getIcon = (channel: string) => {
        switch (channel) {
            case 'whatsapp':
                return <MessageCircle className="w-4 h-4 text-green-600" />;
            case 'telegram':
                return <Send className="w-4 h-4 text-blue-500" />;
            case 'facebook':
                return <Facebook className="w-4 h-4 text-blue-700" />;
            case 'instagram':
                return <Instagram className="w-4 h-4 text-pink-500" />;
            case 'twitter':
                return <Twitter className="w-4 h-4 text-sky-500" />;
            case 'linkedin':
                return <Linkedin className="w-4 h-4 text-blue-600" />;
            case 'youtube':
                return <Youtube className="w-4 h-4 text-red-500" />;
            case 'discord':
                return <MessageSquare className="w-4 h-4 text-indigo-500" />;
            case 'tiktok':
                return <Music className="w-4 h-4 text-slate-700" />;
            case 'email':
                return <Mail className="w-4 h-4 text-yellow-500" />;
            case 'phone':
                return <Phone className="w-4 h-4 text-green-500" />;
            case 'website':
                return <Globe className="w-4 h-4 text-cyan-500" />;
            default:
                return <MessageCircle className="w-4 h-4 text-slate-500" />;
        }
    };

    return (
        <UserLayout title="Support">

            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5 bg-gray-50 min-h-screen">


                {/* HEADER */}
                <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
                    <CardContent className="py-6 text-center space-y-1">
                        <p className="text-gray-500 text-sm">
                            {t("Need Help")}?
                        </p>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {t("Contact Support")}
                        </h2>
                    </CardContent>
                </Card>

                {/* EMAIL PRIORITY */}
                {email && (


                    <Card className="border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm">
                        <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                            {/* LEFT */}
                            <div className="flex items-center gap-3 min-w-0">

                                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500">
                                        {t("Email Support")}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {email}
                                    </p>
                                </div>
                            </div>

                            {/* BUTTON */}
                            <a
                                href={`mailto:${email}`}
                                className="w-full sm:w-auto text-center text-xs px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition active:scale-[0.96]"
                            >
                                {t("Send")}
                            </a>

                        </CardContent>
                    </Card>
                )}

                {/* CHANNEL LIST */}
                <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
                    <CardContent className="py-4 space-y-3">

                        {support_links?.length > 0 ? (
                            support_links.map((item: any, index: number) => {

                                const channel = item.channel?.toLowerCase();

                                return (
                                    <a
                                        key={index}
                                        href={item.link}
                                        target="_blank"
                                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition active:scale-[0.99]"
                                    >

                                        {/* LEFT */}
                                        <div className="flex items-center gap-3">

                                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                                                {getIcon(channel)}
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-gray-900 capitalize">
                                                    {channel?.replace('_', ' ')}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {t("Click to open")}
                                                </p>
                                            </div>
                                        </div>

                                        {/* RIGHT */}
                                        <ExternalLink className="w-4 h-4 text-gray-400" />
                                    </a>
                                );
                            })
                        ) : (
                            <div className="text-center text-sm text-gray-400 py-6">
                                {t("No support links available")}
                            </div>
                        )}

                    </CardContent>
                </Card>

            </div>
        </UserLayout>
    );
}