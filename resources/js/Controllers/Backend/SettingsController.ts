import { SubmitFunction } from "@/Types"
import toast from "react-hot-toast"

/**
 *
 * @param {*} submitFn
 */
export const onSettingsUpdate = async (data: any, submitFn: SubmitFunction) => {

    const transformedData: any = transformSettingsBooleanValues(data)


    if (Object.keys(transformedData?.site_settings).length === 0) {
        toast.error('No changes to update')
        return
    }

    try {
        await submitFn({
            method: 'POST',
            url: route('backend.settings.store'),
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: transformedData,
        })
    } catch (error) {
    }
}



/**
 *
 * @param {*} submitFn
 */
export const onLogoUpdate = async (data: any, submitFn: SubmitFunction) => {

    try {
        await submitFn({
            method: 'POST',
            url: route(`backend.settings.store`),
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: data,
        })
    } catch (error) {
    }
}

/**
 * Helper function to transform boolean values to active/inactive strings
 * @param {Object} data - The data object to be processed
 * @returns {Object} - Transformed data object
 */
export const transformSettingsBooleanValues = (data: any) => {
    return Object.keys(data).reduce((acc: any, key) => {
        const value = data[key];

        if (typeof value === 'boolean') {
            acc[key] = value ? 'active' : 'inactive';
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            acc[key] = transformSettingsBooleanValues(value);
        } else {

            if (value !== null && value !== undefined && value !== '') {
                acc[key] = value;
            }

        }

        return acc;
    }, {});
};





/**
 *
 * @param {*} key
 * @param {*} theme
 */
export const onSettingsChange = async (key: string, theme: any, submit: SubmitFunction) => {

    const postData = {
        site_settings: {
            [key]: theme
        }
    }
    onSettingsUpdate(postData, submit)
}



/**
 *
 * @param {*} submitFn
 */
export const toggleDebugMode = async (submitFn: SubmitFunction) => {

    try {
        await submitFn({
            method: 'POST',
            url: route('backend.settings.toggle.app.debug')
        })
    } catch (error) {

    }

}


/******************** cache controll methods  ************************/

export const handleClearCache = async (setLastClearType: any, cacheType: any, submitFn: SubmitFunction, routePrefix: string) => {

    setLastClearType(cacheType);
    try {
        await submitFn({
            method: 'POST',
            url: route(`${routePrefix}.clear`, cacheType)
        })
    } catch (error) {
    } finally {
        setLastClearType(null);
    }
};


/**
 *
 * @param {*} setLastClearType
 */
export const handleClearAllCache = async (setLastClearType: any, submitFn: SubmitFunction, routePrefix: string) => {
    setLastClearType('all');
    try {
        await submitFn({
            method: 'POST',
            url: route(`${routePrefix}.clear-all`)
        })
    } catch (error) {
    } finally {
        setLastClearType(null);
    }
};



/**
 *
 * @param {*} commandId
 */
export const handleRunCommand = async (commandId: any, submitFn: SubmitFunction, routePrefix: string) => {

    try {
        await submitFn({
            method: 'POST',
            url: route(`${routePrefix}.run`, commandId)
        })
    } catch (error) {

    }
};



/**
 *
 * @param {*} submitFn
 */
export const clearAutomationCache = async (submitFn: SubmitFunction, routePrefix: string) => {

    try {
        await submitFn({
            method: 'POST',
            url: route(`${routePrefix}.clear.cache`)
        })
    } catch (error) {


    }
};




/******************* Backup methods ***************/


export const getDeleteBackupDialogContent = (allDelete = false as boolean, backup = {} as any) => {

    if (allDelete) {
        return {
            title: 'Delete All Backups',
            description: 'Are you sure you want to delete ALL backups? This action cannot be undone and will remove all backup files.',
            itemName: 'All Backups',
            itemType: 'Database Backups',
            warningMessage: 'This will permanently delete all backup files from your server. Make sure you have alternative backups if needed.',
            showWarningAlert: true,
            showItemDetails: true,
            itemDisplayFields: [
                {
                    label: 'Total Backups',
                    key: 'total_backups',
                    render: () => backup?.total_backups || 0
                },
                {
                    label: 'Total Size',
                    key: 'total_size',
                    render: () => backup?.total_size || '0 B'
                }
            ],
            specialWarnings: [
                {
                    condition: () => (backup?.total_backups || 0) > 0,
                    title: 'Permanent Deletion',
                    message: 'All backup files will be permanently deleted. This action cannot be reversed.',
                    alertClass: 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800',
                    iconClass: 'text-red-600 dark:text-red-400',
                    textClass: 'text-red-800 dark:text-red-200'
                }
            ]
        }
    }

    return {
        title: 'Delete Backup',
        description: 'Are you sure you want to delete this backup? This action cannot be undone.',
        itemName: backup?.filename || 'Backup',
        itemType: 'Database Backup',
        warningMessage: 'Deleting this backup will permanently remove the backup file from your server.',
        showWarningAlert: true,
        showItemDetails: true,
        itemDisplayFields: [
            {
                label: 'Filename',
                key: 'filename',
                className: ' text-sm'
            },
            {
                label: 'Size',
                key: 'size',
                className: 'font-medium'
            },
            {
                label: 'Created',
                key: 'created_at',
                className: 'text-gray-600 dark:text-gray-400'
            }
        ],
        specialWarnings: []
    }
}


/**
 *
 * @param {*} submitFn
 */
export const handleCreateBackup = async (submitFn: SubmitFunction, routePrefix: string) => {

    try {
        await submitFn({
            method: 'POST',
            url: route(`${routePrefix}.create`)
        })
    } catch (error) {

    }
};


/**
 *
 * @param {*} setShowDeleteDialog
 * @param {*} id
 */
export const confirmDeleteBackup = async (id: any, submitFn: SubmitFunction, routePrefix: string) => {

    if (id) {
        try {
            await submitFn({
                method: 'POST',
                url: route(`${routePrefix}.delete`, id),
            })
        } catch (error) {

        }
    }
};


/**
 *
 * @param {*} setShowDeleteAllDialog
 * @param {*} submitFn
 */
export const confirmDeleteAllBackups = async (submitFn: SubmitFunction, routePrefix: string) => {
    try {
        await submitFn({
            method: 'POST',
            url: route(`${routePrefix}.delete.all`),
        })
    } catch (error) {

    }
};
