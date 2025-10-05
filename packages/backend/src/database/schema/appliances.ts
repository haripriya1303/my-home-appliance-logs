import { pgTable, uuid, varchar, text, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const applianceStatusEnum = pgEnum('appliance_status', [
  'under-warranty',
  'warranty-expired', 
  'expiring-soon'
]);

export const appliances = pgTable('appliances', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 100 }).notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  serialNumber: varchar('serial_number', { length: 100 }).notNull().unique(),
  category: varchar('category', { length: 50 }).notNull(),
  location: varchar('location', { length: 100 }).notNull(),
  purchaseDate: date('purchase_date').notNull(),
  warrantyExpiration: date('warranty_expiration').notNull(),
  nextMaintenanceDate: date('next_maintenance_date'),
  status: applianceStatusEnum('status').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type InsertAppliance = typeof appliances.$inferInsert;
export type SelectAppliance = typeof appliances.$inferSelect;