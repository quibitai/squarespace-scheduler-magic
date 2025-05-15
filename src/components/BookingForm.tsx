
import React, { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDisplayDate } from "@/utils/dateUtils";
import { generateConfirmationEmail, sendEmail } from "@/utils/emailUtils";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface BookingFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  onSuccess,
  onBack
}) => {
  const {
    selectedDate,
    selectedTimeSlot,
    bookSlot
  } = useBooking();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  
  if (!selectedDate || !selectedTimeSlot) {
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast({
        title: "Missing information",
        description: "Please provide your name and email address.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      // Book the slot
      const success = await bookSlot(selectedDate, selectedTimeSlot.id, email, name);
      if (success) {
        // Send confirmation email
        const emailData = generateConfirmationEmail(name, formatDisplayDate(selectedDate), selectedTimeSlot.time, email);
        await sendEmail(emailData);
        toast({
          title: "Booking successful!",
          description: "You will receive a confirmation email shortly."
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
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return <Card className="w-full max-w-xl mx-auto border-0 shadow-none">
      <CardHeader className="px-0 pb-6">
        <div className="flex justify-start">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <h2 className="text-2xl font-normal">
        </h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="px-0 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-normal">First Name</Label>
              <Input id="firstName" value={name.split(' ')[0] || ''} onChange={e => {
              const firstName = e.target.value;
              const lastName = name.includes(' ') ? name.split(' ').slice(1).join(' ') : '';
              setName(`${firstName} ${lastName}`.trim());
            }} className="border-input h-10 rounded-none" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-normal">Last Name</Label>
              <Input id="lastName" value={name.includes(' ') ? name.split(' ').slice(1).join(' ') : ''} onChange={e => {
              const firstName = name.split(' ')[0] || '';
              setName(`${firstName} ${e.target.value}`.trim());
            }} className="border-input h-10 rounded-none" required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-normal">Email Address</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="border-input h-10 rounded-none" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-normal">Phone Number</Label>
            <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="border-input h-10 rounded-none" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-normal">Additional Notes</Label>
            <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className="border-input min-h-[100px] rounded-none resize-none" placeholder="Anything else you think we should know?" />
          </div>

          <div className="bg-muted px-4 py-3 space-y-2">
            <p className="text-sm font-medium">Appointment Details:</p>
            <p className="text-sm">Date: {formatDisplayDate(selectedDate)}</p>
            <p className="text-sm">Time: {selectedTimeSlot.time}</p>
          </div>
        </CardContent>
        
        <CardFooter className="px-0 pt-2 flex justify-center">
          <Button type="submit" variant="outline" className="w-[120px] h-10 rounded-none border-black text-black hover:bg-black/5 uppercase" disabled={isLoading}>
            {isLoading ? "Booking..." : "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>;
};

export default BookingForm;
