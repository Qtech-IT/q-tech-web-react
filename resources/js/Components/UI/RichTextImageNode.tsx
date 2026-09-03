import { DecoratorNode } from 'lexical';
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import type { JSX } from 'react';

export type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
    width: number | null;
    height: number | null;
  },
  SerializedLexicalNode
>;

/**
 * An image inside the rich text editor.
 *
 * WHY THIS HAS TO BE A CUSTOM NODE
 * --------------------------------
 * Lexical ships no image node. Without one registered, `$generateNodesFromDOM`
 * has no conversion for `<img>` and silently DROPS it — which is why pasting a
 * page from another site produced text with every picture missing, and why an
 * article that already had images came back without them.
 *
 * `DecoratorNode` rather than `ElementNode` because an image has no children to
 * edit; it is a leaf the editor renders and the caret moves around.
 *
 * IMPORT AND EXPORT ARE BOTH REQUIRED. `importDOM` is what makes a paste work;
 * `exportDOM` is what makes the saved HTML contain an `<img>` again rather than
 * an empty decorator. A node with only one of the two round-trips to nothing.
 */
export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;

  __altText: string;

  __width: number | null;

  __height: number | null;

  static getType(): string {
    return 'cms-image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key);
  }

  constructor(
    src: string,
    altText: string,
    width: number | null = null,
    height: number | null = null,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
  }

  /**
   * Accepts `<img>` from a paste.
   *
   * Priority 0 is the default; nothing else in the node set claims `img`, so
   * there is no conflict to resolve.
   */
  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: (element: HTMLElement): DOMConversionOutput | null => {
          const img = element as HTMLImageElement;
          const src = img.getAttribute('src') ?? '';

          // A tracking pixel or a spacer GIF is not content. Dropping it here
          // keeps a paste from a marketing email out of the document.
          if (src === '' || (img.width > 0 && img.width < 8) || (img.height > 0 && img.height < 8)) {
            return null;
          }

          return {
            node: new ImageNode(
              src,
              img.getAttribute('alt') ?? '',
              img.width || null,
              img.height || null
            ),
          };
        },
        priority: 0,
      }),
    };
  }

  /** Written back out as a plain `<img>`, which is what the site renders. */
  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');

    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);

    // Dimensions travel with the tag so the public renderer can reserve the
    // box and avoid a layout shift, exactly as `SectionMedia` does.
    if (this.__width) {
      element.setAttribute('width', String(this.__width));
    }

    if (this.__height) {
      element.setAttribute('height', String(this.__height));
    }

    return { element };
  }

  static importJSON(serialized: SerializedImageNode): ImageNode {
    return new ImageNode(
      serialized.src,
      serialized.altText,
      serialized.width ?? null,
      serialized.height ?? null
    );
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      type: 'cms-image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');

    span.className = config.theme.image ?? '';

    return span;
  }

  updateDOM(): false {
    // The decorator below owns the rendering, so Lexical never needs to
    // replace the host element.
    return false;
  }

  decorate(): JSX.Element {
    return (
      <img
        src={this.__src}
        alt={this.__altText}
        // Constrained so a 4000px paste does not blow the editor panel open.
        // The stored HTML keeps the real dimensions.
        className="my-2 h-auto max-w-full rounded border"
        draggable={false}
      />
    );
  }
}

export function $createImageNode(
  src: string,
  altText = '',
  width: number | null = null,
  height: number | null = null
): ImageNode {
  return new ImageNode(src, altText, width, height);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}
