import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Meal from "../models/Meal";
import User from "../models/User.model";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Admin#@123";

// Admin Login
export const adminLogin = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ 
      success: false, 
      message: "Invalid admin credentials" 
    });
  }

  const token = jwt.sign(
    { email, role: "admin" },
    process.env.JWT_ADMIN_SECRET as string,
    { expiresIn: "7d" }
  );

  res.json({ success: true, token });
};

// Get Dashboard Statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMealsSaved = await Meal.countDocuments();
    
    // Get total scans (assuming each meal is a scan)
    const totalScans = totalMealsSaved;
    
    // Get today's scans
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayScans = await Meal.countDocuments({
      timestamp: { $gte: today }
    });

    // Active meals (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeMeals = await Meal.countDocuments({
      timestamp: { $gte: sevenDaysAgo }
    });
    
    // Get total calories tracked
    const calorieAggregation = await Meal.aggregate([
      {
        $group: {
          _id: null,
          totalCalories: { $sum: "$calories" }
        }
      }
    ]);
    const totalCaloriesTracked = calorieAggregation[0]?.totalCalories || 0;

    // Calculate average calories per user
    const avgCaloriesPerUser = totalUsers > 0 
      ? Math.round(totalCaloriesTracked / totalUsers) 
      : 0;

    // Calculate user growth (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const previousUsers = await User.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });
    
    const userGrowth = previousUsers > 0 
      ? Math.round(((recentUsers - previousUsers) / previousUsers) * 100)
      : 100;

    // Calculate meal growth (last 7 days vs previous 7 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentMeals = await Meal.countDocuments({
      timestamp: { $gte: sevenDaysAgo }
    });
    const previousMeals = await Meal.countDocuments({
      timestamp: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
    });

    const mealGrowth = previousMeals > 0
      ? Math.round(((recentMeals - previousMeals) / previousMeals) * 100)
      : 100;

    // Calculate scan growth (same as meal growth)
    const scanGrowth = mealGrowth;

    res.json({
      totalUsers,
      totalScans,
      totalMealsSaved,
      todayScans,
      activeMeals,
      totalCaloriesTracked,
      avgCaloriesPerUser,
      userGrowth: Math.max(0, userGrowth),
      mealGrowth: Math.max(0, mealGrowth),
      scanGrowth: Math.max(0, scanGrowth)
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch statistics" 
    });
  }
};

// Get Most Scanned Foods
export const getMostScannedFoods = async (req: Request, res: Response) => {
  try {
    const mostScanned = await Meal.aggregate([
      {
        $group: {
          _id: "$foodName",
          scanCount: { $sum: 1 },
          lastScanned: { $max: "$timestamp" }
        }
      },
      {
        $sort: { scanCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          foodName: "$_id",
          scanCount: 1,
          lastScanned: 1,
          _id: 0
        }
      }
    ]);

    res.json(mostScanned);
  } catch (error) {
    console.error("Error fetching most scanned foods:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch most scanned foods" 
    });
  }
};

// Get Recent Meals
export const getRecentMeals = async (req: Request, res: Response) => {
  try {
    const meals = await Meal.find()
      .populate("user", "fullname email")
      .sort({ timestamp: -1 })
      .limit(100);

    const formattedMeals = meals.map(meal => ({
      _id: meal._id,
      userName: (meal.user as any)?.fullname || "Unknown User",
      userEmail: (meal.user as any)?.email || "unknown@email.com",
      foodName: meal.foodName,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fat,
      mealType: meal.mealType,
      timestamp: meal.timestamp,
      imageUri: meal.imageUri,
      confidence: 0.85, // Mock confidence - add to your Meal model if needed
      usdaMatched: meal.foodName // Mock USDA match - add to your model if needed
    }));

    res.json(formattedMeals);
  } catch (error) {
    console.error("Error fetching recent meals:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch meals" 
    });
  }
};

// Get All Users with Stats
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const mealsCount = await Meal.countDocuments({ user: user._id });
        
        const scanCount = mealsCount; // Each meal is a scan
        
        const calorieSum = await Meal.aggregate([
          { $match: { user: user._id } },
          { $group: { _id: null, total: { $sum: "$calories" } } }
        ]);
        
        const totalCalories = calorieSum[0]?.total || 0;

        // Get last activity
        const lastMeal = await Meal.findOne({ user: user._id })
          .sort({ timestamp: -1 })
          .select("timestamp");

        return {
          _id: user._id,
          name: user.fullname,
          email: user.email,
          mealsCount,
          totalScans: scanCount,
          totalCalories,
          isBlocked: false, // Add this field to User model if needed
          joinedDate: (user as any).createdAt || new Date(),
          lastActive: lastMeal?.timestamp || (user as any).createdAt || new Date()
        };
      })
    );

    res.json(usersWithStats);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch users" 
    });
  }
};

