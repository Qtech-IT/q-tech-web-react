import { FormControl, FormItem, FormLabel } from "@/Components/UI/Form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/UI/Select";

export const SelectFieldComponent: React.FC<{ label: string; placeholder: string; options: Array<{ value: string; label: string }>; value: string; onChange: (value: string) => void }> =
  ({ label, placeholder, options, value, onChange }) => {
    return (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, idx) => (
                <SelectItem key={`${option.value}-${idx}`} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </FormItem>
    );
  };