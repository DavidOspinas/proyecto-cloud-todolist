const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();

app.use(bodyParser.json());

// Servir archivos estáticos desde /public (index.html, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// --------- Rutas API ---------

// Obtener todas las tareas
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

// Crear una tarea
app.post('/tasks', (req, res) => {
  const { text, completed } = req.body;
  const stmt = db.prepare('INSERT INTO tasks (text, completed) VALUES (?, ?)');
  stmt.run(text, completed, function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).json({ id: this.lastID, text, completed });
    }
  });
  stmt.finalize();
});

// Actualizar una tarea
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  const stmt = db.prepare('UPDATE tasks SET text = ?, completed = ? WHERE id = ?');
  stmt.run(text, completed, id, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ id, text, completed });
    }
  });
  stmt.finalize();
});

// Eliminar una tarea
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run(id, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(204).send();
    }
  });
  stmt.finalize();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});

