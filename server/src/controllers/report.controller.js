import Report from '../models/Report.js';

export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find({}).sort({ createdAt: -1 }).select('-content');
    res.json({ success: true, data: reports });
  } catch (err) { next(err); }
};

export const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (err) { next(err); }
};
