import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

export interface SectionBoundaryProps {
  children: ReactNode
  /** Section type, for the console message. Never rendered. */
  sectionType?: string | undefined
}

interface SectionBoundaryState {
  failed: boolean
}

/**
 * Contains a single section's render failure.
 *
 * Without this, one section throwing takes the entire page down to a blank
 * screen — including the header, the footer and every section that was fine.
 * A page missing one band is a content problem; a blank page is an outage.
 *
 * A class component because that is still the only way to catch a render error;
 * `react-error-boundary` would be a dependency for one lifecycle method.
 *
 * Renders nothing on failure. There is deliberately no visible error state: the
 * public site must never expose internals, and a "something went wrong" box in
 * the middle of a marketing page is worse than the section's absence.
 */
export class SectionBoundary extends Component<
  SectionBoundaryProps,
  SectionBoundaryState
> {
  state: SectionBoundaryState = { failed: false }

  static getDerivedStateFromError(): SectionBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error(
        `[cms] section "${this.props.sectionType ?? 'unknown'}" failed to render`,
        error,
        info.componentStack
      )
    }
  }

  render(): ReactNode {
    return this.state.failed ? null : this.props.children
  }
}

export default SectionBoundary
