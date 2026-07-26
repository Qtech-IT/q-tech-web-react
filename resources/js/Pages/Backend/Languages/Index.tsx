import { LanguageWrapper } from '@/Components/Feature/Backend/Language/LanguageWrapper';
import { LanguageProps } from '@/Types/User/setting';

export default function Index(props: LanguageProps) {
  return <LanguageWrapper  {...props} />;
}