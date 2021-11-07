const User = require('../models/user');
//test
const fetchRequests = async (req, res) => {
    const idc = req.userId;
    try {
        const allRequests = await User.findById(idc,'rl').populate('rl','_id username fullname dp');
        res.status(200).json(allRequests.rl);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};
module.exports = { fetchRequests };