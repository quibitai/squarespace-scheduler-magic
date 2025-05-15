
import React, { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDisplayDate, formatInputDate, format24hTo12h } from "@/utils/dateUtils";
import { Calendar } from "@/components/ui/calendar";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SlotManager: React.FC = () => {
  const { availableDates, addAvailableDate, addTimeSlot, removeTimeSlot, removeAvailableDate } = useBooking();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeInput, setTimeInput] = useState("09:00");
  const { toast } = useToast();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleAddDate = () => {
    if (!selectedDate) {
      toast({
        title: "No date selected",
        description: "Please select a date to add.",
        variant: "destructive",
      });
      return;
    }

    const dateString = selectedDate.toISOString().split('T')[0];
    addAvailableDate(dateString);
    toast({
      title: "Date added",
      description: `${formatDisplayDate(dateString)} has been added.`,
    });
  };

  const handleAddTimeSlot = (date: string) => {
    if (!timeInput) {
      toast({
        title: "No time entered",
        description: "Please enter a time.",
        variant: "destructive",
      });
      return;
    }

    const formattedTime = format24hTo12h(timeInput);
    addTimeSlot(date, formattedTime);
    toast({
      title: "Time slot added",
      description: `${formattedTime} has been added to ${formatDisplayDate(date)}.`,
    });
  };

  const handleRemoveTimeSlot = (date: string, slotId: string, time: string) => {
    removeTimeSlot(date, slotId);
    toast({
      title: "Time slot removed",
      description: `${time} has been removed from ${formatDisplayDate(date)}.`,
    });
  };

  const handleRemoveDate = (date: string) => {
    removeAvailableDate(date);
    toast({
      title: "Date removed",
      description: `${formatDisplayDate(date)} has been removed.`,
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Available Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border pointer-events-auto"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddDate} className="w-full">Add Selected Date</Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Manage Available Dates</h3>
        
        {availableDates.length === 0 ? (
          <p className="text-muted-foreground">No available dates added yet.</p>
        ) : (
          availableDates.map((dateObj) => (
            <Card key={dateObj.date} className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{formatDisplayDate(dateObj.date)}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveDate(dateObj.date)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex gap-2 mb-4">
                    <Input
                      type="time"
                      value={timeInput}
                      onChange={(e) => setTimeInput(e.target.value)}
                      className="w-full"
                    />
                    <Button onClick={() => handleAddTimeSlot(dateObj.date)}>
                      Add Time
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <Label>Time Slots:</Label>
                    {dateObj.timeSlots.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No time slots added yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        {dateObj.timeSlots.map((slot) => (
                          <div 
                            key={slot.id} 
                            className={`
                              flex justify-between items-center p-2 rounded-md border
                              ${slot.isAvailable ? 'bg-primary/5' : 'bg-muted line-through'}
                            `}
                          >
                            <span className="text-sm">{slot.time}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveTimeSlot(dateObj.date, slot.id, slot.time)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SlotManager;
