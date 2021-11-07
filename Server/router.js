const express = require('express');
const router = express.Router();
const Message = require('./models/message');
router.get('/', async (req, res) => {
    // const temp = {
    //     sendername: '231',
    //     sender: '156454',
    //     message: 'scsdcsc'
    // }
    // const shit=new Message(temp);
    // const saved = await shit.save();
    res.send('server');
});

module.exports = router;