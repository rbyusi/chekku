const express = require('express')
const router = express.Router()
const tempJSON = require('../../data/temp.txt')
const fetch  = require('node-fetch')
const asana = require('asana')



//Receive order webhook POST request for new order
router.post('/', (req, res) =>{
    let task_gid
    const uri = "https://app.asana.com/api/1.0/tasks"
    const newOrder = req.body
    const newTask = {
      "data": {
        'name': 'Order -' +   newOrder.name  + '- Ryan Yusi',
        "approval_status": "pending",
        "assignee_status": "upcoming",
        "completed": false,
        "due_at": "2020-09-15T02:06:58.147Z",
        "external": {
          "data": "A blob of information"
        },
        "html_notes": "<body>Mittens <em>really</em> likes the stuff from Humboldt.</body>",
        "liked": true,
        "notes": "Mittens really likes the stuff from Humboldt.",
        "resource_subtype": "default_task",
        "assignee": "1166576348228021",
        "projects": "1166719723537354",
    
        "workspace": "1165910526209201"
      }
    }

    let postTask = {  
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 1/1166576348228021:547169b6b8c06f866e90aeeb4226b3c0',
        'Host': 'app.asana.com'
      },
      body: JSON.stringify(newTask)}
    fetch(uri,postTask)
    .then(response => response.json())
    .then(data => {
      task_gid = data.data.gid
      console.log(task_gid)
      newOrder.line_items.forEach((item,index) => {
        let newSubTask = {
           "data": {
             "name": `${item.fulfillable_quantity} x  ${item.name}`,
             "approval_status": "pending",
             "assignee_status": "upcoming",
             "completed": false,
           
             "due_at": "2020-09-15T02:06:58.147Z",
             "external": {
               "gid": `${task_gid}`,
               "data": "A blob of information"
             },
             "assignee": "1166576348228021",
             "workspace": "1165910526209201"
           }
         }
         let postSubTask = {  
           method: 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
             'Authorization': 'Bearer 1/1166576348228021:547169b6b8c06f866e90aeeb4226b3c0',
             'Host': 'app.asana.com'
           },
           body: JSON.stringify(newSubTask)}

         fetch(`https://app.asana.com/api/1.0/tasks/${task_gid}/subtasks`,postSubTask)
         .then(response=>response.json)
         .then((data)=>{console.log(data.data)})
         .catch((error) => {
          console.error('There has been a problem with your fetch operation:', error);
        });
       })
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });

    
   //client.users.me()
  //.then(function(me) {
    // Print out your information
    //console.log('Hello world! ' + 'My name is ' + me.name + '!');
    
    res.status(200).send()
  //})
});

//fetch webhook from shopify (post)
//format and store needed details into a variable (json?) for task and json araw for sub task?
//post a request to asana api to create new task
//wait for the response from asana and store the task_gid in a variable
//make another api call with to asana to create subtask/s using task gid and subtask variable (from the formatted json from webhooks)

module.exports = router;