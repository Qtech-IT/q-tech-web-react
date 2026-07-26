import { Separator } from '@/Components/UI/Separator'
import UserLayout from '@/Layouts/FrontendLayout'

// ── Types ─────────────────────────────────────────────
interface PageData {
    title: string
    content: string
    created_at?: string
}

interface Props {
    title: string
    page: PageData
}

// ── Component ─────────────────────────────────────────
export default function Page({ title, page }: Props) {
    return (
        <UserLayout title={title}>
            <div className="min-h-screen bg-white text-slate-900">

                {/* ── Content ───────────────────────── */}
                <div className="px-5 py-6 max-w-3xl mx-auto">

                    {/* Title */}
                    <h1 className="text-xl font-bold mb-2 text-slate-900">
                        {page.title}
                    </h1>

                    <Separator className="bg-slate-200 mb-6" />

                    {/* HTML Content */}
                    <div
                        className="
                            prose max-w-none
                            prose-headings:text-slate-900
                            prose-p:text-slate-700
                            prose-li:text-slate-700
                            prose-strong:text-slate-900
                            prose-a:text-blue-600

                            break-words
                            overflow-hidden
                            w-full
                        "
                        style={{
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            hyphens: 'auto',
                        }}
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />

                </div>
            </div>
        </UserLayout>
    )
}