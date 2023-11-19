//creating express app
const express = require("express");
const app = express();

const ejs = require("ejs");
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));

//defining location of static files - now directly specify staic files location after static folder
app.use(express.static("static"));

//setting default view engine
app.set('view engine', 'ejs');

//declare a globar array var-to store all notes
let notes = [];

//rendering pages
app.get("/", function (req, res) {
    res.render("home", {
        pageName: "Home",
        notes: notes      //notes var not string-so without quotes
    })
})
app.get("/home", function (req, res) {
    //when a request for homepage is arrived redirect it index page- /
    res.redirect("/");
})
app.get("/compose", function (req, res) {
    res.render("compose", { pageName: "Compose" })
})
app.get("/about", function (req, res) {
    res.render("about", { pageName: "About Us" })
})
app.get("/contact", function (req, res) {
    res.render("contact", { pageName: "Contact Us" })
})

//new notes
app.post("/compose", function (req, res) {
    var newNote = new Notes({
        title: req.body.title,
        description: req.body.description
    });
    
    //push this new note to array
    notes.push(newNote)
    newNote.save()
    .then(() => {
      console.log('New note saved');
      res.redirect('/');
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error saving new note');
    });
});

//to search a particular note
app.get("/notes/:notesName", function (req, res) {   //this means url- /newNotes/title
    var foundNote;
    //storing title from url 
    const requestedTitle = req.params.notesName.toLowerCase();

    notes.forEach(function (newNote) {    //newNote is each array notes item
        const storedTitle = newNote.title.toLowerCase();   //storing title from individual array item

        if (storedTitle === requestedTitle) {
            foundNote = newNote;  // Set the foundNote variable
        }
    });

    if (foundNote) {
        res.render("newNote", {
            title: foundNote.title,
            description: foundNote.description
        });
    } else {
        // Handle case where note with requested title is not found
        res.status(404).send('Note not found');
    }
});

//listening server
app.listen(3000, function (req, res) {
    console.log("Server started successfully")
})


//database related
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/dailyNotesDB", { useNewUrlParser: true });

//schema
const notesSchema = new mongoose.Schema({
    title: String,
    description: String
})
//model
const Notes = mongoose.model("Notes", notesSchema);

// Notes.find({}).exec((err, notes) => {
//     if (err) {
//         console.error(err);
//     } else {
//         res.render("list", { notes });
//     }
// });


