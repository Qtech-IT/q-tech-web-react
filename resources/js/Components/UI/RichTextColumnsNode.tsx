import { $createParagraphNode, $isElementNode, ElementNode } from 'lexical';
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
} from 'lexical';

/** 2, 3 or 4. Anything wider than four is unreadable at a prose measure. */
const MIN_COLUMNS = 2;
const MAX_COLUMNS = 4;

export type SerializedColumnsNode = Spread<
  { count: number },
  SerializedElementNode
>;

/**
 * Class fragments that mean "this element is a row of columns".
 *
 * Bootstrap (`row`), Foundation (`columns`), Tailwind (`grid-cols-*`,
 * `flex-row`) and the hand-rolled `.columns`/`.two-col` conventions between
 * them cover essentially every marketing page an editor is likely to copy
 * from. Matched on the class STRING rather than a parsed list because the
 * source markup is arbitrary and often carries utility soup.
 */
const ROW_PATTERNS = [
  /\brow\b/i,
  /\bcolumns\b/i,
  /\bgrid-cols-\d/i,
  /\bflex-row\b/i,
  /\b(two|three|four)-col/i,
];

/** The same, for a single cell within a row. */
const COLUMN_PATTERNS = [
  // `col`, `col-6`, `col-md-6`, `col-lg-4`.
  /\bcol(-\w+)*\b/i,
  /\bcolumn\b/i,
  /\bcell\b/i,
  /\bspan-\d/i,
];

function matchesAny(value: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(value));
}

/**
 * Does this element lay its children out side by side?
 *
 * Inline `display` is checked as well as the class, because an emailed or
 * exported design routinely carries its layout inline and no classes at all.
 */
function looksLikeRow(element: HTMLElement): boolean {
  if (element.hasAttribute('data-cols')) {
    return true;
  }

  const display = element.style.display;

  if (display === 'flex' || display === 'grid' || display === 'inline-flex') {
    return true;
  }

  return matchesAny(element.className || '', ROW_PATTERNS);
}

function looksLikeColumn(element: HTMLElement): boolean {
  return (
    element.hasAttribute('data-col') ||
    matchesAny(element.className || '', COLUMN_PATTERNS)
  );
}

/**
 * Wrap loose inline content in paragraphs.
 *
 * A column's children are converted independently, and a cell written as
 * `<div class="col-6">Some text</div>` yields bare text nodes. Appended
 * directly to an element node they render, but they cannot be selected as a
 * block, so the caret behaves strangely and a later export produces invalid
 * markup. Grouping runs of inline nodes into paragraphs is what makes a pasted
 * cell behave like anything else an editor typed.
 */
function wrapInlineChildren(children: LexicalNode[]): LexicalNode[] {
  const wrapped: LexicalNode[] = [];
  let run: LexicalNode[] = [];

  const flush = (): void => {
    if (run.length === 0) {
      return;
    }

    const paragraph = $createParagraphNode();

    paragraph.append(...run);
    wrapped.push(paragraph);
    run = [];
  };

  for (const child of children) {
    if ($isElementNode(child)) {
      flush();
      wrapped.push(child);

      continue;
    }

    run.push(child);
  }

  flush();

  return wrapped;
}

/**
 * A row of columns inside the rich text editor.
 *
 * WHY THIS EXISTS
 * ---------------
 * Pasting a two-column design produced two stacked blocks. Lexical's node set
 * had nothing that holds siblings side by side, so `$generateNodesFromDOM`
 * unwrapped the row and emitted its cells one after another — the content
 * survived, the layout did not.
 *
 * WHAT IT DOES NOT DO. It does not reproduce the source site's design. The
 * copied CSS lives on that site; its class names mean nothing here, and
 * carrying its inline styles across would put arbitrary type scales and
 * colours inside a design system built to prevent exactly that. What survives
 * is the STRUCTURE — "these two blocks sit beside each other" — rendered in
 * this site's own grid, and that is the most a CMS can honestly promise.
 *
 * The layout is expressed as `data-cols`, not as classes, because the public
 * sanitiser strips `class` and `style` from stored HTML. A data attribute is
 * a fact about the content that `RichText` can style; a class would be a
 * request for styling that may not exist.
 */
export class ColumnsNode extends ElementNode {
  __count: number;

  static getType(): string {
    return 'cms-columns';
  }

  static clone(node: ColumnsNode): ColumnsNode {
    return new ColumnsNode(node.__count, node.__key);
  }

