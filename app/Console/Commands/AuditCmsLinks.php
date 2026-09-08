<?php

namespace App\Console\Commands;

use App\Http\Services\Cms\LinkAuditService;
use Illuminate\Console\Command;

/**
 * Reports every internal CMS link that resolves to nothing — a menu item or
 * CTA pointing at a deleted page, an in-content link to an unowned path, a
 * dead named route, a self- or 404-ing redirect, and published pages with no
 * inbound link.
 *
 * `--check` turns it into a CI gate: a non-empty result exits non-zero.
 */
class AuditCmsLinks extends Command
{
    protected $signature = 'cms:audit-links {--check : Exit non-zero when any dangling link is found}';

    protected $description = 'Report CMS links that resolve to no page, route or redirect';

    public function handle(LinkAuditService $audit): int
    {
        $findings = $audit->run();

        if ($findings === []) {
            $this->info('No dangling CMS links. Every menu item, CTA and in-content link resolves.');

            return self::SUCCESS;
        }

        foreach ($audit->group($findings) as $type => $group) {
            $this->newLine();
            $this->line("<comment>{$type}</comment> ({$group->count()})");

            $this->table(
                ['Source', 'Problem', 'Target'],
                $group->map(fn (array $f): array => [
                    $f['source'],
                    $f['detail'],
                    $f['target'] ?? '—',
                ])->all(),
            );
        }

        $this->newLine();
        $this->error(count($findings).' dangling link(s) found.');

        return $this->option('check') ? self::FAILURE : self::SUCCESS;
    }
}
