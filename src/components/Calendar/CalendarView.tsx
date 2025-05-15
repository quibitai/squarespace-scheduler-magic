import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useBooking } from "@/context/BookingContext";
import { formatDisplayDate, isPastDate, getDateRange } from "@/utils/dateUtils";
import { format, parse } from "date-fns";

const CalendarView: React.FC = () => {
  const { availableDates, selectedDate, setSelectedDate, setSelectedTimeSlot } = useBooking();
  const { startDate, endDate } = getDateRange();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTimeSlot(null); // Reset selected time slot when date changes
    } else {
      setSelectedDate(null);
    }
  };

  // Create date array for highlighting available dates in the calendar
  const availableDateArray = availableDates
    .filter(dateObj => !isPastDate(dateObj.date) && dateObj.timeSlots.some(slot => slot.isAvailable))
    .map(dateObj => parse(dateObj.date, 'yyyy-MM-dd', new Date()));

  // Function to determine if a date should be disabled in the calendar
  const isDateDisabled = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dateObj = availableDates.find(d => d.date === formattedDate);
    
    // Disable if date is in the past or has no available slots
    return isPastDate(formattedDate) || 
           !dateObj || 
           !dateObj.timeSlots.some(slot => slot.isAvailable);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Select a Date</h2>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border pointer-events-auto"
            fromDate={startDate}
            toDate={endDate}
            modifiers={{
              available: availableDateArray,
            }}
            modifiersStyles={{
              available: {
                fontWeight: 'bold',
                textDecoration: 'underline',
                color: 'var(--primary)',
              }
            }}
          />
        </div>
        {selectedDate && (
          <p className="text-center mt-4">
            Selected: <span className="font-semibold">{formatDisplayDate(format(selectedDate, 'yyyy-MM-dd'))}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarView;
