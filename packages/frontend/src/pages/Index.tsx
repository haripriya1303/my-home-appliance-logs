import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Home, Shield, Clock, Wrench, AlertTriangle } from "lucide-react";
import { ApplianceCard } from "@/components/ApplianceCard";
import { StatCard } from "@/components/StatCard";
import { FilterTabs } from "@/components/FilterTabs";
import { AddApplianceDialog } from "@/components/AddApplianceDialog";
import { applianceService } from "@/services/applianceService";
import { WarrantyFilter, Appliance } from "@/types/appliance";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WarrantyFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load appliances from API on component mount
  useEffect(() => {
    loadAppliances();
  }, []);

  const loadAppliances = async () => {
    try {
      setLoading(true);
      const data = await applianceService.getAllAppliances();
      setAppliances(data);
    } catch (error) {
      console.error('Failed to load appliances:', error);
      toast({
        title: "Error",
        description: "Failed to load appliances. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAppliances = appliances.filter(appliance => {
    const matchesSearch = appliance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appliance.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appliance.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filter) {
      case 'active-warranty':
        return appliance.status === 'under-warranty';
      case 'expiring-soon':
        return appliance.status === 'expiring-soon';
      case 'expired':
        return appliance.status === 'warranty-expired';
      default:
        return true;
    }
  });

  const stats = {
    total: appliances.length,
    activeWarranties: appliances.filter(a => a.status === 'under-warranty').length,
    expiringSoon: appliances.filter(a => a.status === 'expiring-soon').length,
    expired: appliances.filter(a => a.status === 'warranty-expired').length,
    maintenanceDue: appliances.filter(a => a.nextMaintenanceDate).length
  };

  const handleViewDetails = (id: string) => {
    toast({
      title: "Appliance Details",
      description: `Viewing details for appliance ${id}`,
    });
  };

  const handleAddAppliance = async (newApplianceData: Omit<Appliance, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    try {
      const createdAppliance = await applianceService.createAppliance({
        name: newApplianceData.name,
        brand: newApplianceData.brand,
        model: newApplianceData.model,
        serialNumber: newApplianceData.serialNumber,
        category: newApplianceData.category,
        location: newApplianceData.location,
        purchaseDate: newApplianceData.purchaseDate,
        warrantyExpiration: newApplianceData.warrantyExpiration,
        nextMaintenanceDate: newApplianceData.nextMaintenanceDate,
        notes: newApplianceData.notes,
      });
      
      setAppliances(prev => [...prev, createdAppliance]);
      toast({
        title: "Appliance Added",
        description: `${createdAppliance.name} has been added successfully!`,
      });
    } catch (error) {
      console.error('Failed to add appliance:', error);
      toast({
        title: "Error",
        description: "Failed to add appliance. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading appliances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ApplianceTracker
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage warranties, maintenance, and service contacts for all your home electronics
              </p>
            </div>
            <AddApplianceDialog onAddAppliance={handleAddAppliance} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard
              title="Total Appliances"
              value={stats.total}
              description="Devices registered"
              icon={Home}
            />
            <StatCard
              title="Active Warranties"
              value={stats.activeWarranties}
              description="Currently covered"
              icon={Shield}
              iconColor="text-success"
            />
            <StatCard
              title="Expiring Soon"
              value={stats.expiringSoon}
              description="Within 30 days"
              icon={Clock}
              iconColor="text-warning"
            />
            <StatCard
              title="Expired"
              value={stats.expired}
              description="Warranty expired"
              icon={AlertTriangle}
              iconColor="text-destructive"
            />
            <StatCard
              title="Maintenance Due"
              value={stats.maintenanceDue}
              description="Scheduled tasks"
              icon={Wrench}
              iconColor="text-info"
            />
          </div>
        </section>

        {/* Search and Filter */}
        <section className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search appliances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-0 shadow-card"
            />
          </div>
          
          <FilterTabs activeFilter={filter} onFilterChange={setFilter} />
        </section>

        {/* Appliances Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Your Appliances ({filteredAppliances.length})
            </h2>
            <AddApplianceDialog onAddAppliance={handleAddAppliance} />
          </div>
          
          {filteredAppliances.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {searchQuery ? 'No appliances match your search.' : 'No appliances found for this filter.'}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAppliances.map((appliance) => (
                <ApplianceCard
                  key={appliance.id}
                  appliance={appliance}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
