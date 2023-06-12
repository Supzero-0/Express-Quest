require("dotenv").config();
const express = require("express");
const { validateMovie, validateUser } = require("./validator.js");
const { hassPassword, verifyPassword, verifyToken } = require("./auth.js");
const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");
const isItDwight = (req, res) => {
  if (req.body.email === "dwight@theoffice.com" && req.body.password === "123456") {
    res.send("This is Dwight !");
  } else {
    res.sendStatus(401);
  }
};

// public road

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword,
  isItDwight,
);
app.post("/api/users", validateUser, hassPassword, userHandlers.postUser);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

//private road

app.use(verifyToken);

app.post("/api/movies", verifyToken, validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", verifyToken, validateMovie, movieHandlers.updateMovie);
app.delete("/api/movies/:id", verifyToken, movieHandlers.deleteMovie);

app.put("/api/users/:id", verifyToken, validateUser, hassPassword, userHandlers.updateUser);
app.delete("/api/users/:id", verifyToken, userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
