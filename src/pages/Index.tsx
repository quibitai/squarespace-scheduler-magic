
import React, { useState } from "react";
import CalendarView from "@/components/Calendar/CalendarView";
import TimeSlotPicker from "@/components/Calendar/TimeSlotPicker";
import BookingForm from "@/components/BookingForm";
import BookingConfirmation from "@/components/BookingConfirmation";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const {
    selectedDate,
    selectedTimeSlot,
    setSelectedDate,
    setSelectedTimeSlot
  } = useBooking();
  const [currentStep, setCurrentStep] = useState<"calendar" | "form" | "confirmation">("calendar");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  
  const handleBookingSuccess = (name: string, email: string) => {
    setClientName(name);
    setClientEmail(email);
    setCurrentStep("confirmation");
  };
  
  const handleReset = () => {
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setCurrentStep("calendar");
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case "calendar":
        return <div className="space-y-8">
            <CalendarView />
            <TimeSlotPicker />
            {selectedDate && selectedTimeSlot && <div className="flex justify-center mt-6">
                <Button onClick={() => setCurrentStep("form")} variant="outline" className="rounded-none border-black text-black hover:bg-black/5 uppercase">
                  Continue
                </Button>
              </div>}
          </div>;
      case "form":
        return <div className="space-y-8">
            <BookingForm onSuccess={() => handleBookingSuccess((document.getElementById("firstName") as HTMLInputElement)?.value + " " + (document.getElementById("lastName") as HTMLInputElement)?.value, (document.getElementById("email") as HTMLInputElement)?.value || "")} />
          </div>;
      case "confirmation":
        return <BookingConfirmation name={clientName} email={clientEmail} onReset={handleReset} />;
    }
  };
  
  return <div className="min-h-screen bg-background py-12 md:py-16">
      <div className="container max-w-5xl px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          {currentStep !== "confirmation" && <div className="mb-12">
              <h1 className="text-3xl mb-3 font-semibold">book your appointment</h1>
            </div>}

          {renderStep()}

          <div className="mt-16 text-sm text-muted-foreground">
            <p>Need help? Contact us directly at help@example.com</p>
          </div>
        </div>
      </div>
    </div>;
};

export default Index;
