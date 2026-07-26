import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const toolbarOptions = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  ['blockquote', 'code-block'],
  ['link', 'image', 'video'],
  ['clean']
];

const minimalToolbar = [
  ['bold', 'italic', 'underline'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  ['link'],
  ['clean']
];

const basicToolbar = [
  [{ 'header': [1, 2, 3, false] }],
  ['bold', 'italic', 'underline'],
  [{ 'color': [] }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  ['link'],
  ['clean']
];

const RichTextEditor = forwardRef<any, any>(({
  value = '',
  onChange,
  onBlur,
  onFocus,
  placeholder = 'Enter your content...',
  readOnly = false,
  theme = 'snow',
  toolbar = 'full',
  height = '200px',
  className = '',
  formats,
  modules: customModules,
  bounds,
  debug = false,
  preserveWhitespace = false,
  scrollingContainer,
  tabIndex,
  darkMode = false,
  ...props
}, ref) => {
  const quillRef = useRef<any>(null);
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      const isDarkMode = darkMode ||
        (typeof window !== 'undefined' &&
         window.matchMedia &&
         window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDarkMode) {
        containerRef.current.classList.add('dark-mode');
      } else {
        containerRef.current.classList.remove('dark-mode');
      }
    }
  }, [darkMode]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: any) => {
        if (containerRef.current && darkMode === undefined) {
          if (e.matches) {
            containerRef.current.classList.add('dark-mode');
          } else {
            containerRef.current.classList.remove('dark-mode');
          }
        }
      };

      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [darkMode]);

  useImperativeHandle(ref, () => ({
    getEditor: () => quillRef.current?.getEditor(),
    getEditorContents: () => quillRef.current?.getEditorContents(),
    getEditorSelection: () => quillRef.current?.getEditorSelection(),
    setEditorContents: (contents: any) => quillRef.current?.setEditorContents(contents),
    setEditorSelection: (selection: any) => quillRef.current?.setEditorSelection(selection),
    focus: () => quillRef.current?.focus(),
    blur: () => quillRef.current?.blur(),
    insertText: (index: number, text: string, formats = {}) => {
      const editor = quillRef.current?.getEditor();
      if (editor) editor.insertText(index, text, formats);
    },
    insertEmbed: (index: number, type: string, value: any) => {
      const editor = quillRef.current?.getEditor();
      if (editor) editor.insertEmbed(index, type, value);
    },
    getText: (index: number, length: number) => {
      const editor = quillRef.current?.getEditor();
      return editor ? editor.getText(index, length) : '';
    },
    getContents: (index: number, length: number) => {
      const editor = quillRef.current?.getEditor();
      return editor ? editor.getContents(index, length) : null;
    },
    setContents: (delta: any) => quillRef.current?.getEditor()?.setContents(delta),
    updateContents: (delta: any) => quillRef.current?.getEditor()?.updateContents(delta)
  }));

  const getToolbarConfig = () => {
    if (Array.isArray(toolbar)) return toolbar;

    switch (toolbar) {
      case 'minimal': return minimalToolbar;
      case 'basic': return basicToolbar;
      case 'full':
      default: return toolbarOptions;
    }
  };

  const defaultModules = {
    toolbar: getToolbarConfig(),
    clipboard: { matchVisual: false },
    history: { delay: 2000, maxStack: 500, userOnly: true }
  };

  const modules = customModules ? { ...defaultModules, ...customModules } : defaultModules;

  const defaultFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'code-block'
  ];

  const editorFormats = formats || defaultFormats;

  const getEditorStyles = () => {
    const isDarkMode = darkMode ||
      (typeof window !== 'undefined' &&
       window.matchMedia &&
       window.matchMedia('(prefers-color-scheme: dark)').matches);

    return {
      height: height,
      border: `1px solid ${isDarkMode ? '#374151' : '#d1d5db'}`,
      borderRadius: '6px',
      overflow: 'hidden',
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff'
    };
  };

  return (
    <div
      ref={containerRef}
      className={`rich-text-editor ${className}`}
      style={{ height }}
    >
      {/* @ts-ignore */}
      <ReactQuill
        ref={quillRef}
        theme={theme}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        readOnly={readOnly}
        placeholder={placeholder}
        modules={modules}
        formats={editorFormats}
        bounds={bounds}
        preserveWhitespace={preserveWhitespace}
        tabIndex={tabIndex}
        style={getEditorStyles()}
        {...props}
      />
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
