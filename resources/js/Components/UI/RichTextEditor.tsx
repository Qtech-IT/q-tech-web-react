import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { HeadingNode, QuoteNode, $createQuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { LinkNode, AutoLinkNode, TOGGLE_LINK_COMMAND, $isLinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { TableNode, TableRowNode, TableCellNode } from '@lexical/table';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { ImageNode } from '@/Components/UI/RichTextImageNode';
import {
  ColumnNode,
  ColumnsNode,
  $createColumnsNode,
} from '@/Components/UI/RichTextColumnsNode';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode } from '@lexical/rich-text';
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $insertNodes,
  $isElementNode,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  type ElementNode,
  type LexicalEditor,
} from 'lexical';
import {
  Bold,
  Code2,
  Columns2,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from 'lucide-react';

import { Button } from '@/Components/UI/Button';
import { Textarea } from '@/Components/UI/Textarea';
import { useTranslations } from '@/Hooks/useTranslations';
import { cn } from '@/Utils/helpers';

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  /** Rendered in the empty editor. */
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  id?: string | undefined;
  /*
   * Explicitly `| undefined` on every optional prop.
   *
   * `exactOptionalPropertyTypes` is on, which distinguishes "absent" from
   * "present and undefined". The shared field renderer spreads an `aria` object
   * whose members are `string | undefined`, so a bare `?:` here rejects the
   * spread rather than accepting it.
   */
  'aria-describedby'?: string | undefined;
  'aria-invalid'?: boolean | undefined;
  'aria-required'?: boolean | undefined;
}

/**
 * `<p><br></p>` is what Lexical serialises an empty document to.
 *
 * Stored verbatim it makes every "is this field filled in?" check true, so a
 * section with an untouched body renders an empty paragraph instead of being
 * skipped. Normalised to an empty string on the way out.
 */
function normalise(html: string): string {
  const stripped = html.replace(/<p[^>]*>(\s|<br\s*\/?>|&nbsp;)*<\/p>/gi, '').trim();

  return stripped === '' ? '' : html;
}

/**
 * Seeds the editor from the incoming HTML, once per document.
 *
 * The re-seed is keyed on the value ARRIVING FROM OUTSIDE rather than on every
 * render: this component is controlled, so echoing our own `onChange` back in
 * and re-parsing it would rebuild the document on every keystroke and throw the
 * caret to the start. `lastEmitted` is what distinguishes "the parent sent us
 * something new" (switching to another section) from "the parent handed back
 * what we just told it".
 */
function InitialHtmlPlugin({
  value,
  lastEmitted,
  paused,
  suppress,
}: {
  value: string;
  lastEmitted: React.MutableRefObject<string | null>;
  /** True while source mode owns the value. */
  paused: boolean;
  suppress: React.MutableRefObject<boolean>;
}) {
  const [editor] = useLexicalComposerContext();
  const seeded = useRef<string | null>(null);

  useEffect(() => {
    /*
     * Source mode is AUTHORITATIVE while it is open.
     *
     * Without this the two halves fight: a keystroke in the textarea raises a
     * new `value`, this effect re-parses it into the node tree, the change
     * listener serialises that tree back out, and the editor's normalised
     * markup overwrites the markup being typed — mid-word. Anything the node
     * set cannot represent is gone by the second character.
     */
    if (paused) {
      return;
    }

    if (value === lastEmitted.current || value === seeded.current) {
      return;
    }

    seeded.current = value;

    /*
     * Seeding is not an edit.
     *
     * Parsing HTML in and serialising it straight back out is lossy by
     * definition — the node set is narrower than HTML — so letting the seed's
     * own update reach `onChange` would rewrite stored content the moment a
     * section was opened, with nobody having typed anything.
     */
    suppress.current = true;

    editor.update(() => {
      const root = $getRoot();
      root.clear();

      if (!value.trim()) {
        root.append($createParagraphNode());

        return;
      }

      // `DOMParser` rather than `innerHTML` on a detached node: the parser does
      // not execute anything it reads, and the value is editor-authored HTML
      // that has not been through the render-time sanitiser yet.
      const dom = new DOMParser().parseFromString(value, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);

      root.select();
      $insertNodes(nodes);
    }, {
      // Cleared once the update has flushed, so the listener it triggers has
      // already been and gone.
      onUpdate: () => {
        suppress.current = false;
      },
    });
  }, [editor, value, lastEmitted, paused, suppress]);

  return null;
}

