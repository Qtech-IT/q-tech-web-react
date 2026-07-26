import { AutomationWrapper } from "@/Components/Feature/Backend/Automation/AutomationWrapper";
import { AutomationPageProps } from "@/Types/User/setting";

export default function Index(props : AutomationPageProps) {
   return <AutomationWrapper {...props} />;
}
