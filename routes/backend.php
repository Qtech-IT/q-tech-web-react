<?php

use App\Http\Controllers\Auth\AuthenticateController;
use App\Http\Controllers\Backend\AdminUserController;
use App\Http\Controllers\Backend\Cms\BlockController;
use App\Http\Controllers\Backend\Cms\ContentTranslationController;
use App\Http\Controllers\Backend\Cms\CtaController;
use App\Http\Controllers\Backend\Cms\MediaController;
use App\Http\Controllers\Backend\Cms\MediaFolderController;
use App\Http\Controllers\Backend\Cms\MenuController;
use App\Http\Controllers\Backend\Cms\MenuItemController;
use App\Http\Controllers\Backend\Cms\PageController;
use App\Http\Controllers\Backend\Cms\PageSectionController;
use App\Http\Controllers\Backend\Cms\RedirectController;
use App\Http\Controllers\Backend\Cms\SectionBlockController;
use App\Http\Controllers\Backend\Cms\SeoMetaController;
use App\Http\Controllers\Backend\DashboardController;
use App\Http\Controllers\Backend\Job\FailedJobController;
use App\Http\Controllers\Backend\Job\JobController;
use App\Http\Controllers\Backend\LanguageController;
use App\Http\Controllers\Backend\Marketing\BulkMailController;
use App\Http\Controllers\Backend\Marketing\ContactSubmissionController;
use App\Http\Controllers\Backend\Marketing\SubscriberController;
use App\Http\Controllers\Backend\NotificationLogController;
use App\Http\Controllers\Backend\NotificationTemplate\NotificationTemplateController;
use App\Http\Controllers\Backend\OtpCodeController;
use App\Http\Controllers\Backend\PermissionController;
use App\Http\Controllers\Backend\Profile\ProfileController;
use App\Http\Controllers\Backend\Profile\TwoFactorController;
use App\Http\Controllers\Backend\RoleController;
use App\Http\Controllers\Backend\Settings\AutomationController;
use App\Http\Controllers\Backend\Settings\BackupController;
use App\Http\Controllers\Backend\Settings\CacheController;
use App\Http\Controllers\Backend\Settings\MailConfigurationController;
use App\Http\Controllers\Backend\Settings\SettingsController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;

