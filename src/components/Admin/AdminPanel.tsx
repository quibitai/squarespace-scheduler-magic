import React from "react";
import SlotManager from "./SlotManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBooking } from "@/context/BookingContext";
import SettingsManager from "./SettingsManager";

const AdminPanel: React.FC = () => {
  const { availableDates } = useBooking();

  // Count total available slots
  const totalSlots = availableDates.reduce((acc, date) => {
    return acc + date.timeSlots.length;
  }, 0);

  // Count booked slots
  const bookedSlots = availableDates.reduce((acc, date) => {
    return acc + date.timeSlots.filter(slot => !slot.isAvailable).length;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Booking System Admin</h1>
        <a href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">View Scheduler</a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableDates.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Time Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSlots}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Booked Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookedSlots}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="manage-slots" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="manage-slots">Manage Slots</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="manage-slots">
          <SlotManager />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
