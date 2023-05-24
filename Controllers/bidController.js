const Bid = require('../Models/bidModel');
const User = require('../Models/UserModel');
const createBid = async (req, res, next) => {
  try {
    const { projectId, proposal, amount } = req.body;
    const jobSeekerId = req.userId;

    // Check if the job seeker has already placed a bid on the project
    const existingBid = await Bid.findOne({ project: projectId, jobSeeker: jobSeekerId });
    if (existingBid) {
      return res.status(400).json({ error: 'You have already placed a bid on this project' });
    }

    // Create a new bid
    const bid = new Bid({
      project: projectId,
      jobSeeker: jobSeekerId,
      proposal,
      amount
    });

    await bid.save();
    res.status(201).json(bid);
  } catch (err) {
    next(err);
  }
};


const getBidStatus = async (req, res, next) => {
    try {
      const jobSeekerId = req.userId; // Assuming you have middleware to extract the job seeker's user ID
  
      // Retrieve all bids for the job seeker
      const bids = await Bid.find({ jobSeeker: jobSeekerId }).populate('project');
  
      res.status(200).json(bids);
    } catch (err) {
      next(err);
    }
  };

  const updateBidStatus = async (req, res, next) => {
    try {
      const bidId = req.params.bidId;
      const { status } = req.body;
      const providerId = req.userId;
  
      // Check if the user is a job provider
      const isProvider = await User.findOne({ _id: providerId, role: 'jobProvider' });
      if (!isProvider) {
        return res.status(403).json({ error: 'Access denied. Only job providers can update bid status.' });
      }
  
      // Update the bid status
      const updatedBid = await Bid.findByIdAndUpdate(
        bidId,
        { bidStatus :status },
        { new: true }
      );
  
      if (!updatedBid) {
        return res.status(404).json({ error: 'Bid not found' });
      }
  
      res.status(200).json(updatedBid);
    } catch (err) {
      next(err);
    }
  };
  
  
  module.exports = { 
    createBid,
    getBidStatus,
    updateBidStatus
 };  