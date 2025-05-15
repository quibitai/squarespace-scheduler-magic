import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useBooking } from "@/context/BookingContext";
import { formatDisplayDate, isPastDate, getDateRange } from "@/utils/dateUtils";

const CalendarView: React.FC = () => {
  const { availableDates, selectedDate, setSelectedDate, setSelectedTimeSlot } = useBooking();
  const { startDate, endDate } = getDateRange();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Adjust for timezone to prevent date shift
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() is 0-indexed
      const day = date.getDate();
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      console.log('Selected date:', date, 'Formatted as:', formattedDate);
      setSelectedDate(formattedDate);
      setSelectedTimeSlot(null); // Reset selected time slot when date changes
    } else {
      setSelectedDate(null);
    }
  };

  // Create date array for highlighting available dates in the calendar
  const availableDateArray = availableDates
    .filter(dateObj => !isPastDate(dateObj.date) && dateObj.timeSlots.some(slot => slot.isAvailable))
    .map(dateObj => new Date(dateObj.date));

  // Function to determine if a date should be disabled in the calendar
  const isDateDisabled = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
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
            selected={selectedDate ? new Date(selectedDate) : undefined}
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
            Selected: <span className="font-semibold">{formatDisplayDate(selectedDate)}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarView;
