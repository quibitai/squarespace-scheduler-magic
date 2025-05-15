
import React from "react";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDisplayDate } from "@/utils/dateUtils";
import { CheckCircle } from "lucide-react";

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
    <Card className="w-full max-w-xl mx-auto border-0 shadow-none">
      <CardHeader className="px-0">
        <div className="flex justify-center mb-4">
          <div className="bg-black/5 p-3 rounded-full">
            <CheckCircle className="h-12 w-12 text-black" />
          </div>
        </div>
        <h2 className="text-2xl font-normal text-center">Appointment Confirmed</h2>
      </CardHeader>
      
      <CardContent className="px-0 space-y-6">
        <div className="border-b border-border pb-4 text-center">
          <p className="text-muted-foreground">A confirmation email has been sent to:</p>
          <p className="font-medium">{email}</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Appointment Details:</h3>
          <p>Name: {name}</p>
          <p>Date: {formatDisplayDate(selectedDate)}</p>
          <p>Time: {selectedTimeSlot.time}</p>
        </div>
        
        <div className="bg-muted p-4">
          <p className="text-sm">
            Need to make changes? Contact us directly or book another appointment below.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="px-0 pt-4">
        <Button 
          onClick={onReset} 
          className="rounded-none bg-black text-white hover:bg-black/90 min-w-[220px]"
        >
          Book Another Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingConfirmation;