// Block/Unblock User
export const blockUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    // Note: Add isBlocked field to your User model
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({ 
      success: true, 
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user 
    });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update user status" 
    });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Delete all meals associated with the user
    await Meal.deleteMany({ user: userId });
    
    // Delete the user
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "User and associated meals deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete user" 
    });
  }
};

// Delete Meal
export const deleteMeal = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;
    
    const meal = await Meal.findByIdAndDelete(mealId);
    
    if (!meal) {
      return res.status(404).json({ 
        success: false, 
        message: "Meal not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Meal deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete meal" 
    });
  }
};

// Get Food Recognition Logs (Mock - implement based on your needs)
export const getRecognitionLogs = async (req: Request, res: Response) => {
  try {
    // Mock data - implement according to your recognition logging system
    const logs = await Meal.find()
      .populate("user", "fullname")
      .sort({ timestamp: -1 })
      .limit(50);

    const formattedLogs = logs.map(log => ({
      _id: log._id,
      userName: (log.user as any)?.fullname || "Unknown User",
      imageUri: log.imageUri,
      detectedFood: log.foodName,
      confidence: 0.85, // Add to your model
      usdaMatched: log.foodName, // Add to your model
      timestamp: log.timestamp,
      isCorrect: undefined, // Add to your model for tracking
      adminOverride: undefined // Add to your model for overrides
    }));

    res.json(formattedLogs);
  } catch (error) {
    console.error("Error fetching recognition logs:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch recognition logs" 
    });
  }
};

// Override Recognition Mapping
export const overrideMapping = async (req: Request, res: Response) => {
  try {
    const { logId } = req.params;
    const { correctMapping } = req.body;

    // Update meal with admin override
    // Note: Add adminOverride field to Meal model
    const meal = await Meal.findByIdAndUpdate(
      logId,
      { adminOverride: correctMapping },
      { new: true }
    );

    if (!meal) {
      return res.status(404).json({ 
        success: false, 
        message: "Recognition log not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Mapping overridden successfully",
      meal 
    });
  } catch (error) {
    console.error("Error overriding mapping:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to override mapping" 
    });
  }
};

// Get Reports (Mock - create Report model for this)
export const getReports = async (req: Request, res: Response) => {
  try {
    // Mock data - create a Report model in your database
    const mockReports: never[] = [];
    
    res.json(mockReports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch reports" 
    });
  }
};

// Update Report Status
export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    // Implement with Report model
    res.json({ 
      success: true, 
      message: "Report status updated successfully" 
    });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update report" 
    });
  }
};

// Delete Report
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;

    // Implement with Report model
    res.json({ 
      success: true, 
      message: "Report deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete report" 
    });
  }
};

// Get Analytics Data
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    // Scans per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const scansPerDay = await Meal.aggregate([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } 
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    // Top foods
    const topFoods = await Meal.aggregate([
      {
        $group: {
          _id: "$foodName",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          name: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    // Average calories per day
    const avgCaloriesAgg = await Meal.aggregate([
      {
        $group: {
          _id: { 
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } 
          },
          totalCalories: { $sum: "$calories" }
        }
      },
      {
        $group: {
          _id: null,
          avgCaloriesPerDay: { $avg: "$totalCalories" }
        }
      }
    ]);

    const avgCaloriesPerDay = avgCaloriesAgg[0]?.avgCaloriesPerDay || 0;

    // Most active users
    const mostActiveUsers = await Meal.aggregate([
      {
        $group: {
          _id: "$user",
          scans: { $sum: 1 }
        }
      },
      {
        $sort: { scans: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Populate user names
    const populatedUsers = await User.populate(mostActiveUsers, {
      path: "_id",
      select: "fullname"
    });

    const formattedActiveUsers = populatedUsers.map((item: any) => ({
      name: item._id?.fullname || "Unknown User",
      scans: item.scans
    }));

    res.json({
      scansPerDay,
      topFoods,
      avgCaloriesPerDay: Math.round(avgCaloriesPerDay),
      mostActiveUsers: formattedActiveUsers
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch analytics" 
    });
  }
};