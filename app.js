const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();  
const PORT = 2000;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'proyecto'
});

connection.connect((error) => {
    if (error) {
        console.error('Error al conectar a la base de datos:', error);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

app.use(cors());
app.use(express.json());

module.exports = { app, connection };
require('./sfvo1.js');
require('./sfvo2.js');

app.get('/usuarios', (req, res) => {
    connection.query('SELECT * FROM users', (error, results, fields) => {
    if (error) {
        console.error('Error al ejecutar la consulta:', error);
        return res.status(500).send('Error de servidor');
    }
    res.json(results);
    });
});

  // Crear un nuevo usuario
app.post('/usuarios', (req, res) => {
    const { user, password } = req.body;
    connection.query('INSERT INTO users (user, password) VALUES (?, ?)', [user, password], (error, results, fields) => {
    if (error) {
        console.error('Error al ejecutar la consulta:', error);
        return res.status(500).send('Error de servidor');
    }
    res.json({ message: 'Usuario creado correctamente' });
    });
    });
    
  // Actualizar un usuario existente
app.put('/usuarios/:id', (req, res) => {
    const { user, password } = req.body;
    const userId = req.params.id;
    connection.query('UPDATE users SET user=?, password=? WHERE Userid=?', [user, password, userId], (error, results, fields) => {
    if (error) {
        console.error('Error al ejecutar la consulta:', error);
        return res.status(500).send('Error de servidor');
    }
    res.json({ message: 'Usuario actualizado correctamente' });
    });
});

  // Eliminar un usuario existente
app.delete('/usuarios/:id', (req, res) => {
    const userId = req.params.id;
    connection.query('DELETE FROM users WHERE Userid=?', [userId], (error, results, fields) => {
    if (error) {
        console.error('Error al ejecutar la consulta:', error);
        return res.status(500).send('Error de servidor');
    }
    res.json({ message: 'Usuario eliminado correctamente' });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    connection.query('SELECT * FROM users WHERE user = ? AND password = ?', [username, password], (error, results, fields) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).json({ success: false, message: 'Error de servidor' });
        }

        if (results.length > 0) {
            res.json({ success: true, message: 'Inicio de sesión exitoso' });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    });
});

app.listen(PORT,'0.0.0.0', () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});




