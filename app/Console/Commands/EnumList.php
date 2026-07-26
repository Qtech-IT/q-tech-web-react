<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use ReflectionClass;
use ReflectionEnum;
use Symfony\Component\Finder\Finder;

/**
 * Class EnumList
 *
 * This command scans the app/Enums directory and lists all enum classes.
 * It groups enums by subfolder, similar to route:list style output.
 *
 * Usage:
 *    php artisan enum:list
 */
class EnumList extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'enum:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List all enums grouped by directory inside app/Enums';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $enumPath = app_path('Enums');

        if (!is_dir($enumPath)) {
            $this->error("No 'app/Enums' directory found.");
            return self::FAILURE;
        }

        $finder = new Finder();
        $finder
            ->files()
            ->in($enumPath)
            ->name('*.php');

        $groupedEnums = [];

        // Scan each enum file
        foreach ($finder as $file) {
            $relativePath = str_replace($enumPath, '', $file->getPath());
            $groupName = trim(str_replace('/', '.', $relativePath), '.');

            $className = $this->resolveClassFromFile($file->getRealPath());

            // Only include backed or pure enums
            if (!enum_exists($className)) {
                continue;
            }

            $groupedEnums[$groupName][] = $className;
        }

        // Display grouped output
        foreach ($groupedEnums as $group => $enumClasses) {
            $this->info("\n== " . ($group ?: "Enums") . " ==");

            foreach ($enumClasses as $class) {
                $this->line("• {$class}");

                $ref = new ReflectionEnum($class);

                foreach ($ref->getCases() as $case) {
                    $value = $case->getBackingValue() ?? '';
                    $valueDisplay = $value !== '' ? " = {$value}" : '';
                    $this->line("   - {$case->name}{$valueDisplay}");
                }
            }
        }

        $this->info("\n✔ Enum listing complete.");

        return self::SUCCESS;
    }

    /**
     * Convert a file path into a full namespaced class name.
     */
    private function resolveClassFromFile(string $filePath): ?string
    {
        $content = file_get_contents($filePath);

        preg_match('/namespace\s+(.+?);/', $content, $namespaceMatch);
        preg_match('/enum\s+([a-zA-Z0-9_]+)/', $content, $classMatch);

        if (!$namespaceMatch || !$classMatch) {
            return null;
        }

        return $namespaceMatch[1] . '\\' . $classMatch[1];
    }
}
