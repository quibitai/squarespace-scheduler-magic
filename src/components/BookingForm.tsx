
import React, { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDisplayDate } from "@/utils/dateUtils";
import { generateConfirmationEmail, sendEmail } from "@/utils/emailUtils";
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  onSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess }) => {
  const { selectedDate, selectedTimeSlot, bookSlot } = useBooking();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!selectedDate || !selectedTimeSlot) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        title: "Missing information",
        description: "Please provide your name and email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Book the slot
      const success = await bookSlot(selectedDate, selectedTimeSlot.id, email, name);
      
      if (success) {
        // Send confirmation email
        const emailData = generateConfirmationEmail(
          name,
          formatDisplayDate(selectedDate),
          selectedTimeSlot.time,
          email
        );
        
        await sendEmail(emailData);
        
        toast({
          title: "Booking successful!",
          description: "You will receive a confirmation email shortly.",
        });
        
        onSuccess();
      } else {
        throw new Error("Failed to book appointment");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">Complete Your Booking</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input 
              id="phone" 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="Enter your phone number"
            />
          </div>

          <div className="bg-muted p-4 rounded-md space-y-2">
            <p className="text-sm font-medium">Appointment Details:</p>
            <p className="text-sm">Date: {formatDisplayDate(selectedDate)}</p>
            <p className="text-sm">Time: {selectedTimeSlot.time}</p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Booking..." : "Confirm Booking"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BookingForm;
