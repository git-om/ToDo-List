const express = require('express'); // Import the Express module
const bodyParser = require('body-parser'); // Import the body-parser module
const date = require(__dirname + '//date.js'); // Import the date module
const app = express(); // Create an Express application

app.use(express.static('public')); // Serve static files from the 'public' directory

app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser middleware to parse URL-encoded bodies

app.set('view engine', 'ejs'); // Set the view engine to EJS

const tasks = ["read", "code"]; // Initialize an array of tasks

app.get("/", function (req, res) {
    let day = date.getDate(); // Get the current date from the date module
    res.render('index', { task: tasks, date: day }); // Render the 'index' view with task data and date
})

app.post("/", function (req, res) {
    var newTask = req.body.newItem; // Get the new task from the request body
    tasks.push(newTask); // Add the new task to the tasks array
    res.redirect("/"); // Redirect back to the root URL
})

app.listen(3000, function () { // Start the server and listen on port 3000
    console.log("App running on port 3000");
})
