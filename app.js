var express = require("express");
var fs = require("fs");
var path = require("path");
var serveStatic = require("serve-static");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var User = require("./server/src/models/user");
var Chapter = require("./server/src/models/chapter");
var Algorithm = require("./server/src/models/algorithm");
var mongoose = require("mongoose");
var graphUtil = require('./server/src/graphs')

var clientPath =
  process.argv.length > 2 && process.env.NODE_ENV != 'production' ? "http://localhost:" + process.argv[2] : "/";

var mongoDb = process.env.NODE_ENV == 'production' ? "PRODUCTION_MONGO_SERVER" : "mongodb://localhost:27017/data";
mongoose.connect(mongoDb);
passport.serializeUser(function (user, done) {
  done(null, user.googleId);
});

passport.deserializeUser(function (id, done) {
  User.findOneById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy({
      clientID: "GOOGLE_CLIENT_ID",
      clientSecret: " GOOGLE_CLIENT_SECRET",
      callbackURL: process.env.NODE_ENV == 'production' ? "PRODUCTION_URL"
    },
    function (accessToken, refreshToken, profile, done) {
      user = {
        googleId: profile.id,
        email: profile.email,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName
      };

      User.findOneOrCreate({
        googleId: user.googleId
      }, user, (err, obj) => {
        return done(err, obj);
      });
    }
  )
);

app = express();
app.use(serveStatic(__dirname + "/client/dist"));
app.use(require("cookie-parser")());
app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({
  extended: true
}));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

Algorithm.remove({}, () => {
  let fIn = fs.readFileSync("./server/algorithms.json");
  let algs = JSON.parse(fIn);
  Algorithm.insertMany(algs, () => {});
});

Chapter.remove({}, () => {
  let fIn = fs.readFileSync("./server/chapters.json");
  let chapters = JSON.parse(fIn);
  Chapter.insertMany(chapters, () => {});
})

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: clientPath
  }),
  function (req, res) {
    res.redirect(clientPath);
  }
);

app.get("/api/user/", function (req, res) {
  if (req.isAuthenticated()) {
    res.send({
      firstName: req.user.firstName,
      lastName: req.user.lastName
    });

  } else {
    res.status(401)
    res.send("Not Authenticated");
  }
});

app.get("/api/user/logout", function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/api/chapters', function (req, res) {
  Chapter.find({}, function (err, objs) {
    let chaptertitles = [];
    if (req.isAuthenticated()) {
      objs.forEach((obj) => chaptertitles.push({
        title: obj.title,
        path: obj.path,
        completed: req.user.completedChapters.includes(obj.path)
      }));
    } else {
      objs.forEach((obj) => chaptertitles.push({
        title: obj.title,
        path: obj.path
      }));
    }
    res.send(chaptertitles);
  })
});

app.get('/api/chapters/:path', function (req, res) {
  Chapter.findOne({
    path: req.params.path
  }, function (err, obj) {
    res.send(obj);
  })
});

app.post('/api/chapters/', function (req, res) {
  Chapter.create(req.body,
    function (err, obj) {
      res.status(200);
      res.send();
    });
});

app.get('/api/graph/breadthfirstsearch', function (req, res) {
  let graph = null;

  switch (req.query.type) {
    case "binary":
      graph = graphUtil.binaryTree(3);
      break;
    case "complete":
      graph = graphUtil.complete(5);
      break;
    case "line":
      graph = graphUtil.line(5);
      break;
    case "star":
      graph = graphUtil.star(6);
      break;
    default:
      graph = graphUtil.randomConnectedGraph(10, 12);
      break;
  }


  res.status(200);
  res.send({
    graph: graphUtil.edgeList(graph),
    order: graphUtil.bfs(graph)
  })
});

app.get('/api/graph/depthfirstsearch', function (req, res) {
  let graph = null;

  switch (req.query.type) {
    case "binary":
      graph = graphUtil.binaryTree(3);
      break;
    case "complete":
      graph = graphUtil.complete(5);
      break;
    case "line":
      graph = graphUtil.line(5);
      break;
    case "star":
      graph = graphUtil.star(6);
      break;
    default:
      graph = graphUtil.randomConnectedGraph(10, 12);
      break;
  }

  res.status(200);
  res.send({
    graph: graphUtil.edgeList(graph),
    order: graphUtil.dfs(graph)
  })
});

app.get('/api/graph/dijkstras', function (req, res) {
  let graph = null;

  switch (req.query.type) {
    case "binary":
      graph = graphUtil.binaryTree(3);
      break;
    case "complete":
      graph = graphUtil.complete(5);
      break;
    case "line":
      graph = graphUtil.line(5);
      break;
    case "star":
      graph = graphUtil.star(6);
      break;
    default:
      graph = graphUtil.randomConnectedGraph(10, 12);
      break;
  }

  res.status(200);
  res.send({
    graph: graphUtil.edgeList(graph),
    order: graphUtil.djikstras(graph)
  })
});

app.get('/api/graph/prims', function (req, res) {
  let graph = null;

  switch (req.query.type) {
    case "binary":
      graph = graphUtil.binaryTree(3);
      break;
    case "complete":
      graph = graphUtil.complete(5);
      break;
    case "line":
      graph = graphUtil.line(5);
      break;
    case "star":
      graph = graphUtil.star(6);
      break;
    default:
      graph = graphUtil.randomConnectedGraph(10, 12);
      break;
  }

  res.status(200);
  res.send({
    graph: graphUtil.edgeList(graph),
    order: graphUtil.prims(graph)
  })
});


app.get('/api/graph/inorder', function (req, res) {
  let graph = null;

  switch (req.query.type) {
    case "binary":
      graph = graphUtil.binaryTree(3);
      break;
    case "complete":
      graph = graphUtil.complete(5);
      break;
    case "line":
      graph = graphUtil.line(5);
      break;
    case "star":
      graph = graphUtil.star(6);
      break;
    default:
      graph = graphUtil.randomConnectedGraph(10, 12);
      break;
  }

  res.status(200);
  res.send({
    graph: graphUtil.edgeList(graph),
    order: graphUtil.prims(graph)
  })
});

app.get('/api/algorithm/:name/blocks', function (req, res) {
  Algorithm.findOne({
    name: req.params.name
  }, (err, doc) => {
    if (err || doc == null) {
      res.status(404);
      res.send('It broke');
    } else {
      res.send(doc.blocks)
    }
  });
})

function compareAnswers(ans1, ans2) {
  if (ans1.text != ans2.text || ans1.children.length != ans2.children.length) {
    console.log(ans1.text);
    console.log(ans2.text);
    return false;
  } else {
    let match = true;
    ans1.children
      .map((e, i) => [e, ans2.children[i]])
      .forEach((pair) => {
        match = match && compareAnswers(pair[0], pair[1]);
      })
    return match;
  }
}

app.post('/api/algorithm/:name/check', function (req, res) {
  Algorithm.findOne({
    name: req.params.name
  }, (err, doc) => {
    if (compareAnswers(doc.answer, req.body)) {
      console.log(req.isAuthenticated())
      if (req.isAuthenticated() && !req.user.completedChapters.includes(req.params.name)) {
        User.update({
            _id: req.user._id
          }, {
            $push: {
              completedChapters: req.params.name
            }
          },
          (err, doc) => console.log(err));
      }
      res.send('correct');
    } else {
      res.send('incorrect');
    }
  });
})

app.get('/*',function(req,res) {
  res.sendFile(__dirname + '/client/dist/index.html');
})

var port = process.env.PORT || 5000;
app.listen(port);

console.log("server started " + port);