import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";

interface ContactWindow {
  day: string;
  time_of_day: "morning" | "afternoon" | "evening";
}

interface ContactWindowsPickerProps {
  windows: ContactWindow[];
  onChange: (windows: ContactWindow[]) => void;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIME_SLOTS = [
  { value: "morning", label: "Morning (8:00 AM – 12:00 PM)" },
  { value: "afternoon", label: "Afternoon (12:00 PM – 5:00 PM)" },
  { value: "evening", label: "Evening (5:00 PM – 8:00 PM)" },
];

export const ContactWindowsPicker: React.FC<ContactWindowsPickerProps> = ({
  windows,
  onChange,
}) => {
  const addWindow = () => {
    if (windows.length < 3) {
      onChange([...windows, { day: "Monday", time_of_day: "morning" }]);
    }
  };

  const removeWindow = (index: number) => {
    onChange(windows.filter((_, i) => i !== index));
  };

  const updateWindow = (
    index: number,
    field: "day" | "time_of_day",
    value: string
  ) => {
    const updated = [...windows];
    if (field === "day") {
      updated[index].day = value;
    } else {
      updated[index].time_of_day = value as "morning" | "afternoon" | "evening";
    }
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <Label>When should we call you? (Select up to 3 time windows)</Label>

      {windows.length === 0 && (
        <div className="p-3 bg-muted rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">
            Add at least one preferred callback time window to get started.
          </p>
        </div>
      )}

      {windows.map((window, idx) => (
        <div key={idx} className="flex gap-3 items-end p-3 bg-card border rounded-lg">
          <div className="flex-1">
            <Label className="text-xs mb-1 block">Day</Label>
            <Select value={window.day} onValueChange={(v) => updateWindow(idx, "day", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label className="text-xs mb-1 block">Time</Label>
            <Select
              value={window.time_of_day}
              onValueChange={(v) => updateWindow(idx, "time_of_day", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeWindow(idx)}
            className="h-10 w-10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {windows.length < 3 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addWindow}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Another Time Window
        </Button>
      )}

      {windows.length === 0 && (
        <p className="text-xs text-destructive mt-2">
          At least one callback window is required.
        </p>
      )}
    </div>
  );
};

export default ContactWindowsPicker;
