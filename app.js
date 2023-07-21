const express = require('express'); // Import the Express module
const bodyParser = require('body-parser'); // Import the body-parser module
const date = require(__dirname + '//date.js'); // Import the date module
const mongoose = require('mongoose'); // Import the mongoose module

const app = express(); // Create an Express application

app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser middleware to parse URL-encoded bodies
app.set('view engine', 'ejs'); // Set the view engine to EJS

main().catch(err => console.log(err)); // Start the main function to connect to the database and handle errors if any

async function main() {
    await mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true }); // Connect to the MongoDB database with the URL

    const itemsSchema = new mongoose.Schema({
        name: String
    }); // Define a schema for items in the database

    const Item = mongoose.model("Item", itemsSchema); // Create a model based on the schema

    async function createDefaultItems() {
        await Item.create({ name: 'buy food' }); // Insert a default item: 'buy food'
        await Item.create({ name: 'cook food' }); // Insert a default item: 'cook food'
        await Item.create({ name: 'eat food' }); // Insert a default item: 'eat food'
    } // Function to create default items if the database is empty

    app.get("/", function (req, res) {
        let day = date.getDate(); // Get the current date from the date module
        Item.find({})
            .then(foundItems => {
                if (foundItems.length === 0) {
                    // If the database is empty, create default items and then fetch all items again
                    return createDefaultItems().then(() => {
                        return Item.find({}); // Fetch all items again after creating defaults
                    });
                } else {
                    return foundItems; // If there are items in the database, return them
                }
            })
            .then(savedItems => {
                res.render("index", {
                    date: day,
                    task: savedItems
                }); // Render the 'index' view with task data and date
            })
            .catch(err => console.log(err)); // Handle any errors that occur during the database operations
    }); // Route for the home page

    app.post("/", function (req, res) {
        var newTask = req.body.newItem; // Get the new task from the request body
        Item.create({ name: newTask }).then(); // Create a new item with the newTask and save it to the database
        res.redirect("/"); // Redirect back to the root URL after adding the new task
    }); // Route for handling new task creation

    app.post("/delete", function (req, res) {
        Item.deleteOne({ _id: req.body.checkbox }).then(); // Delete the item with the given checkbox ID from the database
        res.redirect("/"); // Redirect back to the root URL after deleting the task
    }); // Route for handling task deletion
}

app.listen(3000, function () {
    console.log("App running on port 3000"); // Start the server and listen on port 3000
});
