import { SystemInfoWrapper } from "@/Components/Feature/Backend/SystemInfo/SystemInfoWrapper";
import { SyatemInfoPageProps } from "@/Types/User/setting";

export default function Index(props : SyatemInfoPageProps) {
  return <SystemInfoWrapper {...props} />;
}
