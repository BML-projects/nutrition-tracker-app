import { Request, Response } from "express";
import Report from "../models/Report.model";
import User from "../models/User.model";

// Get Reports with populated user data
export const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await Report.find()
      .populate("user", "fullname email")
      .sort({ timestamp: -1 });

    const formattedReports = reports.map(report => ({
      _id: report._id,
      userName: (report.user as any)?.fullname || "Unknown User",
      userEmail: (report.user as any)?.email || "unknown@email.com",
      type: report.type,
      description: report.description,
      foodName: report.foodName,
      imageUri: report.imageUri,
      status: report.status,
      timestamp: report.timestamp
    }));

    res.json(formattedReports);
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

    if (!["pending", "solved", "spam"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    res.json({ 
      success: true, 
      message: "Report status updated successfully",
      report 
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

    const report = await Report.findByIdAndDelete(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

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

// Create Report (for users to submit reports)
export const createReport = async (req: Request, res: Response) => {
  try {
    const { type, description, foodName, imageUri } = req.body;
    const userId = (req as any).user?._id; // Assuming you have user middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const report = new Report({
      user: userId,
      type,
      description,
      foodName,
      imageUri,
      status: "pending"
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit report"
    });
  }
};

export { getReports as default };