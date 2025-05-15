
import React, { createContext, useState, useContext, ReactNode } from "react";

export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

export interface AppointmentDate {
  date: string;
  timeSlots: TimeSlot[];
}

interface BookingContextType {
  availableDates: AppointmentDate[];
  setAvailableDates: React.Dispatch<React.SetStateAction<AppointmentDate[]>>;
  selectedDate: string | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTimeSlot: TimeSlot | null;
  setSelectedTimeSlot: React.Dispatch<React.SetStateAction<TimeSlot | null>>;
  bookSlot: (date: string, slotId: string, clientEmail: string, clientName: string) => Promise<boolean>;
  addAvailableDate: (date: string) => void;
  addTimeSlot: (date: string, time: string) => void;
  removeTimeSlot: (date: string, slotId: string) => void;
  removeAvailableDate: (date: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Sample data - in a real app this would come from an API/database
const sampleDates: AppointmentDate[] = [
  {
    date: "2025-05-20",
    timeSlots: [
      { id: "1", time: "09:00 AM", isAvailable: true },
      { id: "2", time: "10:00 AM", isAvailable: true },
      { id: "3", time: "11:00 AM", isAvailable: true },
      { id: "4", time: "01:00 PM", isAvailable: true },
      { id: "5", time: "02:00 PM", isAvailable: true },
    ]
  },
  {
    date: "2025-05-21",
    timeSlots: [
      { id: "6", time: "09:00 AM", isAvailable: true },
      { id: "7", time: "10:00 AM", isAvailable: true },
      { id: "8", time: "11:00 AM", isAvailable: true },
    ]
  },
  {
    date: "2025-05-22",
    timeSlots: [
      { id: "9", time: "01:00 PM", isAvailable: true },
      { id: "10", time: "02:00 PM", isAvailable: true },
      { id: "11", time: "03:00 PM", isAvailable: true },
      { id: "12", time: "04:00 PM", isAvailable: true },
    ]
  },
];

export const BookingProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [availableDates, setAvailableDates] = useState<AppointmentDate[]>(sampleDates);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  const bookSlot = async (date: string, slotId: string, clientEmail: string, clientName: string) => {
    try {
      // In a real app, this would be an API call to your backend
      console.log(`Booking slot for ${clientName} (${clientEmail}): Date ${date}, Slot ID ${slotId}`);
      
      // Update local state to mark the slot as unavailable
      setAvailableDates(prevDates => 
        prevDates.map(dateObj => 
          dateObj.date === date ? {
            ...dateObj,
            timeSlots: dateObj.timeSlots.map(slot => 
              slot.id === slotId ? { ...slot, isAvailable: false } : slot
            )
          } : dateObj
        )
      );

      // In a real application, you would send an email here via your backend
      console.log(`Sending confirmation email to ${clientEmail}`);
      
      return true;
    } catch (error) {
      console.error("Error booking slot:", error);
      return false;
    }
  };

  const addAvailableDate = (date: string) => {
    if (!availableDates.some(d => d.date === date)) {
      setAvailableDates([...availableDates, { date, timeSlots: [] }]);
    }
  };

  const addTimeSlot = (date: string, time: string) => {
    setAvailableDates(prevDates => {
      const dateExists = prevDates.find(d => d.date === date);
      
      if (dateExists) {
        // Add time slot to existing date
        return prevDates.map(d => 
          d.date === date ? {
            ...d,
            timeSlots: [...d.timeSlots, { 
              id: Math.random().toString(36).substr(2, 9),
              time, 
              isAvailable: true 
            }]
          } : d
        );
      } else {
        // Create new date with time slot
        return [...prevDates, {
          date,
          timeSlots: [{ 
            id: Math.random().toString(36).substr(2, 9),
            time, 
            isAvailable: true 
          }]
        }];
      }
    });
  };

  const removeTimeSlot = (date: string, slotId: string) => {
    setAvailableDates(prevDates => 
      prevDates.map(d => 
        d.date === date ? {
          ...d,
          timeSlots: d.timeSlots.filter(slot => slot.id !== slotId)
        } : d
      ).filter(d => d.timeSlots.length > 0) // Remove dates with no time slots
    );
  };

  const removeAvailableDate = (date: string) => {
    setAvailableDates(prevDates => prevDates.filter(d => d.date !== date));
  };

  return (
    <BookingContext.Provider value={{
      availableDates,
      setAvailableDates,
      selectedDate,
      setSelectedDate,
      selectedTimeSlot,
      setSelectedTimeSlot,
      bookSlot,
      addAvailableDate,
      addTimeSlot,
      removeTimeSlot,
      removeAvailableDate
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
