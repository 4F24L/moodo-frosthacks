import { z } from "zod";
import * as adminService from "../services/admin.service.js";

// Validation schemas
const rangeSchema = z.object({
  range: z.string().regex(/^\d+d$/).optional().default("7d")
});

/**
 * GET /admin/summary
 * Get summary statistics for admin dashboard
 */
export const getSummary = async (req, res, next) => {
  try {
    const stats = await adminService.getSummaryStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/user-growth?range=7d
 * Get user registration trend data
 */
export const getUserGrowth = async (req, res, next) => {
  try {
    const validation = rangeSchema.safeParse(req.query);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: validation.error.errors
      });
    }

    const { range } = validation.data;
    const days = parseInt(range.replace('d', ''));

    const data = await adminService.getUserGrowthData(days);
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/mood-trend?range=7d
 * Get mood trend data over time
 */
export const getMoodTrend = async (req, res, next) => {
  try {
    const validation = rangeSchema.safeParse(req.query);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: validation.error.errors
      });
    }

    const { range } = validation.data;
    const days = parseInt(range.replace('d', ''));

    const data = await adminService.getMoodTrendData(days);
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/at-risk-users
 * Get list of at-risk users
 */
export const getAtRiskUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAtRiskUsers();
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/all-users
 * Get all users with their mood data
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (err) {
    next(err);
  }
};
