var express     = require("express"),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    seedDB      = require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp",{
    useMongoClient: true,
});

// Campground.create(
//     {
//         name : "Freeman Creek", 
//         image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjMfn2nukABuJd76nQVG-TUlx_5f49lV4HQAikPl3EtmQ37CyYlw",
//         description: "This is a huge granite hill, Just amazing"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         }else{
//             console.log("Newly Created Campground");
//             console.log(campground);
//         }
// });


app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    // res.send("This will soon  be landing page");
    // res.render("landing")
    res.redirect("/campgrounds")
});


// INDEX -- Show all campgrounds
app.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("index", {campgrounds:allCampgrounds});
        }
    });
    // res.render("campgrounds", {campgrounds : campgrounds});
});


// CREATE -- add new campground to db
app.post("/campgrounds", function(req, res){
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name : name, image : image, description: desc};
    
    // Create a new Campground and save to the DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");        
        }
    });
});


// NEW -- Show form to create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("new"); 
});

// SHOW -- shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    // find the campground with provided ID
    // findById()
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("show", {campground : foundCampground});
        }
    });
});

app.get("*", function(req, res){
    res.redirect("/");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started");
});