// Group routes with sanitization and user session middleware
Route::middleware(['sanitization', 'throttle:60,1'])->group(function (): void {
    // GUEST USER ROUTE

    require __DIR__.'/auth.php';

    Route::get('/', fn (): RedirectResponse => redirect(route('backend.login')));

    /**
     * ======================================
     * AUTHENTICATED BACKEND ROUTES
     * ======================================
     */
    Route::group([
        'middleware' => ['auth:web'],
    ], function () {
        /**
         * ======================================
         * AUTH ONBOARDING USERS ROUTES
         * ======================================
         */

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::post('/logout', [AuthenticateController::class, 'logout'])->name('logout');

        /**
         * =========================
         * SETTINGS ROUTES
         * =========================
         */
        Route::controller(SettingsController::class)
            ->prefix('settings/')
            ->name('settings.')
            ->group(function () {
                Route::get('index', 'index')->name('index');
                Route::get('appearance', 'appearance')->name('appearance');
                Route::get('seo', 'seo')->name('seo');
                Route::get('logo', 'logo')->name('logo');
                Route::get('storage', 'storage')->name('storage');
                Route::get('security', 'security')->name('security');
                Route::get('system', 'system')->name('system');
                Route::get('currency', 'currency')->name('currency');
                Route::get('support', 'support')->name('support');

                Route::post('store', 'store')->name('store');

                Route::post('toggle-app-debug', 'toggleAppDebug')
                    ->name('toggle.app.debug');
                Route::post('switch-language', 'switchLanguage')
                    ->name('switch.language');
            });

        Route::get('system-information', [SettingsController::class, 'systemInformation'])->name('system.information');

        /**
         * =========================
         * MAIL CONFIGURATION ROUTES
         * =========================
         */
        Route::controller(MailConfigurationController::class)
            ->prefix('mail-configurations')
            ->name('mail.configuration.')
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::post('/store', 'store')->name('store');
                Route::post('/test', 'test')->name('test');
            });

        /**
         * =========================
         * BACKUP ROUTES
         * =========================
         */
        Route::controller(BackupController::class)
            ->prefix('backups')
            ->name('backups.')
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::post('create', 'createBackup')->name('create');
                Route::post('delete/{backupId}', 'deleteBackup')->name('delete');
                Route::post('delete-all', 'deleteAllBackups')->name('delete.all');
                Route::get('download/{backupId}', 'downloadBackup')->name('download');
            });

        /**
         * =========================
         * CACHE ROUTES
         * =========================
         */
        Route::controller(CacheController::class)
            ->prefix('cache')
            ->name('cache.')
            ->group(function () {
                Route::get('/cache', 'index')->name('index');
                Route::post('/cache/clear/{type}', 'clearSpecificCache')->name('clear');
                Route::post('/cache/clear-all', 'clearAllCache')->name('clear-all');
            });

        /**
         * =========================
         * AUTOMATION & CRON ROUTES
         * =========================
         */
        Route::controller(AutomationController::class)
            ->prefix('automation')
            ->name('automation.')
            ->group(function () {
                Route::get('automation', 'index')->name('index');
                Route::post('run/{commandId}', 'runCommand')->name('run');
                Route::post('clear/cache', 'clearCommandCache')->name('clear.cache');
            });

        /**
         * =========================
         * NOTIFICATION TEMPLATE  ROUTES
         * =========================
         */
        Route::controller(NotificationTemplateController::class)
            ->prefix('notification-templates/')
            ->name('notification-templates.')->group(function () {
                Route::get('global', 'globalTemplate')->name('global');
                Route::post('update/global-template', 'globalTemplate')->name('global');
            });

        /**
         * =========================
         * LANGUAGES  ROUTES
         * =========================
         */
        Route::controller(LanguageController::class)
            ->prefix('languages/')
            ->name('languages.')
            ->group(function () {
                Route::post('update-status', 'updateStatus')
                    ->name('update.status');
                Route::get('translation/{code}', 'getTranslation')
                    ->name('translation');
                Route::post('translate', 'translate')
                    ->name('translate');

                Route::post('make-default', 'makeDefault')
                    ->name('make.default');
            });

        /**
         * =========================
         * JOBS  ROUTES
         * =========================
         */
        Route::controller(JobController::class)
            ->prefix('jobs')
            ->name('jobs.')
            ->group(function () {
                Route::post('bulk/action', 'bulkAction')->name('bulk.action');
                Route::post('{job}/retry', 'retry')->name('retry');
                Route::get('{job}/run', 'run')->name('run');
            });

        /**
         * =========================
         * FAILED JOBS  ROUTES
         * =========================
         */
        Route::controller(FailedJobController::class)
            ->prefix('failed-jobs')
            ->name('failed-jobs.')
            ->group(function () {
                Route::post('bulk/action', 'bulkAction')->name('bulk.action');
                Route::get('{failedJob}/retry', 'retry')->name('retry');
                Route::post('retry-all', 'retryAll')->name('retry-all');
                Route::delete('clear-all', 'clearAll')->name('clear-all');
            });

        /**
         * =========================
         * CMS PAGE BUILDER ROUTES
         * =========================
         */
        Route::controller(PageController::class)
            ->prefix('pages')
            ->name('pages.')
            ->group(function () {
                Route::get('tree', 'tree')->name('tree');
                Route::post('update-status', 'updateStatus')->name('update.status');
                Route::post('{page}/publish', 'publish')->name('publish');
                Route::post('{page}/make-homepage', 'makeHomepage')->name('make.homepage');

                Route::post('{page}/restore', 'restore')->name('restore')->withTrashed();
                Route::delete('{page}/force', 'forceDestroy')->name('force.destroy')->withTrashed();

                // Create a locale variant sharing this page's translation
                // group. Sections are not copied — they are locale-neutral
                // structure translated through the overlay (§8.2).
                Route::post('{page}/translations', 'storeTranslation')->name('translations.store');
            });

        // Sections are always addressed through their owning page.
        Route::get('pages/{page}/sections', [PageSectionController::class, 'index'])
            ->name('pages.sections');

        Route::controller(PageSectionController::class)
            ->prefix('page-sections')
            ->name('page-sections.')
            ->group(function () {
                Route::post('reorder', 'reorder')->name('reorder');
                Route::post('update-status', 'updateStatus')->name('update.status');

                // Content editing is a screen of its own, not a drawer — see
                // PageSectionController::edit(). Declared here rather than on
                // the write-only resource below because that one deliberately
                // exposes no index/create/show, and this is the one exception.
                Route::get('{page_section}/edit', 'edit')->name('edit');

                // Deep copy: the section, its whole repeater tree, and its
                // media attachments. Lands as a draft immediately after the
                // source.
                Route::post('{page_section}/duplicate', 'duplicate')->name('duplicate');
            });

        Route::controller(SectionBlockController::class)
            ->prefix('section-blocks')
            ->name('section-blocks.')
            ->group(function () {
                Route::post('reorder', 'reorder')->name('reorder');
            });

        /**
         * =========================
         * CMS TRANSLATION OVERLAY ROUTES
         * =========================
         *
         * The non-routable overlay (schema doc §8.2): one locale's translated
         * strings for a section, repeater item, menu item, CTA, media row or
         * global block. Routable pages are translated by row-per-locale
         * through the page builder, not here.
         */
        Route::controller(ContentTranslationController::class)
            ->prefix('cms/translations')
            ->name('cms.translations.')
            ->group(function () {
                Route::put('sections/{page_section}', 'section')->name('section');
                Route::put('blocks/{section_block}', 'block')->name('block');
                Route::put('menu-items/{menu_item}', 'menuItem')->name('menu-item');
                Route::put('ctas/{cta}', 'cta')->name('cta');
                Route::put('media/{media}', 'media')->name('media');
                Route::put('global-blocks/{block}', 'globalBlock')->name('global-block');
            });

        /**
         * =========================
         * CMS MENU BUILDER ROUTES
         * =========================
         */
        Route::get('menus/{menu}/items', [MenuItemController::class, 'index'])
            ->name('menus.items');

        // One request persists both the reparent and the new sibling order.
        Route::post('menu-items/{menu_item}/move', [MenuItemController::class, 'move'])
            ->name('menu-items.move');

        /**
         * =========================
         * CMS MEDIA LIBRARY ROUTES
         * =========================
         */
        Route::controller(MediaController::class)
            ->prefix('media')
            ->name('media.')
            ->group(function () {
                Route::post('move', 'move')->name('move');

                // Attachment pivot, not the asset: attaching links an existing
                // library row to an owner's slot, detaching unlinks it, and
                // neither creates or deletes a `media` row.
                Route::post('attach', 'attach')->name('attach');
                Route::post('detach', 'detach')->name('detach');
                Route::post('attachments/reorder', 'reorderAttachments')->name('attachments.reorder');

                Route::get('{media}/usage', 'usage')->name('usage');

                Route::post('{media}/restore', 'restore')->name('restore')->withTrashed();
                Route::delete('{media}/force', 'forceDestroy')->name('force.destroy')->withTrashed();
            });

        /**
         * =========================
         * CMS TRASH ROUTES
         * =========================
         * Restore and permanent delete for the soft-deleting CMS resources that
         * have no controller group of their own. `pages` and `media` carry the
         * same pair inside their own groups above.
         *
         * `->withTrashed()` is not optional on any of these. Implicit
         * route-model binding filters soft-deleted models out of the query, so
         * without it every one of these routes 404s on precisely the rows it
         * exists to act on — the trash view's buttons would all fail.
         *
         * The parameter names are not interchangeable either: implicit binding
         * matches a route parameter to the controller method's argument NAME,
         * so `{block}` binds `Block $block` and a generic `{model}` would bind
         * nothing at all.
         */
        Route::controller(BlockController::class)
            ->prefix('blocks')
            ->name('blocks.')
            ->group(function () {
                Route::post('{block}/restore', 'restore')->name('restore')->withTrashed();
                Route::delete('{block}/force', 'forceDestroy')->name('force.destroy')->withTrashed();
            });

        Route::controller(CtaController::class)
            ->prefix('ctas')
            ->name('ctas.')
            ->group(function () {
                Route::post('{cta}/restore', 'restore')->name('restore')->withTrashed();
                Route::delete('{cta}/force', 'forceDestroy')->name('force.destroy')->withTrashed();
            });

        Route::controller(RedirectController::class)
            ->prefix('redirects')
            ->name('redirects.')
            ->group(function () {
                Route::post('{redirect}/restore', 'restore')->name('restore')->withTrashed();
                Route::delete('{redirect}/force', 'forceDestroy')->name('force.destroy')->withTrashed();
            });

        Route::controller(MenuController::class)
            ->prefix('menus')
            ->name('menus.')
            ->group(function () {
                Route::post('{menu}/restore', 'restore')->name('restore')->withTrashed();
                Route::delete('{menu}/force', 'forceDestroy')->name('force.destroy')->withTrashed();
            });

        // `{media_folder}` — the snake_case form the resource routes already
        // use, which is what ImplicitRouteBinding matches `$mediaFolder`
        // against.
        Route::controller(MediaFolderController::class)
            ->prefix('media-folders')
            ->name('media-folders.')
            ->group(function () {
                Route::post('{media_folder}/restore', 'restore')->name('restore')->withTrashed();
                Route::delete('{media_folder}/force', 'forceDestroy')->name('force.destroy')->withTrashed();
            });

        /**
         * =========================
         * CMS SEO ROUTES
         * =========================
         */
        Route::controller(SeoMetaController::class)
            ->prefix('seo-meta')
            ->name('seo-meta.')
            ->group(function () {
                Route::get('/', 'show')->name('show');
                Route::post('/', 'store')->name('store');
            });

        /**
         * =========================
         * RESOURCE ROUTES
         * =========================
         */
        Route::resources(
            [
                'admin-users' => AdminUserController::class,
                'otp-codes' => OtpCodeController::class,
                'roles' => RoleController::class,
                'profile' => ProfileController::class,
                'notification-templates' => NotificationTemplateController::class,
                'notification-logs' => NotificationLogController::class,
                'languages' => LanguageController::class,
                'jobs' => JobController::class,
                'failed-jobs' => FailedJobController::class,
                'permissions' => PermissionController::class,

                // CMS spine.
                'pages' => PageController::class,
                'blocks' => BlockController::class,
                'ctas' => CtaController::class,
                'redirects' => RedirectController::class,
                'menus' => MenuController::class,
                'media-folders' => MediaFolderController::class,
            ],
        );

        /**
         * =========================
         * CMS WRITE-ONLY RESOURCES
         * =========================
         * Sections, repeater items and menu items are edited inside their
         * parent's screen, so they expose no index/create/edit/show of their own.
         */
        Route::resource('page-sections', PageSectionController::class)
            ->only(['store', 'update', 'destroy']);

        Route::resource('section-blocks', SectionBlockController::class)
            ->only(['store', 'update', 'destroy']);

        Route::resource('menu-items', MenuItemController::class)
            ->only(['store', 'update', 'destroy']);

        // `media` is its own plural — Laravel's singulariser would name the route
        // parameter {medium}, which matches neither the controller signatures nor
        // the {media} that authorizeResource() derives from the model, so the
        // can: middleware would resolve against a binding that does not exist.
        Route::resource('media', MediaController::class)
            ->parameters(['media' => 'media'])
            ->only(['index', 'store', 'update', 'destroy']);

        /**
         * =========================
         * NOTIFICATION LOG ROUTES
         * =========================
         */
        Route::controller(NotificationLogController::class)
            ->prefix('notification-logs')
            ->name('notification-logs.')
            ->group(function () {
                Route::post('bulk/action', 'bulkAction')->name('bulk.action');
            });

        /**
         * =========================
         * MARKETING ROUTES
         * =========================
         * Contact enquiries and newsletter subscribers. Neither is created or
         * fully edited in the admin — an enquiry comes from the public form,
         * a subscriber from the signup form — so both expose index, a scoped
         * update (triage status / soft-disable) and destroy only.
         */
        Route::resource('contact-submissions', ContactSubmissionController::class)
            ->only(['index', 'update', 'destroy']);

        Route::controller(ContactSubmissionController::class)
            ->prefix('contact-submissions')
            ->name('contact-submissions.')
            ->group(function () {
                Route::post('bulk/action', 'bulkAction')->name('bulk.action');
            });

        Route::resource('subscribers', SubscriberController::class)
            ->only(['index', 'update', 'destroy']);

        Route::controller(SubscriberController::class)
            ->prefix('subscribers')
            ->name('subscribers.')
            ->group(function () {
                Route::post('bulk/action', 'bulkAction')->name('bulk.action');
            });

        /*
         * Campaign sends. A dedicated screen — a marketing blast is a
         * deliberate act with an audience, a template and a preview, not a
         * table row operation. Permission is checked per audience in the
         * controller (contact-submission.reply / subscriber.mail).
         */
        Route::controller(BulkMailController::class)
            ->prefix('marketing/bulk-mail')
            ->name('marketing.bulk-mail.')
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::post('preview', 'preview')->name('preview');
                Route::post('send', 'send')->name('send');
            });

        /**
         * =========================
         * USER & ROLES MANAGEMENT ROUTES
         * =========================
         */
        Route::controller(RoleController::class)
            ->prefix('roles')
            ->name('roles.')
            ->group(function () {
                Route::get('/clone/{id}', 'clone')->name('clone');
            });

        Route::controller(AdminUserController::class)
            ->prefix('admin-users')
            ->name('admin-users.')
            ->group(function () {
                Route::post('update-status', 'updateStatus')->name('update.status');
                Route::post('2fa/update', 'update2FA')->name('2fa.update');
            });

        /**
         * =========================
         * PROFILE ROUTES
         * =========================
         */
        Route::controller(ProfileController::class)->name('profile.')->group(function () {
            Route::get('password', 'password')
                ->name('password.index');

            Route::post('password/update', 'passwordUpdate')
                ->name('password.update');

            Route::get('browser/session', 'getBrowserSession')
                ->name('browser.session');

            Route::post('verify-email-otp', 'verifyEmailOtp')
                ->name('verify-email-otp');

            Route::post('/resend-otp', 'resendOtp')
                ->name('resend-otp');
        });

        /**
         * =========================
         * TWO-FACTOR AUTHENTICATION ROUTES
         * =========================
         */
        Route::controller(TwoFactorController::class)
            ->prefix('2fa/')
            ->name('2fa.')
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::post('verify', 'verify')->name('verify');
                Route::post('disable', 'disable')->name('disable');
                Route::post('recovery-code/regenerate', 'regenerateRecoveryCodes')->name('regenerate.code');
            });

        /**
         * =========================
         * PROFILE ROUTES
         * =========================
         */
        Route::controller(ProfileController::class)->name('profile.')->group(function () {
            Route::get('password', 'password')->name('password.index');
            Route::post('password/update', 'passwordUpdate')->name('password.update');
            Route::get('browser/session', 'getBrowserSession')->name('browser.session');
        });
    });
});
