import Region from '../models/Region.js';

export const getRegions = async (req, res, next) => {
  try {
    const regions = await Region.find({}).sort({ name: 1 });
    res.json({ success: true, data: regions });
  } catch (err) {
    next(err);
  }
};

export const getRegionByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const region = await Region.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { state: { $regex: new RegExp(`^${name}$`, 'i') } },
      ],
    });

    if (!region) {
      return res.status(404).json({ success: false, message: 'Region not found' });
    }

    res.json({ success: true, data: region });
  } catch (err) {
    next(err);
  }
};
