import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Appliance } from "@/types/appliance";

const applianceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  warrantyExpiration: z.string().min(1, "Warranty expiration is required"),
  nextMaintenanceDate: z.string().optional(),
  notes: z.string().optional(),
});

type ApplianceFormData = z.infer<typeof applianceSchema>;

interface AddApplianceDialogProps {
  onAddAppliance: (appliance: Appliance) => void;
}

const categories = [
  "Kitchen", "Laundry", "Climate Control", "Entertainment", "Cleaning", 
  "Personal Care", "Security", "Lighting", "Outdoor", "Other"
];

export function AddApplianceDialog({ onAddAppliance }: AddApplianceDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<ApplianceFormData>({
    resolver: zodResolver(applianceSchema),
    defaultValues: {
      name: "",
      brand: "",
      model: "",
      serialNumber: "",
      category: "",
      location: "",
      purchaseDate: "",
      warrantyExpiration: "",
      nextMaintenanceDate: "",
      notes: "",
    },
  });

  const onSubmit = (data: ApplianceFormData) => {
    const warrantyExpDate = new Date(data.warrantyExpiration);
    const today = new Date();
    const monthsUntilExpiry = (warrantyExpDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    let status: Appliance['status'];
    if (monthsUntilExpiry < 0) {
      status = 'warranty-expired';
    } else if (monthsUntilExpiry <= 3) {
      status = 'expiring-soon';
    } else {
      status = 'under-warranty';
    }

    const newAppliance: Appliance = {
      id: `app-${Date.now()}`,
      name: data.name,
      brand: data.brand,
      model: data.model,
      serialNumber: data.serialNumber,
      category: data.category,
      location: data.location,
      purchaseDate: data.purchaseDate,
      warrantyExpiration: data.warrantyExpiration,
      nextMaintenanceDate: data.nextMaintenanceDate,
      notes: data.notes,
      status,
    };

    onAddAppliance(newAppliance);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary">
          <Plus className="h-4 w-4" />
          Add Appliance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Appliance</DialogTitle>
          <DialogDescription>
            Enter the details of your new appliance to track its warranty and maintenance.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appliance Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Kitchen Refrigerator" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Samsung" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., RF23M8070SR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SN123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Kitchen" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="warrantyExpiration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty Expiration</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nextMaintenanceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Maintenance Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional notes about this appliance..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary">
                Add Appliance
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}