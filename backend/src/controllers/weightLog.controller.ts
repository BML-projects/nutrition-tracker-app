import { Request, Response } from 'express';
import WeightLog from '../models/WeightLog';
import User from '../models/User.model';

interface AuthRequest extends Request {
  userId?: string;
}

// ==================== LOG WEIGHT ====================
export const logWeight = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { weight, date } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }

    if (!weight || weight <= 0) {
      res.status(400).json({
        success: false,
        error: 'Valid weight is required'
      });
      return;
    }

    const logDate = date ? new Date(date) : new Date();
    logDate.setHours(0, 0, 0, 0);

    // Check if log already exists for this date
    const existingLog = await WeightLog.findOne({
      userId,
      date: logDate
    });

    if (existingLog) {
      // Update existing log
      existingLog.weight = weight;
      await existingLog.save();

      res.json({
        success: true,
        message: 'Weight updated successfully',
        weightLog: existingLog
      });
    } else {
      // Create new log
      const newLog = new WeightLog({
        userId,
        weight,
        date: logDate
      });

      await newLog.save();

      res.json({
        success: true,
        message: 'Weight logged successfully',
        weightLog: newLog
      });
    }

  } catch (error) {
    console.error('❌ Log weight error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log weight'
    });
  }
};

// ==================== GET ALL WEIGHT LOGS ====================
export const getAllWeightLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }

    const logs = await WeightLog.find({ userId }).sort({ date: -1 });

    res.json({
      success: true,
      logs
    });

  } catch (error) {
    console.error('❌ Get weight logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weight logs'
    });
  }
};

// ==================== DELETE WEIGHT LOG ====================
export const deleteWeightLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { logId } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }

    const log = await WeightLog.findOne({
      _id: logId,
      userId
    });

    if (!log) {
      res.status(404).json({
        success: false,
        error: 'Weight log not found'
      });
      return;
    }

    await log.deleteOne();

    res.json({
      success: true,
      message: 'Weight log deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete weight log error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete weight log'
    });
  }
};