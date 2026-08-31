import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * Public-site button skin.
 *
 * This is NOT a second Button component. `Components/UI/Button` stays the one
 * implementation (Slot behaviour, `asChild`, disabled handling, icon sizing);
 * this only produces the class string that repaints it in the public identity.
 * It is passed through `Button`'s own `className`, so `cn()`/tailwind-merge
 * resolves it against the admin cva and the losing admin utilities are removed
 * from the output rather than fighting it on specificity.
 *
 * Every declaration below overrides a class that exists in the admin variant,
 * which is why they read as a full set rather than a patch: a partial override
 * would leave `bg-primary` or `rounded-md` behind and the button would end up
 * half admin, half site.
 */
export const fxButton = cva(
  [
    // A rectangle with a small radius, not a pill. A pill reads as a chip or a
    // tag; the site's primary action is a solid block, which is what gives the
    // hero its one hard edge against all the whitespace around it.
    'rounded-fx-xs font-medium tracking-[-0.005em]',
    'transition-[background-color,border-color,box-shadow,transform,color]',
    'duration-200 ease-fx',
    // The admin variant focuses with a 3px ring in the admin ring colour.
    // Neutralised here in favour of one site-wide outline that is never
    // clipped by an `overflow-hidden` ancestor.
    'focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fx-focus',
    // A 1px lift is the whole hover gesture. It must not survive
    // `prefers-reduced-motion`, and it must not shift layout — transform only.
    'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
    // Every admin variant this skin repaints carries its OWN hover ink —
    // `outline` and `ghost` both set `hover:text-accent-foreground`. That is a
    // different modifier from the `text-*` each tone below declares, so
    // tailwind-merge keeps BOTH and the admin token wins the moment a pointer
    // lands: on an inverted band the label flips to near-black on near-black
    // and disappears. Each tone therefore restates its ink at `hover:` too —
    // see the individual tones — and this is why a tone may never rely on its
    // resting `text-*` surviving the hover state.
  ].join(' '),
  {
    variants: {
      tone: {
        /**
         * The page's primary action. Only one per view.
         *
         * Painted from `--fx-btn-primary` / `--fx-btn-primary-ink`, which are
         * admin settings — NOT from the accent. On an enterprise site the
         * primary button is usually near-black while the accent stays the link
         * and focus colour; tying the two together is what makes a rebrand
         * turn every CTA into a block of saturated colour. Both tokens fall
         * back to the theme's ink/canvas, so an untouched install is unchanged.
         */
        solid: [
          'bg-fx-btn-primary text-fx-btn-primary-ink shadow-fx-2',
          'hover:text-fx-btn-primary-ink',
          'hover:bg-fx-btn-primary-hover hover:shadow-fx-3 hover:-translate-y-px',
          'active:translate-y-0 active:shadow-fx-1',
        ].join(' '),
        /**
         * Secondary action. Hairline first, fill second.
         *
         * The fill is `--fx-btn-secondary`, which defaults to `transparent` —
         * so this reads as an outlined button unless an editor gives it a
         * colour, and the hairline is derived from the label rather than from
         * a neutral line token so the two halves of the control always agree.
         */
        outline: [
          'border border-fx-btn-secondary-ink/25 bg-fx-btn-secondary text-fx-btn-secondary-ink',
          'hover:text-fx-btn-secondary-ink',
          'hover:border-fx-btn-secondary-ink/50 hover:bg-fx-btn-secondary-hover hover:-translate-y-px',
          'active:translate-y-0',
        ].join(' '),
        /** Tertiary. Chrome-level actions such as the header CTA row. */
        ghost: [
          'bg-transparent text-fx-ink-soft shadow-none',
          'hover:bg-fx-btn-secondary-hover hover:text-fx-btn-secondary-ink',
        ].join(' '),
        /**
         * Primary action ON an inverted band.
         *
         * Built from `--fx-ink` / `--fx-canvas`, which `Section`'s `inverted`
         * variant rebinds locally — so the button is always the band's ink
         * colour filled with the band's own background, and it cannot fall
         * below 3:1 in either theme the way a fixed accent fill does.
         */
        inverse: [
          'bg-fx-ink text-fx-canvas shadow-fx-2',
          'hover:text-fx-canvas',
          'hover:-translate-y-px hover:shadow-fx-3',
          'active:translate-y-0',
        ].join(' '),
      },
      scale: {
        sm: 'h-10 gap-2 px-5 text-fx-label',
        md: 'h-12 gap-2 px-6 text-fx-label',
        lg: 'h-14 gap-2.5 px-8 text-fx-body',
      },
    },
    defaultVariants: {
      tone: 'solid',
      scale: 'md',
    },
  }
)

export type FxButtonVariants = VariantProps<typeof fxButton>
export type FxButtonTone = NonNullable<FxButtonVariants['tone']>
export type FxButtonScale = NonNullable<FxButtonVariants['scale']>

/**
 * The editor's "Button style" choice → an `fxButton` tone.
 *
 * The menu dialog offers Solid / Outline / Ghost. Two more values reach the
 * front end and both are handled here rather than at each call site:
 *
 *  - `default` is what `NavigationService` emits when a menu item has NO
 *    stored variant (`$node['settings']['variant'] ?? 'default'`). It is the
 *    absence of a choice, not a choice, so it must NOT be mapped to a tone —
 *    it falls through to the caller's positional rule. Mapping it to `solid`
 *    would repaint every CTA on every menu authored before the style picker
 *    existed.
 *  - `secondary` is a legacy value from the shadcn-flavoured `NavCta` union.
 *    It reads as "the quieter boxed button", which is `outline` here.
 *
 * Anything else — a hand-edited setting, a value from a future dialog this
 * build does not know — also falls through, so an unrecognised string can
 * never blank a CTA's skin.
 */
const CTA_VARIANT_TONES: Readonly<Record<string, FxButtonTone>> = {
  solid: 'solid',
  outline: 'outline',
  ghost: 'ghost',
  inverse: 'inverse',
  secondary: 'outline',
}

/**
 * Resolve a CTA's tone: the editor's explicit choice, else the surface's own
 * positional rule.
 *
 * `fallback` is the tone the surface would have used before the variant was
 * read, which is what keeps this change additive — the header's first CTA is
 * still `inverse` and the drawer's is still `solid` until someone actually
 * picks something in the admin.
 */
export function ctaTone(
  variant: string | null | undefined,
  fallback: FxButtonTone
): FxButtonTone {
  const key = typeof variant === 'string' ? variant.trim().toLowerCase() : ''

  return CTA_VARIANT_TONES[key] ?? fallback
}
