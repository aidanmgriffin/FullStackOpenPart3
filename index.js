const express = require("express");
var morgan = require('morgan')
const cors = require('cors');
const app = express();
const Person = require('./models/person')
require('dotenv').config()

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  //   console.log(response)
  console.log("---");
  next();
};

morgan.token('body', (req, res) => {
  return  JSON.stringify(req.body) 
})


app.use(express.json());
app.use(cors())
app.use(express.static('dist'))
app.use(requestLogger);
app.use(morgan(function(tokens, req, res) {
    let body = null

    if (tokens.method(req, res) === 'POST') {
        body = tokens.body(req, res)
    }

    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        body
    ].join(' ')
})
)


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/readme", (request, response) => {
  response.send();
});

app.get("/info", (request, response) => {
  response.set("Date", new Date());
  response.send(
    `Phonebook has info for ${persons.length} people <br/> ${response.getHeader(
      "Date"
    )}`
  );
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  })
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  persons = persons.filter((person) => person.id !== id);
  response.json(person)
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  // if (persons.find((person) => person.name === body.name)) {
  //   return response.status(400).json({
  //     error: "name exists in phonebook",
  //   });
  // }

  // if (persons.find((person) => person.number === body.number)) {
  //   return response.status(400).json({
  //     error: "number exists in phonebook",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000).toString(),
  });

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
});

app.use(unknownEndpoint);

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})