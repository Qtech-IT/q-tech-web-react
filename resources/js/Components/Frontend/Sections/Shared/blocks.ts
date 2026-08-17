import type { CmsSectionBlock } from '@/Types/cms'

/**
 * Rows of one `block_type`, in editor order.
 *
 * A section's `blocks` array is heterogeneous — `hero.split` mixes `stat` and
 * `badge` rows in one list — so every consumer must filter by `block_type`
 * rather than assuming position. Reading a `badge` row as a `stat` is the
 * single most likely way to break a repeater-backed section.
 *
 * Only top-level rows are returned: nested rows arrive under their parent's
 * `children`, and a section that does not render nesting must not silently
 * flatten it into the top level.
 */
export function blocksOfType(
  blocks: CmsSectionBlock[] | null | undefined,
  type: string
): CmsSectionBlock[] {
  return (blocks ?? [])
    .filter((block) => block.block_type === type && block.parent_id === null)
    .sort((a, b) => a.sort_order - b.sort_order)
}
