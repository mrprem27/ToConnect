const Group = require('../models/group');
const User = require('../models/user');

const createGroup = async (req, res) => {
    const data = req.body;
    data.admin = req.userId;
    const newGroup = new Group(data);
    try {
        await newGroup.save();
        await User.findByIdAndUpdate(data.admin, { $push: { GL: newGroup._id } })
        data.userlist.map(async (user) => {
            try {
                await User.findByIdAndUpdate(user, { $push: { GL: newGroup._id } })
            } catch (error) {
                console.log(error.message + " Inside error");
                res.status(409).send({ message: error.message });
            }
        })
        res.status(201).send({ message: "Group created", groupId: newGroup._id });
    } catch (error) {
        res.status(409).send({ message: error.message });
    }
};
const addFriendToGroup = async (req, res) => {
    const { id, idg } = req.params;
    try {
        await User.findByIdAndUpdate(id, { $pull: { GL: idg } });
        await Group.findByIdAndUpdate(idg, { $pull: { userlist: id } });
        const updatedGroup = await Group.findById(idg, 'userlist').populate('userlist', '_id username fullname');
        res.status(200).json(updatedGroup.userlist);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
const fetchGroups = async (req, res) => {
    const id = req.userId;
    try {
        const allGroups = await User.findById(id).populate('GL', '_id fullname type dp');
        res.status(200).json(allGroups.GL);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};
const fetchGroupSingle = async (req, res) => {
    const { idg } = req.params;
    try {
        const group = await Group.findById(idg, '_id fullname admin userlist dp date').populate('admin', '_id username fullname dp').populate('userlist', '_id dp username fullname');
        res.status(200).json({ group, idc: req.userId });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};
const removeFriendToGroup = async (req, res) => {
    const { id, idg } = req.params;
    try {
        await User.findByIdAndUpdate(id, { $pull: { GL: idg } });
        await Group.findByIdAndUpdate(idg, { $pull: { userlist: id } });
        const updatedGroup = await Group.findById(idg, 'userlist').populate('userlist', '_id username fullname dp');
        res.status(200).json(updatedGroup.userlist);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
const editGroupName = async (req, res) => {
    const body = req.body;
    try {
        await Group.findByIdAndUpdate(body.idg, { fullname: body.newData.newName, dp: body.newData.dp });
        res.status(200).send("success!!");
    } catch (error) {
        res.status(404).send(error.message);
    }
}
const fetchForAddToGroup = async (req, res) => {
    const { idg } = req.params;
    const idc = req.userId;
    try {
        const alreadyAdded = await Group.findById(idg, 'userlist');
        const fetchData = await User.findById(idc, 'fl').populate('fl', '_id username fullname dp');
        const hello = alreadyAdded.userlist;
        const world = fetchData.fl;
        const finalValue = world.filter((f) => !hello.includes(f._id));
        res.status(200).json(finalValue);
    } catch (error) {
        res.status(404).send(error.message);
    }
}
const finalSumbitGroupData = async (req, res) => {
    const { finalData, idg } = req.body;
    try {
        finalData.map(async (id) => await User.findByIdAndUpdate(id, { $push: { GL: idg } }));

        await Group.findByIdAndUpdate(idg, { $push: { userlist: { $each: finalData } } });
        const updatedGroup = await Group.findById(idg, 'userlist').populate('userlist', '_id username fullname dp');
        res.status(200).json(updatedGroup.userlist);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
module.exports = { finalSumbitGroupData, fetchForAddToGroup, editGroupName, createGroup, addFriendToGroup, fetchGroups, fetchGroupSingle, removeFriendToGroup };