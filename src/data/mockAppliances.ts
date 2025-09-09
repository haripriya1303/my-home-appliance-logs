import { Appliance } from "@/types/appliance";

export const mockAppliances: Appliance[] = [
  {
    id: "1",
    name: "Kitchen Refrigerator",
    brand: "Samsung",
    model: "RF23M8070SR",
    serialNumber: "23456789",
    category: "Kitchen",
    location: "Kitchen",
    purchaseDate: "2022-03-14",
    warrantyExpiration: "2024-03-14",
    nextMaintenanceDate: "2024-02-14",
    status: "expiring-soon",
    notes: "Energy Star certified"
  },
  {
    id: "2", 
    name: "Living Room TV",
    brand: "LG",
    model: "OLED55C1PUB",
    serialNumber: "87654321",
    category: "Electronics",
    location: "Living Room",
    purchaseDate: "2020-11-19",
    warrantyExpiration: "2022-11-19",
    status: "warranty-expired",
    notes: "4K OLED display"
  },
  {
    id: "3",
    name: "Washing Machine", 
    brand: "Whirlpool",
    model: "WTW4816FW",
    serialNumber: "56789123",
    category: "Laundry",
    location: "Laundry Room",
    purchaseDate: "2024-06-09",
    warrantyExpiration: "2026-06-09",
    nextMaintenanceDate: "2024-06-09",
    status: "under-warranty",
    notes: "Top load washer"
  },
  {
    id: "4",
    name: "Microwave Oven",
    brand: "Panasonic",
    model: "NN-SN686S",
    serialNumber: "89123456", 
    category: "Kitchen",
    location: "Kitchen",
    purchaseDate: "2023-01-14",
    warrantyExpiration: "2025-01-14",
    status: "under-warranty",
    notes: "Inverter technology"
  }
];