//..............Include Express..................................//
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');

//..............Create an Express server object..................//
const app = express();

//..............Apply Express middleware to the server object....//
app.use(express.json()); //Used to parse JSON bodies (needed for POST requests)
app.use(express.urlencoded());
app.use(express.static('public')); //specify location of static assests
app.set('views', __dirname + '/views'); //specify location of templates
app.set('view engine', 'ejs'); //specify templating library

//.............Define server routes..............................//
//Express checks routes in the order in which they are defined

app.get('/', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("index");
});


app.get('/clubList', function(request, response) {
    let clubs = JSON.parse(fs.readFileSync('data/clubs.json'));
    //console.log(clubs);
    let clubNames=[];

    //create an array to use sort, and dynamically generate win percent
    for(club in clubs){
      clubNames.push(club)
    }
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("clubList", {
      clubs: clubNames
    });
});

app.get('/clubPage/:clubName', function(request, response) {
  let clubs = JSON.parse(fs.readFileSync('data/clubs.json'));

  // using dynamic routes to specify resource request information
  let clubName = request.params.clubName;

  if (clubs[clubName]) {

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("clubPage",{
      club: clubs[clubName]
    });

  }
  else{
    response.status(404);
    response.setHeader('Content-Type', 'text/html')
    response.render("error", {
      "errorCode":"404"
    });
  }
});


app.get('/createReview', function(request, response) {
    let clubs = JSON.parse(fs.readFileSync('data/clubs.json'));
    //console.log(clubs);
    let clubNames=[];

    //create an array to use sort, and dynamically generate win percent
    for(club in clubs){
      clubNames.push(club)
    }
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("createReview", {
      clubs: clubNames
    });
});

let reviewID = 0;
app.post('/createReview', function(request, response) {
  console.log("request: ", request);
    let clubName = request.body.clubName;
    let review = request.body.review;
    let authorName = request.body.authorName
    if(clubName && review){
      let reviews = JSON.parse(fs.readFileSync('data/reviews.json'));
      let newReview={
        "clubName": clubName,
        "review": review,
        "authorName": authorName,
      }
      reviews[reviewID] = newReview;
      reviewID++;
      fs.writeFileSync('data/reviews.json', JSON.stringify(reviews));

      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.redirect("/clubPage/" + clubName)
    }else{
      response.status(400);
      response.setHeader('Content-Type', 'text/html')
      response.render("error", {
        "errorCode":"400"
      });
    }
});


app.post('/createClub', function(request, response) {
  console.log("request: ", request);
    let clubName = request.body.clubName;
    let category = request.body.category;
    let studentLeaders = request.body.studentLeaders;
    let description = request.body.description;
    let advisors = request.body.advisors;
    if(clubName && category && studentLeaders && advisors){
      let clubs = JSON.parse(fs.readFileSync('data/clubs.json'));
      let categories = JSON.parse(fs.readFileSync('data/categories.json'));
      let newClub={
        "name": clubName,
        "category": category,
        "studentLeaders": studentLeaders,
        "description": description,
        "advisors": advisors,
      }
      clubs[clubName] = newClub;
      fs.writeFileSync('data/clubs.json', JSON.stringify(clubs));

      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.redirect("/clubPage/"+clubName);
    }else{
      response.status(400);
      response.setHeader('Content-Type', 'text/html')
      response.render("error", {
        "errorCode":"400"
      });
    }
});

app.get('/createClub', function(request, response) {
    let clubs = JSON.parse(fs.readFileSync('data/clubs.json'));
    let categories = JSON.parse(fs.readFileSync('data/categories.json'));
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("createClub", {
      data: clubs,
      categories: categories
    });
});





// Because routes/middleware are applied in order,
// this will act as a default error route in case of
// a request fot an invalid route
app.use("", function(request, response){
  response.status(404);
  response.setHeader('Content-Type', 'text/html')
  response.render("error", {
    "errorCode":"404"
  });
});

//..............Start the server...............................//
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Server started at http://localhost:'+port+'.')
});
