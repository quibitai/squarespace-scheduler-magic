
import React, { useState } from "react";
import CalendarView from "@/components/Calendar/CalendarView";
import TimeSlotPicker from "@/components/Calendar/TimeSlotPicker";
import BookingForm from "@/components/BookingForm";
import BookingConfirmation from "@/components/BookingConfirmation";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { selectedDate, selectedTimeSlot, setSelectedDate, setSelectedTimeSlot } = useBooking();
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
        return (
          <>
            <CalendarView />
            <TimeSlotPicker />
            {selectedDate && selectedTimeSlot && (
              <div className="flex justify-center mt-4">
                <Button onClick={() => setCurrentStep("form")}>
                  Continue to Booking
                </Button>
              </div>
            )}
          </>
        );
      case "form":
        return (
          <>
            <BookingForm 
              onSuccess={() => handleBookingSuccess(
                (document.getElementById("name") as HTMLInputElement)?.value || "",
                (document.getElementById("email") as HTMLInputElement)?.value || ""
              )} 
            />
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={() => setCurrentStep("calendar")}>
                Back to Calendar
              </Button>
            </div>
          </>
        );
      case "confirmation":
        return (
          <BookingConfirmation 
            name={clientName} 
            email={clientEmail} 
            onReset={handleReset} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Book Your Appointment</h1>
            <p className="mt-2 text-lg text-gray-600">
              Select an available date and time that works for you.
            </p>
          </div>

          {renderStep()}

          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Need help? Contact us directly at help@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
