import ProfileWrapper from "@/Components/Feature/Backend/Profile/ProfileWrapper";
import { ProfileProps } from "@/Types/User";

const Index: React.FC<ProfileProps> = (props) => {
  return <ProfileWrapper {...props} />;
};

export default Index;