  constructor(count = 2, key?: NodeKey) {
    super(key);
    this.__count = Math.min(MAX_COLUMNS, Math.max(MIN_COLUMNS, count));
  }

  getCount(): number {
    return this.__count;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('div');

    element.className = config.theme.columns ?? '';
    // Inline in the EDITOR only — `exportDOM` below writes `data-cols` and no
    // styling at all, so nothing inline reaches the database.
    element.style.display = 'grid';
    element.style.gap = '0.75rem';
    element.style.gridTemplateColumns = `repeat(${this.__count}, minmax(0, 1fr))`;

    return element;
  }

  updateDOM(previous: ColumnsNode, dom: HTMLElement): boolean {
    if (previous.__count === this.__count) {
      return false;
    }

    dom.style.gridTemplateColumns = `repeat(${this.__count}, minmax(0, 1fr))`;

    return false;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');

    element.setAttribute('data-cols', String(this.__count));

    return { element };
  }

  /**
   * Claims `div` for BOTH the row and the cell.
   *
   * One conversion function rather than two nodes each registering `div`:
   * Lexical picks a single conversion per tag by priority and calls it, so two
   * competing registrations would mean the loser never runs. Deciding here
   * keeps the row and its cells consistent by construction.
   */
  static importDOM(): DOMConversionMap | null {
    return {
      div: (element: HTMLElement) => {
        if (looksLikeRow(element)) {
          const cells = Array.from(element.children).filter(
            (child): child is HTMLElement => child instanceof HTMLElement
          );

          // One child is not a layout, it is a wrapper. Falling through lets
          // Lexical unwrap it as it always has.
          if (cells.length < MIN_COLUMNS) {
            return null;
          }

          /*
           * Tag the cells before Lexical walks into them.
           *
           * The alternative is guessing from each cell's own classes, which
           * fails on hand-written markup whose columns carry no class at all.
           * The DOM here is a detached `DOMParser` document built from the
           * pasted string, so marking it up is free and invisible.
           */
          for (const cell of cells) {
            cell.setAttribute('data-col', '');
          }

          return {
            conversion: (): DOMConversionOutput => ({
              node: new ColumnsNode(cells.length),
            }),
            // Above the default `div` handling, which unwraps.
            priority: 1,
          };
        }

        if (looksLikeColumn(element)) {
          return {
            conversion: (): DOMConversionOutput => ({
              node: new ColumnNode(),
              after: wrapInlineChildren,
            }),
            priority: 1,
          };
        }

        return null;
      },
    };
  }

  static importJSON(serialized: SerializedColumnsNode): ColumnsNode {
    return new ColumnsNode(serialized.count);
  }

  exportJSON(): SerializedColumnsNode {
    return {
      ...super.exportJSON(),
      type: 'cms-columns',
      version: 1,
      count: this.__count,
    };
  }

  /** A row holds columns, never text. */
  canBeEmpty(): false {
    return false;
  }

  isInline(): false {
    return false;
  }
}

/**
 * One cell of a `ColumnsNode`.
 *
 * It registers no `importDOM` of its own — see `ColumnsNode.importDOM()` for
 * why both live there.
 */
export class ColumnNode extends ElementNode {
  static getType(): string {
    return 'cms-column';
  }

  static clone(node: ColumnNode): ColumnNode {
    return new ColumnNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('div');

    element.className = config.theme.column ?? '';

    return element;
  }

  updateDOM(): false {
    return false;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');

    element.setAttribute('data-col', '');

    return { element };
  }

  static importJSON(): ColumnNode {
    return new ColumnNode();
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: 'cms-column',
      version: 1,
    };
  }

  /** An empty cell is legitimate — a two-column row with one side written. */
  canBeEmpty(): true {
    return true;
  }

  isInline(): false {
    return false;
  }
}

/** A row of `count` columns, each seeded with an empty paragraph to type into. */
export function $createColumnsNode(count = 2): ColumnsNode {
  const row = new ColumnsNode(count);

  for (let index = 0; index < row.getCount(); index += 1) {
    const column = new ColumnNode();

    // Without a paragraph there is nowhere for the caret to land, and the cell
    // reads as broken rather than empty.
    column.append($createParagraphNode());
    row.append(column);
  }

  return row;
}

export function $isColumnsNode(node: LexicalNode | null | undefined): node is ColumnsNode {
  return node instanceof ColumnsNode;
}

export function $isColumnNode(node: LexicalNode | null | undefined): node is ColumnNode {
  return node instanceof ColumnNode;
}
