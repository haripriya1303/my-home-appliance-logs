import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WarrantyFilter } from "@/types/appliance";

interface FilterTabsProps {
  activeFilter: WarrantyFilter;
  onFilterChange: (filter: WarrantyFilter) => void;
}

export const FilterTabs = ({ activeFilter, onFilterChange }: FilterTabsProps) => {
  return (
    <Tabs value={activeFilter} onValueChange={(value) => onFilterChange(value as WarrantyFilter)}>
      <TabsList className="grid w-full grid-cols-3 bg-accent/50 backdrop-blur-sm">
        <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          All
        </TabsTrigger>
        <TabsTrigger value="active-warranty" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">
          Active Warranty
        </TabsTrigger>
        <TabsTrigger value="expiring-soon" className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground">
          Expiring Soon
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};