const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(express.static("build"));

app.use(cors());

morgan.token("body", (request, response) => {
  return Object.keys(request.body).length !== 0
    ? JSON.stringify(request.body)
    : " ";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("Welcome");
});

app.get("/info", (request, response) => {
  var dateTime = new Date();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${dateTime}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (response, request) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

const newID = () => {
  return Math.floor(Math.random() * 1000);
};

app.post("/api/persons/", (request, response) => {
  const body = request.body;
  console.log(request.body);
  if (!body.name) {
    return response.status(400).json({ error: "name missing" });
  } else if (!body.number) {
    return response.status(400).json({ error: "number missing" });
  } else if (persons.some((p) => p.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const person = {
    id: newID(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
