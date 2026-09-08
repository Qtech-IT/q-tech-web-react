import MediaLibraryWrapper from '@/Components/Feature/Backend/Cms/MediaLibrary/MediaLibraryWrapper';
import type { MediaLibraryProps } from '@/Types/cms';

export default function Index(props: MediaLibraryProps) {
  return <MediaLibraryWrapper {...props} />;
}
