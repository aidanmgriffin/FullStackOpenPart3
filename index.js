const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  //   console.log(response)
  console.log("---");
  next();
};

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(requestLogger);
app.use(
  morgan(function (tokens, req, res) {
    let body = null;

    if (tokens.method(req, res) === "POST") {
      body = tokens.body(req, res);
    }

    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      body,
    ].join(" ");
  })
);

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    response.set("Date", new Date());
    response.send(
      `Phonebook has info for ${
        persons.length
      } people <br/> ${response.getHeader("Date")}`
    );
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.json(result);
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000).toString(),
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const {name, number} = request.body;

  Person.findByIdAndUpdate(request.params.id, {name, number}, { new: true, runValidators:true, context:'query' })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
// Handler of requests with unknown endpoint.
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformated id" });
  }
  else if (error.name === "ValidationError") {
    return response.status(400).json({ error : error.message })
  }

  next(error);
};
// Handler of requests with resulting errors.
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
