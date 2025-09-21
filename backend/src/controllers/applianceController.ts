import { Request, Response, NextFunction } from 'express';
import { ApplianceService } from '../services/applianceService';

const applianceService = new ApplianceService();

export class ApplianceController {
  
  async getAllAppliances(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, filter, category, limit, offset } = req.query as any;
      
      const appliances = await applianceService.getAllAppliances({
        search,
        filter,
        category,
        limit,
        offset
      });
      
      res.json({
        success: true,
        data: appliances,
        count: appliances.length
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getApplianceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const appliance = await applianceService.getApplianceById(id);
      
      if (!appliance) {
        return res.status(404).json({
          success: false,
          error: 'Appliance not found'
        });
      }
      
      res.json({
        success: true,
        data: appliance
      });
    } catch (error) {
      next(error);
    }
  }
  
  async createAppliance(req: Request, res: Response, next: NextFunction) {
    try {
      const appliance = await applianceService.createAppliance(req.body);
      
      res.status(201).json({
        success: true,
        data: appliance,
        message: 'Appliance created successfully'
      });
    } catch (error) {
      next(error);
    }
  }
  
  async updateAppliance(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const appliance = await applianceService.updateAppliance(id, req.body);
      
      if (!appliance) {
        return res.status(404).json({
          success: false,
          error: 'Appliance not found'
        });
      }
      
      res.json({
        success: true,
        data: appliance,
        message: 'Appliance updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
  
  async deleteAppliance(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await applianceService.deleteAppliance(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Appliance not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Appliance deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await applianceService.getStatistics();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}