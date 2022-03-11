const express = require("express");
const logger = require("./loggerMiddleware");
const cors = require("cors");

const app = express();
//Midlewares
let corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
//app.use(); // todas las peticiones pasan por el app.use
// const http = require("http"); //CommonJS forma de cargar modulo.
// import http from 'http'; //ECScipt forma de cargar modulo.
app.use(logger);

let notes = [
  {
    id: 1,
    content: "HTML is easy for me",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

app.get("/", cors(corsOptions), (request, response) => {
  response.send("<h1>hello world</h1>");
});
app.get("/api/notes", (request, response) => {
  response.send(notes);
});
app.get("/api/notes/:id", (request, response) => {
  //   const id = request.params.id;
  const { id } = request.params;
  const note = notes.find((note) => note.id == id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});
app.delete("/api/notes/:id", (request, response) => {
  const { id } = request.params;
  notes = notes.filter((note) => note.id != id);
  response.status(204).end();
});
app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note || !note.content) {
    response.status(400).json({
      error: "note.content is missing.",
    });
  }

  const ids = notes.map((note) => note.id);
  const maxId = Math.max(...ids);
  const newNote = {
    id: maxId + 1,
    content: note.content,
    date: new Date().toISOString(),
    important: typeof note.important === "undefined" ? note.important : false,
  };
  notes = [...notes, newNote];
  response.status(201).json(newNote);
});

app.use((request, response) => {
  response.status(404).json({
    error: "No se encontro el recurso",
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