/** Toolbar state that has to follow the caret. */
interface ToolbarState {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  link: boolean;
}

function Toolbar({ disabled }: { disabled: boolean }) {
  const { t } = useTranslations();
  const [editor] = useLexicalComposerContext();
  const [state, setState] = useState<ToolbarState>({
    bold: false,
    italic: false,
    strikethrough: false,
    link: false,
  });

  const sync = useCallback(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      return;
    }

    const node = selection.anchor.getNode();
    const parent = node.getParent();

    setState({
      bold: selection.hasFormat('bold'),
      italic: selection.hasFormat('italic'),
      strikethrough: selection.hasFormat('strikethrough'),
      link: $isLinkNode(node) || $isLinkNode(parent),
    });
  }, []);

  useEffect(
    () =>
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          sync();

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
    [editor, sync]
  );

  // The caret also moves on typing and undo, which do not fire a selection
  // command — without this the buttons go stale mid-sentence.
  useEffect(() => editor.registerUpdateListener(({ editorState }) => {
    editorState.read(sync);
  }), [editor, sync]);

  // `ElementNode`, not `ReturnType<typeof $createParagraphNode>` — headings and
  // quotes are element nodes too, and typing this to the paragraph factory
  // rejected both under `exactOptionalPropertyTypes`.
  const block = useCallback(
    (create: () => ElementNode) => {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, create);
        }
      });
    },
    [editor]
  );

  const toggleLink = useCallback(() => {
    if (state.link) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);

      return;
    }

    // `window.prompt` is deliberate. A link dialog inside a section editor that
    // is itself inside a sheet is three stacked focus traps, and every one of
    // them has to return focus correctly or the caret is lost. The native
    // prompt has none of that problem and is fully keyboard accessible.
    const url = window.prompt(t('Link URL'));

    if (url === null) {
      return;
    }

    const trimmed = url.trim();

    if (trimmed === '') {
      return;
    }

    // Anything without a scheme is treated as a site-relative path rather than
    // being guessed at — `example.com` typed into a CMS almost always means the
    // external site, but `about/team` never means a protocol.
    const href = /^(https?:|mailto:|tel:|\/|#)/i.test(trimmed) ? trimmed : `https://${trimmed}`;

    editor.dispatchCommand(TOGGLE_LINK_COMMAND, href);
  }, [editor, state.link, t]);

  /**
   * Insert an empty two-column row at the caret.
   *
   * Paste detection covers content copied from elsewhere, but an editor
   * starting from nothing needs a way to ASK for columns — a layout that can
   * only arrive by accident is not an authoring feature.
   */
  const insertColumns = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        return;
      }

      const row = $createColumnsNode(2);

      $insertNodes([row]);

      // Put the caret in the first cell rather than after the whole row, which
      // is where `$insertNodes` leaves it.
      const first = row.getFirstChild();

      if ($isElementNode(first)) {
        first.selectStart();
      }
    });
  }, [editor]);

  const item = (
    key: string,
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
    active = false
  ) => (
    <Button
      key={key}
      type="button"
      variant="ghost"
      size="sm"
      disabled={disabled}
      aria-pressed={active}
      aria-label={label}
      title={label}
      // `onMouseDown` prevented so clicking a toolbar button does not blur the
      // editor first — a blurred editor has no selection, and the command would
      // apply to nothing.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn('h-8 w-8 p-0', active && 'bg-accent text-accent-foreground')}
    >
      {icon}
    </Button>
  );

  return (
    <div
      role="toolbar"
      aria-label={t('Formatting')}
      className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 p-1"
    >
      {item('bold', t('Bold'), <Bold className="h-4 w-4" />, () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold'), state.bold)}
      {item('italic', t('Italic'), <Italic className="h-4 w-4" />, () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic'), state.italic)}
      {item('strike', t('Strikethrough'), <Strikethrough className="h-4 w-4" />, () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough'), state.strikethrough)}

      <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />

      {/* `h2` and `h3` only. The page section owns the `h1`, and an editor
          given `h1` here produces a page with two of them — which is a real
          accessibility failure rather than a style preference. */}
      {(['h2', 'h3'] as const).map((tag) =>
        item(
          tag,
          t('Heading :level', { level: tag.slice(1) }),
          <span className="text-xs font-semibold">{tag.toUpperCase()}</span>,
          () => block(() => $createHeadingNode(tag))
        )
      )}
      {item('p', t('Paragraph'), <span className="text-xs font-semibold">P</span>, () => block(() => $createParagraphNode()))}

      <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />

      {item('ul', t('Bulleted list'), <List className="h-4 w-4" />, () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined))}
      {item('ol', t('Numbered list'), <ListOrdered className="h-4 w-4" />, () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined))}
      {item('quote', t('Quote'), <Quote className="h-4 w-4" />, () => block(() => $createQuoteNode()))}
      {item('columns', t('Two columns'), <Columns2 className="h-4 w-4" />, insertColumns)}

      <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />

      {item('link', state.link ? t('Remove link') : t('Add link'), state.link ? <Link2Off className="h-4 w-4" /> : <Link2 className="h-4 w-4" />, toggleLink, state.link)}

      <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />

      {item('undo', t('Undo'), <Undo2 className="h-4 w-4" />, () => editor.dispatchCommand(UNDO_COMMAND, undefined))}
      {item('redo', t('Redo'), <Redo2 className="h-4 w-4" />, () => editor.dispatchCommand(REDO_COMMAND, undefined))}
    </div>
  );
}

/**
 * The CMS rich-text editor.
 *
 * WHY LEXICAL AND NOT QUILL. The project ships three editors and CLAUDE.md
 * standardises on Lexical; the other two are scheduled for removal. Lexical is
 * also the only one of the three that round-trips HTML through a real node
 * tree rather than trusting `innerHTML`, which is what makes a paste out of
 * Word land as clean paragraphs instead of forty spans carrying `mso-` styles.
 *
 * PASTE. Handled natively by `RichTextPlugin` — formatted text keeps its bold,
 * italic, headings and lists, and everything the node set below does not
 * recognise is dropped rather than carried through as inline styles.
 *
 * IMAGES. A pasted screenshot arrives as a `data:` URI. It is left alone here
 * and absorbed server-side on save by `RichTextService`, which uploads it to
 * the media library and swaps in a real URL. Doing it there rather than here is
 * deliberate: pasting HTML out of a document brings base64 images in as markup
 * with no file event to hook, so the client cannot be the guarantee — and a
 * guarantee that only works for one of the two paste paths is not one.
 *
 * VALUE CONTRACT. Stores HTML, the same shape the previous textarea stored, so
 * existing content needs no migration and the render-time sanitiser in
 * `RichText.tsx` is unchanged.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
  id,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  'aria-required': required,
}: RichTextEditorProps) {
  const { t } = useTranslations();
  /*
   * `null`, NOT the incoming value.
   *
   * Seeded with `value`, the guard in `InitialHtmlPlugin` — "skip if the value
   * equals what we last emitted" — was true on the very first render, so the
   * editor never loaded existing content and every section opened blank. The
   * sentinel means "we have emitted nothing yet", which is the truth on mount.
   */
  const lastEmitted = useRef<string | null>(null);

  /** True while the node tree is being seeded — see `InitialHtmlPlugin`. */
  const seeding = useRef(false);

  const initialConfig = useMemo(
    () => ({
      namespace: 'cms-rich-text',
      // Class names rather than inline styles, so the output is themed by the
      // stylesheet and a copy of it pasted elsewhere carries no colours.
      theme: {
        paragraph: 'mb-2 last:mb-0',
        heading: { h2: 'mt-4 mb-2 text-lg font-semibold', h3: 'mt-3 mb-1.5 text-base font-semibold' },
        quote: 'border-l-2 border-border pl-3 italic text-muted-foreground',
        list: { ul: 'list-disc pl-5 my-2', ol: 'list-decimal pl-5 my-2', listitem: 'my-0.5' },
        link: 'text-primary underline underline-offset-2',
        image: 'inline-block',
        table: 'my-2 w-full border-collapse text-sm',
        tableCell: 'border px-2 py-1 align-top',
        tableCellHeader: 'border bg-muted px-2 py-1 text-left font-semibold',
        hr: 'my-4 border-t',
        // The row's grid is set inline by `ColumnsNode` because the track
        // count varies; these carry only what is constant.
        columns: 'my-2',
        column: 'min-w-0 rounded border border-dashed border-border/70 p-2',
        text: { bold: 'font-semibold', italic: 'italic', strikethrough: 'line-through', code: 'rounded bg-muted px-1 py-0.5 text-xs' },
      },
      /*
       * Every node the editor can hold — and therefore everything a PASTE can
       * survive. `$generateNodesFromDOM` silently drops any element it has no
       * registered conversion for, which is why pasting a page from another
       * site arrived as bare text: images, tables and rules all had nowhere to
       * go. Adding a node is what makes the corresponding tag round-trip.
       */
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        AutoLinkNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableRowNode,
        TableCellNode,
        HorizontalRuleNode,
        ImageNode,
        ColumnsNode,
        ColumnNode,
      ],
      editable: !disabled,
      onError: (error: Error) => {
        // Thrown into the console rather than swallowed: a node-set mismatch is
        // a developer error, and silently degrading would hide it behind
        // content that simply refuses to format.
        console.error('[RichTextEditor]', error);
      },
    }),
    [disabled]
  );

  /*
   * Source mode.
   *
   * A CMS needs a way to paste an embed, fix a stray tag, or write markup the
   * toolbar has no button for — without it "I cannot put HTML or code here" is
   * simply true. Rendering the raw value in a textarea and handing it straight
   * back is enough: the value is HTML in both modes, so switching is lossless
   * in one direction and re-parsed by `InitialHtmlPlugin` in the other.
   *
   * Kept OUT of the Lexical tree on purpose — a `contenteditable` and a
   * textarea competing for the same value is how a caret ends up jumping.
   */
  const [source, setSource] = useState(false);

  /* Read inside the change listener, which is registered once and would
     otherwise close over the value `source` had on mount. */
  const sourceRef = useRef(source);
  sourceRef.current = source;

  const handleChange = useCallback(
    (_: unknown, editor: LexicalEditor) => {
      if (seeding.current || sourceRef.current) {
        return;
      }

      editor.read(() => {
        const html = normalise($generateHtmlFromNodes(editor, null));

        if (html === lastEmitted.current) {
          return;
        }

        lastEmitted.current = html;
        onChange(html);
      });
    },
    [onChange]
  );

  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border bg-background',
        invalid && 'border-destructive',
        disabled && 'opacity-60'
      )}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <div className="flex items-start justify-between gap-2 border-b bg-muted/40">
          <div className={cn('min-w-0 flex-1', source && 'invisible')}>
            <Toolbar disabled={disabled} />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            aria-pressed={source}
            title={source ? t('Back to the editor') : t('Edit HTML')}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setSource((open) => !open)}
            className={cn('m-1 h-8 shrink-0 gap-1.5 px-2', source && 'bg-accent text-accent-foreground')}
          >
            <Code2 className="h-4 w-4" />
            <span className="text-xs">{t('HTML')}</span>
          </Button>
        </div>

        {source ? (
          <>
            <p className="border-b bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
              {t('Markup here is stored exactly as written. Switching back to the editor reformats it to what the editor can represent.')}
            </p>

            <Textarea
              id={id}
              aria-describedby={describedBy}
              aria-label={t('HTML source')}
              value={value ?? ''}
              disabled={disabled}
              rows={14}
              spellCheck={false}
              className="rounded-none border-0 font-mono text-xs focus-visible:ring-0"
              onChange={(event) => {
                // Cleared so leaving source mode re-seeds the editor from the
                // edited markup rather than treating it as an echo of its own
                // last emission.
                lastEmitted.current = null;
                onChange(event.target.value);
              }}
            />
          </>
        ) : null}

        <div className={cn('relative', source && 'hidden')}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                id={id}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                aria-required={required}
                // `max-h` + scroll rather than growing without limit: this sits
                // inside an already-scrolling editor panel, and a long article
                // would otherwise push the save button off the bottom of it.
                className="max-h-[28rem] min-h-[10rem] overflow-y-auto px-3 py-2 text-sm outline-none [&_a]:cursor-pointer"
              />
            }
            placeholder={
              <div className="pointer-events-none absolute left-3 top-2 select-none text-sm text-muted-foreground">
                {placeholder ?? t('Write here…')}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          <InitialHtmlPlugin
            value={value ?? ''}
            lastEmitted={lastEmitted}
            paused={source}
            suppress={seeding}
          />
          <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <TablePlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}

export default RichTextEditor;
