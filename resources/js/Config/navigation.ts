import type { SiteNavigation } from '@/Types/navigation'

/**
 * Placeholder navigation.
 *
 * This exists so the layout is viewable before the CMS menu builder is built.
 * It is the FALLBACK, not the source of truth: `PublicLayout` prefers
 * server-supplied navigation whenever it is present. When the menu builder
 * ships, this file stays on as the empty-state safety net.
 *
 * Labels are translated at render via `t()`, not here — translation needs the
 * Inertia page context, which module scope does not have.
 */
export const fallbackNavigation: SiteNavigation = {
  primary: [
    {
      id: 'services',
      label: 'Services',
      href: '/services',
      display: 'mega',
      columns: 2,
      children: [
        {
          id: 'services-build',
          label: 'Software Development',
          href: '/services/software-development',
          description: 'End-to-end delivery with senior engineering teams.',
          icon: 'Code2',
        },
        {
          id: 'services-cloud',
          label: 'Cloud & DevOps',
          href: '/services/cloud-devops',
          description: 'Migration, platform engineering and cost control.',
          icon: 'Cloud',
        },
        {
          id: 'services-data',
          label: 'Data & AI',
          href: '/services/data-ai',
          description: 'Pipelines, analytics and applied machine learning.',
          icon: 'Sparkles',
        },
        {
          id: 'services-design',
          label: 'Product Design',
          href: '/services/product-design',
          description: 'Research, UX and design systems that scale.',
          icon: 'PenTool',
        },
      ],
    },
    {
      id: 'industries',
      label: 'Industries',
      href: '/industries',
      display: 'dropdown',
      children: [
        { id: 'ind-finance', label: 'Financial Services', href: '/industries/financial-services' },
        { id: 'ind-health', label: 'Healthcare', href: '/industries/healthcare' },
        { id: 'ind-retail', label: 'Retail & eCommerce', href: '/industries/retail' },
        { id: 'ind-logistics', label: 'Logistics', href: '/industries/logistics' },
      ],
    },
    {
      id: 'work',
      label: 'Our Work',
      href: '/case-studies',
      display: 'link',
    },
    {
      id: 'company',
      label: 'Company',
      display: 'dropdown',
      children: [
        { id: 'about', label: 'About Us', href: '/about' },
        { id: 'team', label: 'Leadership', href: '/team' },
        { id: 'careers', label: 'Careers', href: '/careers', badge: { label: 'Hiring', variant: 'secondary' } },
        { id: 'blog', label: 'Insights', href: '/blog' },
      ],
    },
  ],
  ctas: [
    { label: 'Contact Sales', href: '/contact', variant: 'default' },
  ],
  footerColumns: [
    {
      id: 'f-services',
      title: 'Services',
      items: [
        { id: 'f-dev', label: 'Software Development', href: '/services/software-development' },
        { id: 'f-cloud', label: 'Cloud & DevOps', href: '/services/cloud-devops' },
        { id: 'f-data', label: 'Data & AI', href: '/services/data-ai' },
        { id: 'f-design', label: 'Product Design', href: '/services/product-design' },
      ],
    },
    {
      id: 'f-company',
      title: 'Company',
      items: [
        { id: 'f-about', label: 'About Us', href: '/about' },
        { id: 'f-careers', label: 'Careers', href: '/careers' },
        { id: 'f-blog', label: 'Insights', href: '/blog' },
        { id: 'f-contact', label: 'Contact', href: '/contact' },
      ],
    },
    {
      id: 'f-resources',
      title: 'Resources',
      items: [
        { id: 'f-cases', label: 'Case Studies', href: '/case-studies' },
        { id: 'f-faq', label: 'FAQ', href: '/faq' },
        { id: 'f-support', label: 'Support', href: '/support' },
      ],
    },
  ],
  legal: [
    { id: 'privacy', label: 'Privacy Policy', href: '/privacy' },
    { id: 'terms', label: 'Terms of Service', href: '/terms' },
    { id: 'cookies', label: 'Cookie Policy', href: '/cookies' },
  ],
  social: [
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com', icon: 'Linkedin' },
    { id: 'github', label: 'GitHub', href: 'https://github.com', icon: 'Github' },
    { id: 'x', label: 'X', href: 'https://x.com', icon: 'Twitter' },
  ],
}
