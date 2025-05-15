
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

// Define the schema for the settings form
const settingsFormSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  emailTemplate: z.string().min(1, "Email template is required"),
  slotDuration: z.string().min(1, "Slot duration is required"),
  businessHoursStart: z.string().min(1, "Business hours start is required"),
  businessHoursEnd: z.string().min(1, "Business hours end is required"),
  squarespaceApiKey: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

// Default settings values
const defaultSettings: SettingsFormValues = {
  businessName: "My Booking Business",
  emailTemplate: "Thank you for booking with {businessName}! Your appointment is scheduled for {date} at {time}.",
  slotDuration: "60",
  businessHoursStart: "09:00",
  businessHoursEnd: "17:00",
  squarespaceApiKey: "",
};

const SettingsManager: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Retrieve settings from localStorage if available, otherwise use defaults
  const storedSettings = localStorage.getItem('bookingSystemSettings');
  const initialSettings = storedSettings 
    ? JSON.parse(storedSettings) 
    : defaultSettings;

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: initialSettings,
  });

  const onSubmit = (data: SettingsFormValues) => {
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      // Save settings to localStorage
      localStorage.setItem('bookingSystemSettings', JSON.stringify(data));
      
      setIsLoading(false);
      toast({
        title: "Settings updated",
        description: "Your system settings have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure your booking system settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Your business name as displayed to customers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="slotDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Slot Duration (minutes)</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select slot duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Default duration for appointment slots
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessHoursStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Hours Start</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessHoursEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Hours End</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="emailTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmation Email Template</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={4} 
                        {...field} 
                        placeholder="Enter email template with placeholders like {businessName}, {date}, {time}, etc."
                      />
                    </FormControl>
                    <FormDescription>
                      Use placeholders: {'{businessName}'}, {'{date}'}, {'{time}'}, {'{customerName}'}, {'{customerEmail}'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="squarespaceApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Squarespace API Key (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormDescription>
                      For Squarespace integration
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>Additional configuration options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Export Booking Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Clear All Bookings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              System Maintenance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManager;
