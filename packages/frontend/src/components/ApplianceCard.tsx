import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Settings, Wrench } from "lucide-react";
import { Appliance } from "@/types/appliance";
import { format } from "date-fns";

interface ApplianceCardProps {
  appliance: Appliance;
  onViewDetails: (id: string) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'under-warranty':
      return <Badge className="bg-success text-success-foreground">Under Warranty</Badge>;
    case 'expiring-soon':
      return <Badge className="bg-warning text-warning-foreground">Expiring Soon</Badge>;
    case 'warranty-expired':
      return <Badge variant="destructive">Warranty Expired</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export const ApplianceCard = ({ appliance, onViewDetails }: ApplianceCardProps) => {
  return (
    <Card className="group hover:shadow-card transition-all duration-300 border-0 bg-gradient-card backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-card-foreground">
              {appliance.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {appliance.brand} {appliance.model}
            </p>
          </div>
          {getStatusBadge(appliance.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <p><span className="font-medium">SN:</span> {appliance.serialNumber}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              Warranty expires: {format(new Date(appliance.warrantyExpiration), 'M/d/yyyy')}
            </span>
          </div>
          
          {appliance.nextMaintenanceDate && (
            <div className="flex items-center gap-2 text-sm">
              <Wrench className="h-4 w-4 text-info" />
              <span className="text-muted-foreground">
                Next maintenance: {format(new Date(appliance.nextMaintenanceDate), 'M/d/yyyy')}
              </span>
            </div>
          )}
        </div>
        
        <Button 
          onClick={() => onViewDetails(appliance.id)}
          className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Settings className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};