import { BackupPageProps } from '@/Types/User/setting';
import { BackupWrapper } from '@/Components/Feature/Backend/Backup/BackupWrapper';

export default function Index(props : BackupPageProps) {
  return <BackupWrapper {...props} />
}
