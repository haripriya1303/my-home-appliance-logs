import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Custom date string transformer that converts empty strings to undefined
const dateStringOrNull = z.string().transform((val) => {
  if (val === '' || val === null || val === undefined) {
    return undefined;
  }
  return val;
}).optional();

export const createApplianceSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  brand: z.string().min(1, "Brand is required").max(100),
  model: z.string().min(1, "Model is required").max(100),
  serialNumber: z.string().min(1, "Serial number is required").max(100),
  category: z.string().min(1, "Category is required").max(50),
  location: z.string().min(1, "Location is required").max(100),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  warrantyExpiration: z.string().min(1, "Warranty expiration is required"),
  nextMaintenanceDate: dateStringOrNull,
  notes: z.string().transform((val) => val === '' ? undefined : val).optional()
});

export const updateApplianceSchema = createApplianceSchema.partial();

export const queryParamsSchema = z.object({
  search: z.string().optional(),
  filter: z.enum(['all', 'active-warranty', 'expiring-soon']).optional(),
  status: z.enum(['active', 'expiring-soon', 'expired']).optional(),
  category: z.string().optional(),
  limit: z.coerce.number().positive().max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
  includeCounts: z.coerce.boolean().optional()
});

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.issues
        });
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: error.issues
        });
      }
      next(error);
    }
  };
};