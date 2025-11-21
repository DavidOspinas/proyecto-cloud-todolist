const sqlite3 = require('sqlite3').verbose();

// Crea o abre la base de datos `tasks.db`
const db = new sqlite3.Database('./tasks.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear la tabla de tareas si no existe
db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, text TEXT, completed BOOLEAN)', (err) => {
  if (err) {
    console.error('Error al crear la tabla:', err);
  }
});

module.exports = db;

