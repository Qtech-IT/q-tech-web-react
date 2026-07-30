import { PageTreeWrapper } from '@/Components/Feature/Backend/Cms/PageTree/PageTreeWrapper';
import type { PageTreeProps } from '@/Types/cms';

/** Rendered by `PageController::tree()`. */
export default function Tree(props: PageTreeProps) {
  return <PageTreeWrapper {...props} />;
}
