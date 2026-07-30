import { Link } from '@inertiajs/react';
import { ChevronRight, FileText, Home, Layers, Plus } from 'lucide-react';
import { useMemo } from 'react';

import { Can } from '@/Components/Can';
import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Card, CardContent } from '@/Components/UI/Card';
import { useTranslations } from '@/Hooks/useTranslations';
import { MainLayout } from '@/Layouts/User/MainLayout';
import type { CmsPageTreeNode, PageTreeProps } from '@/Types/cms';
import { unwrapList } from '@/Utils/cms';

import { CmsEmpty } from '../Shared/CmsStateBlock';

/**
 * Read-only page hierarchy.
 *
 * `PageTreeResource` already nests `children`, so this renders the server's
 * tree directly rather than rebuilding it from `parent_id` — the depth is
 * whatever the server sent. Reordering lives in the page builder, not here;
 * this screen exists to show structure and jump into it.
 */
function TreeRow({ node, depth }: { node: CmsPageTreeNode; depth: number }) {
  const { t } = useTranslations();

  const children = node.children ?? [];

  return (
    <>
      <li>
        <div
          className="flex items-center gap-2 rounded-md py-2 pr-2 transition-colors hover:bg-accent/60"
          style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
        >
          {children.length > 0 ? (
            <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <span aria-hidden="true" className="size-4 shrink-0" />
          )}

          {node.is_homepage ? (
            <Home aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <FileText aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          )}

          <span className="min-w-0 flex-1 truncate text-sm font-medium">{node.title}</span>

          <code className="hidden shrink-0 truncate font-mono text-xs text-muted-foreground sm:block">
            {node.path}
          </code>

          {node.publish_status ? (
            <Badge variant={node.publish_status === 'published' ? 'default' : 'secondary'}>
              {t(node.publish_status)}
            </Badge>
          ) : null}

          <Can permission="page.update">
            <Button asChild variant="ghost" size="sm">
              <Link href={route('backend.pages.sections', { page: node.uuid })}>
                <Layers aria-hidden="true" className="size-4" />
                <span className="sr-only sm:not-sr-only">{t('Sections')}</span>
              </Link>
            </Button>
          </Can>
        </div>
      </li>

      {children.map((child) => (
        <TreeRow key={child.uuid} node={child} depth={depth + 1} />
      ))}
    </>
  );
}

export function PageTreeWrapper(props: PageTreeProps) {
  const { t } = useTranslations();

  const nodes = useMemo(() => unwrapList<CmsPageTreeNode>(props.data), [props.data]);

  return (
    <MainLayout title={props.title}>
      <CommonLayoutHeader
        variant="index"
        title={props.title}
        description={t('The published structure of the site, as visitors navigate it.')}
        icon={Layers}
        breadcrumbItems={[
          { label: t('Pages'), href: route('backend.pages.index') },
          { label: t('Page Tree') },
        ]}
      />

      <Card>
        <CardContent className="p-2">
          {nodes.length === 0 ? (
            <CmsEmpty
              icon={FileText}
              title={t('No pages yet')}
              description={t('Create your first page to start building the site.')}
              action={
                <Can permission="page.create">
                  <Button asChild>
                    <Link href={route('backend.pages.create')}>
                      <Plus aria-hidden="true" className="size-4" />
                      {t('New Page')}
                    </Link>
                  </Button>
                </Can>
              }
            />
          ) : (
            <ul className="flex flex-col">
              {nodes.map((node) => (
                <TreeRow key={node.uuid} node={node} depth={0} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}

export default PageTreeWrapper;
