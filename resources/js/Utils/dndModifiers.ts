import type { ClientRect, Modifier } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';

/**
 * Local dnd-kit modifiers.
 *
 * `@dnd-kit/core`, `/sortable` and `/utilities` are installed; the optional
 * `@dnd-kit/modifiers` package is not, and both builders need only these two.
 * Fifteen lines beats a new dependency for that.
 */

/** Clamp a transform so the dragged rect cannot leave a bounding rect. */
function clampToRect(
  transform: Transform,
  rect: ClientRect,
  boundingRect: ClientRect
): Transform {
  const next = { ...transform };

  if (rect.top + transform.y <= boundingRect.top) {
    next.y = boundingRect.top - rect.top;
  } else if (
    rect.bottom + transform.y >=
    boundingRect.top + boundingRect.height
  ) {
    next.y = boundingRect.top + boundingRect.height - rect.bottom;
  }

  if (rect.left + transform.x <= boundingRect.left) {
    next.x = boundingRect.left - rect.left;
  } else if (
    rect.right + transform.x >=
    boundingRect.left + boundingRect.width
  ) {
    next.x = boundingRect.left + boundingRect.width - rect.right;
  }

  return next;
}

/**
 * Lock dragging to the vertical axis.
 *
 * A section list is one column; letting the card drift sideways implies a
 * horizontal drop target that does not exist.
 */
export const restrictToVerticalAxis: Modifier = ({ transform }) => ({
  ...transform,
  x: 0,
});

/** Keep the dragged item inside its own list. */
export const restrictToParentElement: Modifier = ({
  containerNodeRect,
  draggingNodeRect,
  transform,
}) => {
  if (!draggingNodeRect || !containerNodeRect) {
    return transform;
  }

  return clampToRect(transform, draggingNodeRect, containerNodeRect);
};
