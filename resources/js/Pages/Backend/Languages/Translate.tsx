import { TranslationWrapper } from '@/Components/Feature/Backend/Language/TranslationWrapper';
import { TranslationProps } from '@/Types/User/setting';

export default function Index(props: TranslationProps) {
  return <TranslationWrapper  {...props} />;
}