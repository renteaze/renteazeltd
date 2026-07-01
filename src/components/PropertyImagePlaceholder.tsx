import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyImagePlaceholderProps {
  className?: string;
}

const PropertyImagePlaceholder = ({ className }: PropertyImagePlaceholderProps) => {
  return (
    <div
      className={cn(
        "bg-gray-100 flex flex-col items-center justify-center",
        className,
      )}
      aria-label="Images unavailable"
      role="img"
    >
      <ImageOff size={32} color="#9CA3AF" />
      <p className="text-sm text-gray-400 mt-2">Images Unavailable</p>
    </div>
  );
};

export default PropertyImagePlaceholder;
