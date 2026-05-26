import { useState, useEffect } from "react";
import { addMonths } from "date-fns";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";

interface TenancyDatePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  duration: "monthly" | "quarterly" | "biannually" | "annually" | "other" | "";
  onDurationChange?: (duration: string) => void;
}

export const TenancyDatePicker: React.FC<TenancyDatePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  duration,
}) => {
  const [open, setOpen] = useState(false);

  // Auto-compute end date when start date or duration changes
  useEffect(() => {
    if (!startDate || !duration || duration === "" || duration === "other") {
      onEndDateChange(null);
      return;
    }

    const durationMap: Record<string, number> = {
      monthly: 1,
      quarterly: 3,
      biannually: 6,
      annually: 12,
    };

    const months = durationMap[duration] || 0;
    if (months > 0) {
      const computed = addMonths(startDate, months);
      onEndDateChange(computed);
    }
  }, [startDate, duration, onEndDateChange]);

  const formatDate = (date: Date | null) => {
    if (!date) return "Not set";
    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Tenancy Start Date</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full mt-1 justify-start text-left font-normal pointer-events-auto"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDate(startDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto">
            <Calendar
              mode="single"
              selected={startDate || undefined}
              onSelect={(date) => {
                onStartDateChange(date || null);
                setOpen(false);
              }}
              disabled={(date) => date > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {duration && duration !== "other" && (
        <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
          <p className="text-sm font-medium">Tenancy End Date</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">
              Ends: {formatDate(endDate)}
            </span>
            {endDate && (
              <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                {duration === "monthly"
                  ? "1 month"
                  : duration === "quarterly"
                    ? "3 months"
                    : duration === "biannually"
                      ? "6 months"
                      : "12 months"}
              </span>
            )}
          </div>
        </div>
      )}

      {duration === "other" && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-muted-foreground">
            Please select both start and end dates for custom durations
          </p>
        </div>
      )}
    </div>
  );
};

export default TenancyDatePicker;
