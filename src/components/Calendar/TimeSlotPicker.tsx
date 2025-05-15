import React from "react";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

const TimeSlotPicker: React.FC = () => {
  const { availableDates, selectedDate, selectedTimeSlot, setSelectedTimeSlot } = useBooking();

  if (!selectedDate) {
    return null;
  }
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const selectedDateObj = availableDates.find(d => d.date === selectedDateStr);

  if (!selectedDateObj) {
    return (
      <Card className="w-full max-w-md mx-auto mt-4">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No available times for the selected date.</p>
        </CardContent>
      </Card>
    );
  }

  const availableSlots = selectedDateObj.timeSlots.filter(slot => slot.isAvailable);

  if (availableSlots.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto mt-4">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">All time slots have been booked for this date.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Select a Time</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {availableSlots.map((slot) => (
            <Button
              key={slot.id}
              variant="outline"
              className={cn(
                "flex items-center justify-center h-12 transition-all",
                selectedTimeSlot?.id === slot.id ? "bg-primary text-primary-foreground" : ""
              )}
              onClick={() => setSelectedTimeSlot(slot)}
            >
              <Clock className="h-4 w-4 mr-2" />
              {slot.time}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlotPicker;
