const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
require('dotenv').config()
const logger = require('../../middleware/logger_w')


const createNewTask = async (orderNumber, url) => {
  const newTask = {
    data: {
      name: "Order -" + orderNumber + "- Ryan Yusi",
      approval_status: "pending",
      assignee_status: "upcoming",
      completed: false,
      due_at: "2020-09-15T02:06:58.147Z",
      external: {
        data: "A blob of information",
      },
      html_notes:
        "<body>Mittens <em>really</em> likes the stuff from Humboldt.</body>",
      liked: true,
      notes: "Mittens really likes the stuff from Humboldt.",
      resource_subtype: "default_task",
      assignee: process.env.ENV_ASIGNEE,
      projects: process.env.ENV_PROJECT,

      workspace: process.env.ENV_WORKSPACE,
    },
  };

  const postTask = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        process.env.ENV_TOKEN,
      Host: "app.asana.com",
    },
    body: JSON.stringify(newTask),
  };

  return fetch(url, postTask);
};

const createNewSubtask = (url, taskGID, itemQuantity, itemName) => {
  let newSubTask = {
    data: {
      //"name": `${item.fulfillable_quantity} x  ${item.name}`,
      name: `${itemQuantity} x ${itemName}`,
      approval_status: "pending",
      assignee_status: "upcoming",
      completed: false,

      due_at: "2020-09-15T02:06:58.147Z",
      // Need to figure out what this does, maybe we don't need it
      // external: {
      //   gid: `${taskGID}`,
      //   data: "A blob of information",
      // },
      assignee: process.env.ENV_ASIGNEE,
      workspace: process.env.ENV_WORKSPACE,
    },
  };
  let postSubTask = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        process.env.ENV_TOKEN,
      Host: "app.asana.com",
    },
    body: JSON.stringify(newSubTask),
  };

  // Just return the promise, don't bother waiting here
  return fetch(url + `/${taskGID}/subtasks`, postSubTask);
};

//Receive order webhook POST request for new order
router.post("/", async (req, res) => {
  const uri = "https://app.asana.com/api/1.0/tasks";
  const newOrder = req.body;
  let taskResponse;

  try {
    taskResponse = await createNewTask(newOrder.name, uri);
  } catch (e) {
    console.error(e);
    res.status(500).send("some error");
  }
  const taskData = await taskResponse.json();
  const taskGID = taskData.data.gid;

  // Loop through lineItems to create an array of fetch Promises
  const subtaskCreationPromises = newOrder.line_items.map((item) => {
    const subTask = createNewSubtask(
      uri,
      taskGID,
      item.fulfillable_quantity,
      item.name
    );
    return subTask;
  });

  try {
    // wait for all fetch Promises to create subtasks resolve
    await Promise.all(subtaskCreationPromises);
    res.status(200).send("all good");
  } catch (e) {
    //console.error(e);
    console.log(error(e))
    res.status(500).send("some error");
  }
});

//fetch webhook from shopify (post)
//format and store needed details into a variable (json?) for task and json araw for sub task?
//post a request to asana api to create new task
//wait for the response from asana and store the task_gid in a variable
//make another api call with to asana to create subtask/s using task gid and subtask variable (from the formatted json from webhooks)

module.exports = router;
