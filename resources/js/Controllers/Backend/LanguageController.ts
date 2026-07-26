import { SubmitFunction } from '@/Types';
import React from 'react';

/* -------------------- Types -------------------- */

export interface Language {
  id: number;
  name: string;
  code: string;
  direction: 'ltr' | 'rtl';
  status: 'active' | 'inactive';
  is_default: boolean;
  [key: string]: any;
}

export interface PaginatedLanguages {
  data: Language[];
}


type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

/* -------------------- Filters -------------------- */

export const setLanguageFilterData = (
  languages: PaginatedLanguages,
  searchTerm: string,
  activeFilters: Record<string, any>,
  setFilteredLanguages: any
): void => {
  let filtered: Language[] = languages?.data || [];

  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(language =>
      language.name.toLowerCase().includes(searchLower) ||
      language.code.toLowerCase().includes(searchLower) ||
      language.direction.toLowerCase().includes(searchLower)
    );
  }

  if (activeFilters.status) {
    filtered = filtered.filter(
      language => language.status === activeFilters.status
    );
  }

  if (activeFilters.direction) {
    filtered = filtered.filter(
      language => language.direction === activeFilters.direction
    );
  }

  if (activeFilters.isDefault !== undefined) {
    filtered = filtered.filter(
      language => language.is_default === activeFilters.isDefault
    );
  }

  setFilteredLanguages(filtered);
};

/* -------------------- Actions -------------------- */

export const handleSetDefaultLanguage = async (
  language: Language,
  submit: SubmitFunction,
  routePrefix : any
): Promise<void> => {
  try {
    await submit({
      method: 'POST',
      url: route(`${routePrefix}.make.default`),
      data: { id: language.id },
      preserveScroll: true,
    });
  } catch {}
};

export const handleLanguageStautsUpdate = async (
  language: Language,
  newStatus: string,
  submit: SubmitFunction,
  routePrefix:string
): Promise<void> => {
  try {
    await submit({
      method: 'POST',
      url:route(`${routePrefix}.update.status`),
      data: { id: language.id, value: newStatus },
      preserveScroll: true,
    });
  } catch(error) {
    
  }
};

export const handleTransaltionSave = async (
  submit: SubmitFunction,
  data: Record<string, string>,
  languageCode: string,
  routePrefix : string
): Promise<void> => {
  try {
    await submit({
      method: 'POST',
      url: route(`${routePrefix}.translate`),
      data: { code: languageCode, key_values: data },
    });
  } catch {}
};

export const handleSaveLanguage = async (
  data: Record<string, any>,
  submit: SubmitFunction,
  handleClose: () => void,
  routePrefix : string

): Promise<void> => {
  try {
    await submit({
      method: 'POST',
      url: route(`${routePrefix}.store`),
      data,
    });

    handleClose();
  } catch {}
};

export const handleDeleteLanguage = async (
  languageId: any,
  submit: SubmitFunction,
  handleClose: () => void,
  routePrefix : string
): Promise<void> => {

  try {
    await submit({
      method: 'POST',
      url: route(`${routePrefix}.destroy`, languageId) + '?_method=DELETE',
      preserveScroll: true,
    });

    handleClose();
    
  }catch(error){
    
  }
};


/* -------------------- Delete Dialog Config -------------------- */

export const getDeleteDialogConfig = (
  languages: PaginatedLanguages,
  selectedLanguage: any
) => {
  return {
    title: 'Delete Language',
    description:
      'Are you sure you want to delete this language? This action cannot be undone and will affect localization.',
    itemName: selectedLanguage?.name || 'Language',
    itemType: 'Language',
    warningMessage:
      'Deleting this language will permanently remove all its configuration data and may disrupt localization services.',
    showWarningAlert: true,
    showItemDetails: true
  };
};
