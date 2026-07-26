import toast from "react-hot-toast";

/**
 * Insert a template key at the current cursor in the editor
 * @param editorRef any
 * @param key any
 */
export const insertKeyAtCursor = (editorRef: any, key: any) => {
  if (editorRef?.current) {
    const editor = editorRef.current.getEditor?.();
    if (editor) {
      const selection = editor.getSelection?.();
      const index = selection ? selection.index : 0;

      editor.insertText?.(index, `{{${key}}}`, {
        background: '#dbeafe',
        color: '#1e40af',
      });

      editor.setSelection?.(index + `{{${key}}}`.length);
      editor.focus?.();
    }
  }

  toast.success(`Template key {{${key}}} inserted at cursor position`);
};

/**
 * Get sample value for a template key
 * @param key any
 * @returns any
 */
export const getSampleValue = (key: any): any => {
  const samples: any = {
    otp_code: '123456',
    time: '2024-01-15 10:30 AM',
    operating_system: 'Windows 11',
    ip: '192.168.1.100',
  };
  return samples[key] || `[${key}]`;
};

/**
 * Generate HTML preview replacing template keys with sample values
 * @param text any
 * @param templateKeys any
 * @returns string
 */
export const generatePreview = (text: any, templateKeys: any): string => {
  if (!text) return '';

  let preview = text;
  Object.entries(templateKeys).forEach(([key, _description]: any) => {
    const placeholder = `{{${key}}}`;
    const sampleValue = getSampleValue(key);
    preview = preview.replaceAll(
      placeholder,
      `<span class="bg-blue-100 text-blue-800 px-1 rounded font-medium">${sampleValue}</span>`
    );
  });

  return preview;
};

/**
 * Submit template update
 * @param data any
 * @param template any
 * @param submit any
 */
export const onTemplateUpdate = async (data: any, template: any, submit: any, routePrefix: any) => {

  try {
    await submit({
      method: 'POST',
      url: route(`${routePrefix}.update`, template?.id) + '?_method=PATCH',
      data: data,
    });
  } catch (error) {
  }
};
