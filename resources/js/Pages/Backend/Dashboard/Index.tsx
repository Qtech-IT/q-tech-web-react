import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader';
import { StatsCard } from '@/Components/Feature/Stats/StatsCard';
import { Badge } from '@/Components/UI/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { useTranslations } from '@/Hooks/useTranslations';
import { MainLayout } from '@/Layouts/User/MainLayout';
import { Link } from '@inertiajs/react';
import {
  ArrowUpRight,
  FileText,
  FolderTree,
  Gauge,
  Images,
  Languages,
  LayoutGrid,
  type LucideIcon,
  Mail,
  Menu,
  Users,
} from 'lucide-react';

// ─── icon registry ────────────────────────────────────────────────────────────
// The service ships an icon *name*; the page owns the actual component so the
// bundle only pulls the icons it renders.

const ICONS: Record<string, LucideIcon> = {
  FileText,
  LayoutGrid,
  Images,
  FolderTree,
  Menu,
  Users,
  Mail,
  Languages,
};

interface Stat {
  key: string;
  title: string;
  value: number | string;
  description?: string | null;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  href?: string | null;
}

interface RecentPage {
  uuid: string;
  title: string;
  slug: string;
  publish_status?: string | null;
  updated_at?: string | null;
}

interface DashboardProps {
  stats?: Stat[];
  recentPages?: RecentPage[];
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  published: 'default',
  scheduled: 'secondary',
  draft: 'outline',
  archived: 'destructive',
};

function StatTile({ stat }: { stat: Stat }) {
  const card = (
    <StatsCard
      title={stat.title}
      value={stat.value}
      icon={stat.icon ? ICONS[stat.icon] : undefined}
      iconColor={stat.iconColor}
      iconBgColor={stat.iconBgColor}
      description={stat.description}
    />
  );

  if (!stat.href) {
    return card;
  }

  return (
    <Link
      href={stat.href}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {card}
    </Link>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function Dashboard({ stats = [], recentPages = [] }: DashboardProps) {
  const { t } = useTranslations();

  return (
    <MainLayout title={t('Dashboard')}>
      <CommonLayoutHeader
        variant="index"
        breadcrumbItems={[{ label: t('Dashboard') }]}
        title={t('Dashboard')}
        description={t('An overview of everything the site is built from.')}
        icon={Gauge}
      />

      {stats.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-sm text-center text-muted-foreground">
            {t('No data to show yet.')}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatTile key={stat.key} stat={stat} />
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <CardTitle className="text-base">{t('Recently edited pages')}</CardTitle>
          <FileText className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          {recentPages.length === 0 ? (
            <p className="py-6 text-sm text-center text-muted-foreground">
              {t('No pages have been created yet.')}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recentPages.map((page) => (
                <li
                  key={page.uuid}
                  className="flex items-center justify-between gap-3 py-3 min-w-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">
                      {page.title}
                    </p>
                    <p className="text-xs truncate text-muted-foreground">
                      /{page.slug}
                      {page.updated_at ? ` · ${t('updated')} ${page.updated_at}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {page.publish_status ? (
                      <Badge variant={STATUS_VARIANT[page.publish_status] ?? 'outline'}>
                        {t(page.publish_status)}
                      </Badge>
                    ) : null}
                    <Link
                      href={route('backend.pages.index')}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={t('Open :name', { name: page.title })}
                    >
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
