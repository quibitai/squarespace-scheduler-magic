
import React from "react";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDisplayDate } from "@/utils/dateUtils";
import { CalendarCheck } from "lucide-react";

interface BookingConfirmationProps {
  name: string;
  email: string;
  onReset: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ 
  name, 
  email, 
  onReset 
}) => {
  const { selectedDate, selectedTimeSlot } = useBooking();

  if (!selectedDate || !selectedTimeSlot) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <CalendarCheck className="h-12 w-12 text-primary" />
          </div>
        </div>
        <CardTitle className="text-xl">Booking Confirmed!</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="border-b pb-4 text-center">
          <p className="text-muted-foreground">A confirmation email has been sent to:</p>
          <p className="font-medium">{email}</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold">Appointment Details:</h3>
          <p>Name: {name}</p>
          <p>Date: {formatDisplayDate(selectedDate)}</p>
          <p>Time: {selectedTimeSlot.time}</p>
        </div>
        
        <div className="bg-muted p-4 rounded-md">
          <p className="text-sm">
            Need to make changes? Contact us directly or click the button below 
            to schedule another appointment.
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={onReset} 
          className="w-full"
        >
          Book Another Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingConfirmation;
