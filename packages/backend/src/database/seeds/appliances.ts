import { db } from '../../config/database';
import { appliances } from '../schema/appliances';

const seedData = [
  {
    name: "Kitchen Refrigerator",
    brand: "Samsung",
    model: "RF23M8070SR",
    serialNumber: "23456789",
    category: "Kitchen",
    location: "Kitchen",
    purchaseDate: "2022-03-14",
    warrantyExpiration: "2024-03-14",
    nextMaintenanceDate: "2024-02-14",
    status: "expiring-soon" as const,
    notes: "Energy Star certified"
  },
  {
    name: "Living Room TV",
    brand: "LG",
    model: "OLED55C1PUB",
    serialNumber: "87654321",
    category: "Electronics",
    location: "Living Room",
    purchaseDate: "2020-11-19",
    warrantyExpiration: "2022-11-19",
    status: "warranty-expired" as const,
    notes: "4K OLED display"
  },
  {
    name: "Washing Machine",
    brand: "Whirlpool",
    model: "WTW4816FW",
    serialNumber: "56789123",
    category: "Laundry",
    location: "Laundry Room",
    purchaseDate: "2024-06-09",
    warrantyExpiration: "2026-06-09",
    nextMaintenanceDate: "2025-03-09",
    status: "under-warranty" as const,
    notes: "Top load washer"
  },
  {
    name: "Microwave Oven",
    brand: "Panasonic",
    model: "NN-SN686S",
    serialNumber: "89123456",
    category: "Kitchen",
    location: "Kitchen",
    purchaseDate: "2023-01-14",
    warrantyExpiration: "2025-01-14",
    status: "under-warranty" as const,
    notes: "Inverter technology"
  },
  {
    name: "Central Air Conditioner",
    brand: "Carrier",
    model: "24ABC636A003",
    serialNumber: "AC789123",
    category: "HVAC",
    location: "Basement",
    purchaseDate: "2023-05-20",
    warrantyExpiration: "2028-05-20",
    nextMaintenanceDate: "2024-11-20",
    status: "under-warranty" as const,
    notes: "16 SEER rating, 3-ton capacity"
  },
  {
    name: "Gas Dryer",
    brand: "Maytag",
    model: "MGDC465HW",
    serialNumber: "DRY456789",
    category: "Laundry",
    location: "Laundry Room",
    purchaseDate: "2021-08-15",
    warrantyExpiration: "2022-08-15",
    status: "warranty-expired" as const,
    notes: "7.0 cu ft capacity"
  },
  {
    name: "Robot Vacuum",
    brand: "iRobot",
    model: "Roomba j7+",
    serialNumber: "ROB987654",
    category: "Cleaning",
    location: "Living Room",
    purchaseDate: "2024-01-10",
    warrantyExpiration: "2025-01-10",
    nextMaintenanceDate: "2024-10-10",
    status: "under-warranty" as const,
    notes: "Self-emptying base"
  },
  {
    name: "Outdoor Grill",
    brand: "Weber",
    model: "Genesis II E-335",
    serialNumber: "GRL123456",
    category: "Outdoor",
    location: "Patio",
    purchaseDate: "2022-06-01",
    warrantyExpiration: "2024-06-01",
    status: "expiring-soon" as const,
    notes: "3-burner gas grill with side burner"
  },
  {
    name: "Dishwasher",
    brand: "Bosch",
    model: "SHPM88Z75N",
    serialNumber: "DW234567",
    category: "Kitchen",
    location: "Kitchen",
    purchaseDate: "2023-09-12",
    warrantyExpiration: "2025-09-12",
    nextMaintenanceDate: "2024-12-12",
    status: "under-warranty" as const,
    notes: "Third rack, 44 dBA quiet"
  },
  {
    name: "Home Theater System",
    brand: "Sony",
    model: "STR-DH790",
    serialNumber: "HT345678",
    category: "Entertainment",
    location: "Living Room",
    purchaseDate: "2021-03-22",
    warrantyExpiration: "2022-03-22",
    status: "warranty-expired" as const,
    notes: "7.2 channel surround sound"
  }
];

export async function seedAppliances() {
  try {
    console.log('🌱 Starting to seed appliances...');
    
    // Clear existing data
    await db.delete(appliances);
    console.log('🗑️ Cleared existing appliance data');
    
    // Insert seed data
    const result = await db.insert(appliances).values(seedData).returning();
    console.log(`✅ Successfully seeded ${result.length} appliances`);
    
    return result;
  } catch (error) {
    console.error('❌ Error seeding appliances:', error);
    throw error;
  }
}