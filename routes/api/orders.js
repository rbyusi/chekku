const express = require('express')
const router = express.Router()
const tempJSON = require('../../data/temp.txt')
const fetch  = require('node-fetch')
const asana = require('asana')

const createNewTask = async (orderNumber,url)=>{
  let newTask = {
    "data": {
      'name': 'Order -' +   orderNumber  + '- Ryan Yusi',
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

    //return fetch(url,postTask);
    try {
    let response = await fetch(url,postTask)
    let data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
  
}

const createNewSubtask = async (url,taskGID,itemQuantity, itemName)=>{
  let newSubTask = {
        "data": {
          //"name": `${item.fulfillable_quantity} x  ${item.name}`,
          "name": `${itemQuantity} x ${itemName}`,
          "approval_status": "pending",
          "assignee_status": "upcoming",
          "completed": false,
        
          "due_at": "2020-09-15T02:06:58.147Z",
          "external": {
            "gid": `${taskGID}`,
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

        try {
          let response = await fetch(url + `/${taskGID}/subtasks`,postSubTask)
          let data = await response.json()
          return data
        } catch (error) {
          console.log(error)
        }
}

//Receive order webhook POST request for new order
router.post('/', async (req, res) =>{
  let subTasks
  const uri = "https://app.asana.com/api/1.0/tasks"
  const newOrder = req.body

  //create new task and get the taskGID
  // await createNewTask(newOrder.name,uri) 
  // .then((data)=>{ 
  //   taskGID = data.data.gid})
  
  // We don't need to use `then` anymore with await
  const taskResponse = await createNewTask(newOrder.name,uri);
 // console.log(taskResponse.json)
  const taskGID = taskResponse.data.gid;

  // Loop through lineItems to create an array of fetch Promises
  const subtaskCreationPromises = newOrder.line_items.map(item => {
    return createNewSubtask(uri,taskGID,item.fulfillable_quantity,item.name)
  })
console.log(subtaskCreationPromises)
  // wait for all fetch Promises to resolve
  await Promise.all(subtaskCreationPromises)

    
    res.status(200).send("all good")

});

//fetch webhook from shopify (post)
//format and store needed details into a variable (json?) for task and json araw for sub task?
//post a request to asana api to create new task
//wait for the response from asana and store the task_gid in a variable
//make another api call with to asana to create subtask/s using task gid and subtask variable (from the formatted json from webhooks)

module.exports = router;