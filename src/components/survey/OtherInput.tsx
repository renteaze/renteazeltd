import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OtherInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export const OtherInput: React.FC<OtherInputProps> = ({
  name,
  value,
  onChange,
  label = "Please specify",
  placeholder = "Enter details...",
  required = false,
}) => (
  <div className="mt-3">
    <Label htmlFor={`${name}_other`}>{label}</Label>
    <Input
      id={`${name}_other`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1"
      required={required}
    />
  </div>
);

export default OtherInput;
