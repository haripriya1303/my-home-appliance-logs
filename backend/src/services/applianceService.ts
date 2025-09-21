import { db } from '../config/database';
import { appliances } from '../database/schema/appliances';
import { eq, ilike, or, and, desc } from 'drizzle-orm';
import type { InsertAppliance, SelectAppliance } from '../database/schema/appliances';

export class ApplianceService {
  
  async getAllAppliances(filters: {
    search?: string;
    filter?: 'all' | 'active-warranty' | 'expiring-soon';
    category?: string;
    limit?: number;
    offset?: number;
  }) {
    const conditions = [];
    
    // Search functionality
    if (filters.search) {
      conditions.push(
        or(
          ilike(appliances.name, `%${filters.search}%`),
          ilike(appliances.brand, `%${filters.search}%`),
          ilike(appliances.model, `%${filters.search}%`)
        )
      );
    }
    
    // Status filter
    if (filters.filter && filters.filter !== 'all') {
      if (filters.filter === 'active-warranty') {
        conditions.push(eq(appliances.status, 'under-warranty'));
      } else if (filters.filter === 'expiring-soon') {
        conditions.push(eq(appliances.status, 'expiring-soon'));
      }
    }
    
    // Category filter
    if (filters.category) {
      conditions.push(eq(appliances.category, filters.category));
    }
    
    let queryBuilder = db.select().from(appliances);
    
    if (conditions.length > 0) {
      queryBuilder = queryBuilder.where(and(...conditions)) as any;
    }
    
    queryBuilder = queryBuilder.orderBy(desc(appliances.createdAt)) as any;
    
    if (filters.limit) {
      queryBuilder = queryBuilder.limit(filters.limit) as any;
    }
    
    if (filters.offset) {
      queryBuilder = queryBuilder.offset(filters.offset) as any;
    }
    
    return await queryBuilder;
  }
  
  async getApplianceById(id: string): Promise<SelectAppliance | null> {
    const result = await db.select().from(appliances).where(eq(appliances.id, id));
    return result[0] || null;
  }
  
  async createAppliance(applianceData: Omit<InsertAppliance, 'id' | 'createdAt' | 'updatedAt'>): Promise<SelectAppliance> {
    // Calculate status based on warranty expiration
    const warrantyExpDate = new Date(applianceData.warrantyExpiration);
    const today = new Date();
    const monthsUntilExpiry = (warrantyExpDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    let status: 'under-warranty' | 'warranty-expired' | 'expiring-soon';
    if (monthsUntilExpiry < 0) {
      status = 'warranty-expired';
    } else if (monthsUntilExpiry <= 3) {
      status = 'expiring-soon';
    } else {
      status = 'under-warranty';
    }
    
    const newAppliance = {
      ...applianceData,
      status
    };
    
    const result = await db.insert(appliances).values(newAppliance).returning();
    return result[0];
  }
  
  async updateAppliance(id: string, updates: Partial<Omit<InsertAppliance, 'id' | 'createdAt'>>): Promise<SelectAppliance | null> {
    // Recalculate status if warranty expiration is being updated
    if (updates.warrantyExpiration) {
      const warrantyExpDate = new Date(updates.warrantyExpiration);
      const today = new Date();
      const monthsUntilExpiry = (warrantyExpDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      if (monthsUntilExpiry < 0) {
        updates.status = 'warranty-expired';
      } else if (monthsUntilExpiry <= 3) {
        updates.status = 'expiring-soon';
      } else {
        updates.status = 'under-warranty';
      }
    }
    
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    
    const result = await db.update(appliances)
      .set(updateData)
      .where(eq(appliances.id, id))
      .returning();
      
    return result[0] || null;
  }
  
  async deleteAppliance(id: string): Promise<boolean> {
    const result = await db.delete(appliances).where(eq(appliances.id, id)).returning();
    return result.length > 0;
  }
  
  async getStatistics() {
    const allAppliances = await db.select().from(appliances);
    
    return {
      total: allAppliances.length,
      activeWarranties: allAppliances.filter(a => a.status === 'under-warranty').length,
      expiringSoon: allAppliances.filter(a => a.status === 'expiring-soon').length,
      maintenanceDue: allAppliances.filter(a => a.nextMaintenanceDate !== null).length
    };
  }
}