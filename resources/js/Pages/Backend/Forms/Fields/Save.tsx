import { CrudPageProps } from '@/Types/crud';
import { CrudSaveModule } from '@/Components/Core/DynamicCrud/CrudSaveModule';
import { useFormFieldConfig } from '@/Config/crud/useFormFieldConfig';

export default function Save(props: CrudPageProps) {
   
   const config = useFormFieldConfig(props);
   return <CrudSaveModule config={config} {...props} />;

}