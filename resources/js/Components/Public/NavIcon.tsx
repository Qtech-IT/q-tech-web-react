import {
  ArrowRight,
  Briefcase,
  Building2,
  Cloud,
  Code2,
  Cpu,
  Database,
  Github,
  Globe,
  GraduationCap,
  Handshake,
  HeartPulse,
  Layers,
  LifeBuoy,
  Linkedin,
  Mail,
  MapPin,
  Newspaper,
  PenTool,
  Phone,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  Users,
  Youtube,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/Utils/helpers'

/**
 * Explicit icon registry.
 *
 * Deliberately NOT `import * as LucideIcons` — a namespace import defeats
 * tree-shaking and drags the entire icon set (~1000 components) into the
 * bundle. `Utils/iconHelper.tsx` already does that for the admin icon picker
 * and is a known payload problem; the public site must not repeat it.
 *
 * Adding an icon to the CMS means adding one line here. That friction is the
 * point: it keeps the public bundle honest.
 *
 * Note: `Github`/`Linkedin`/`Youtube` are flagged deprecated by Lucide, which
 * is dropping brand marks. They still render correctly and there is no
 * in-package replacement, so they stay until we ship real brand SVGs.
 */
const ICON_REGISTRY = {
  ArrowRight,
  Briefcase,
  Building2,
  Cloud,
  Code2,
  Cpu,
  Database,
  Github,
  Globe,
  GraduationCap,
  Handshake,
  HeartPulse,
  Layers,
  LifeBuoy,
  Linkedin,
  Mail,
  MapPin,
  Newspaper,
  PenTool,
  Phone,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  Users,
  Youtube,
} satisfies Record<string, LucideIcon>

export type NavIconName = keyof typeof ICON_REGISTRY

/**
 * Whether a name will actually render. Callers that would otherwise emit an
 * empty element (an icon-only link, for instance) must check this and supply
 * a text fallback, so a bad CMS value degrades instead of vanishing.
 */
export function isRegisteredNavIcon(name?: string): name is NavIconName {
  return Boolean(name && name in ICON_REGISTRY)
}

export interface NavIconProps {
  /** Lucide icon name as stored by the CMS, e.g. `Cloud`. */
  name?: string | undefined
  className?: string | undefined
}

/**
 * Renders a registered icon, or nothing.
 *
 * An unknown or missing name returns `null` rather than throwing or rendering
 * a placeholder — icons are decoration, and a content editor typing a bad name
 * must never be able to break a page.
 *
 * Always `aria-hidden`: these sit beside a text label, so announcing them
 * would only duplicate it.
 */
export function NavIcon({ name, className }: NavIconProps) {
  if (!name) return null

  const Icon = ICON_REGISTRY[name as NavIconName]
  if (!Icon) return null

  return <Icon aria-hidden="true" className={cn('size-4 shrink-0', className)} />
}

export default NavIcon
