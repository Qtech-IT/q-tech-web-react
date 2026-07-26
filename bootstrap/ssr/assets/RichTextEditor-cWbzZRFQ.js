import { jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useEffect, useImperativeHandle } from "react";
import ReactQuill from "react-quill-new";
const toolbarOptions = [
  [{ "header": [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ "color": [] }, { "background": [] }],
  [{ "font": [] }],
  [{ "align": [] }],
  [{ "list": "ordered" }, { "list": "bullet" }],
  [{ "indent": "-1" }, { "indent": "+1" }],
  ["blockquote", "code-block"],
  ["link", "image", "video"],
  ["clean"]
  // remove formatting button
];
const minimalToolbar = [
  ["bold", "italic", "underline"],
  [{ "list": "ordered" }, { "list": "bullet" }],
  ["link"],
  ["clean"]
];
const basicToolbar = [
  [{ "header": [1, 2, 3, false] }],
  ["bold", "italic", "underline"],
  [{ "color": [] }],
  [{ "list": "ordered" }, { "list": "bullet" }],
  ["link"],
  ["clean"]
];
const RichTextEditor = forwardRef(({
  value = "",
  onChange,
  onBlur,
  onFocus,
  placeholder = "Enter your content...",
  readOnly = false,
  theme = "snow",
  // 'snow' or 'bubble'
  toolbar = "full",
  // 'full', 'basic', 'minimal', or custom array
  height = "200px",
  className = "",
  formats,
  modules: customModules,
  bounds,
  debug = false,
  preserveWhitespace = false,
  scrollingContainer,
  tabIndex,
  darkMode = false,
  // New prop for dark mode
  ...props
}, ref) => {
  const quillRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      const isDarkMode = darkMode || typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDarkMode) {
        containerRef.current.classList.add("dark-mode");
      } else {
        containerRef.current.classList.remove("dark-mode");
      }
    }
  }, [darkMode]);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        if (containerRef.current && darkMode === void 0) {
          if (e.matches) {
            containerRef.current.classList.add("dark-mode");
          } else {
            containerRef.current.classList.remove("dark-mode");
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
    setEditorContents: (contents) => quillRef.current?.setEditorContents(contents),
    setEditorSelection: (selection) => quillRef.current?.setEditorSelection(selection),
    focus: () => quillRef.current?.focus(),
    blur: () => quillRef.current?.blur(),
    insertText: (index, text, formats2 = {}) => {
      const editor = quillRef.current?.getEditor();
      if (editor) {
        editor.insertText(index, text, formats2);
      }
    },
    insertEmbed: (index, type, value2) => {
      const editor = quillRef.current?.getEditor();
      if (editor) {
        editor.insertEmbed(index, type, value2);
      }
    },
    getText: (index, length) => {
      const editor = quillRef.current?.getEditor();
      return editor ? editor.getText(index, length) : "";
    },
    getContents: (index, length) => {
      const editor = quillRef.current?.getEditor();
      return editor ? editor.getContents(index, length) : null;
    },
    setContents: (delta) => {
      const editor = quillRef.current?.getEditor();
      if (editor) {
        editor.setContents(delta);
      }
    },
    updateContents: (delta) => {
      const editor = quillRef.current?.getEditor();
      if (editor) {
        editor.updateContents(delta);
      }
    }
  }));
  const getToolbarConfig = () => {
    if (Array.isArray(toolbar)) {
      return toolbar;
    }
    switch (toolbar) {
      case "minimal":
        return minimalToolbar;
      case "basic":
        return basicToolbar;
      case "full":
      default:
        return toolbarOptions;
    }
  };
  const defaultModules = {
    toolbar: getToolbarConfig(),
    clipboard: {
      matchVisual: false
    },
    history: {
      delay: 2e3,
      maxStack: 500,
      userOnly: true
    }
  };
  const modules = customModules ? { ...defaultModules, ...customModules } : defaultModules;
  const defaultFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
    "code-block"
  ];
  const editorFormats = formats || defaultFormats;
  const getEditorStyles = () => {
    const isDarkMode = darkMode || typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return {
      height,
      border: `1px solid ${isDarkMode ? "#374151" : "#d1d5db"}`,
      borderRadius: "6px",
      overflow: "hidden",
      backgroundColor: isDarkMode ? "#1f2937" : "#ffffff"
    };
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      className: `rich-text-editor ${className}`,
      style: { height },
      children: /* @__PURE__ */ jsx(
        ReactQuill,
        {
          ref: quillRef,
          theme,
          value,
          onChange,
          onBlur,
          onFocus,
          readOnly,
          placeholder,
          modules,
          formats: editorFormats,
          bounds,
          debug,
          preserveWhitespace,
          scrollingContainer,
          tabIndex,
          style: getEditorStyles(),
          ...props
        }
      )
    }
  );
});
RichTextEditor.displayName = "RichTextEditor";
export {
  RichTextEditor as R
};
