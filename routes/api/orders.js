const express = require('express');
const router = express.Router();
const tempJSON = require('../../data/temp.txt');


//Receive order webhook POST request for new order
router.post('/', (req, res) =>{
    const newOrder = {
        name: "Order - " + req.body.name + " - Ryan Yusi",
        workspace: "1165910526209201",
        assignee: "1166576348228021"


    }
    res.status(200).send(newOrder)
});

module.exports = router;