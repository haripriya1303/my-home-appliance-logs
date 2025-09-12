import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Home, Shield, Clock, Wrench } from "lucide-react";
import { ApplianceCard } from "@/components/ApplianceCard";
import { StatCard } from "@/components/StatCard";
import { FilterTabs } from "@/components/FilterTabs";
import { AddApplianceDialog } from "@/components/AddApplianceDialog";
import { mockAppliances } from "@/data/mockAppliances";
import { WarrantyFilter, Appliance } from "@/types/appliance";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [appliances, setAppliances] = useState<Appliance[]>(mockAppliances);
  const [filter, setFilter] = useState<WarrantyFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      default:
        return true;
    }
  });

  const stats = {
    total: appliances.length,
    activeWarranties: appliances.filter(a => a.status === 'under-warranty').length,
    expiringSoon: appliances.filter(a => a.status === 'expiring-soon').length,
    maintenanceDue: appliances.filter(a => a.nextMaintenanceDate).length
  };

  const handleViewDetails = (id: string) => {
    toast({
      title: "Appliance Details",
      description: `Viewing details for appliance ${id}`,
    });
  };

  const handleAddAppliance = (newAppliance: Appliance) => {
    setAppliances(prev => [...prev, newAppliance]);
    toast({
      title: "Appliance Added",
      description: `${newAppliance.name} has been added successfully!`,
    });
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
