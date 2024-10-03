const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
//const generarJWT = require('../helper/generarJWT');
const db = require('../database/connection'); // Conexión a la base de datos


    exports.register = async (req, res) => {
        const { username, password, role } = req.body;

        // Verificar si el usuario ya existe
        const sqlCheck = 'SELECT * FROM users WHERE username = ?';
        db.query(sqlCheck, [username], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                return res.status(400).send('El nombre de usuario ya está en uso');
            }
    
            // Hashear la contraseña antes de guardarla
            const hashedPassword = bcrypt.hashSync(password, 10);
    
            // Insertar el nuevo usuario
            const sqlInsert = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
            db.query(sqlInsert, [username, hashedPassword, role || 'user'], (err, result) => {
                if (err) throw err;
                res.status(201).send('Usuario registrado exitosamente');
            });
        });
    };

    exports.login = async (req, res) => {
        const { username, password } = req.body;

        // Verificar si el usuario existe
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, [username], (err, result) => {
            if (err) throw err;
    
            if (result.length === 0) {
                return res.status(404).send('Usuario no encontrado');
            }
    
            const user = result[0];
            //console.log(user);
            // Comparar la contraseña con la almacenada (hasheada)
            const isPasswordValid = bcrypt.compareSync(password, user.password);
    
            if (!isPasswordValid) {
                return res.status(401).send('Contraseña incorrecta');
            }
    
            // Generar un token JWT con el id, username y rol del usuario
            const token = jwt.sign(
                { id: user.id, role: user.role }, // Payload
                process.env.JWT_SECRET,           // Clave secreta desde el archivo .env
                { expiresIn: '1h' }               // Configuración de expiración
            );
            
            res.json({ message: 'Login exitoso', token });
        });
    };

    exports.getUsers = (req, res) => {
        const query = 'SELECT id, username, role FROM users';
        db.query(query, (err, results) => {
            if (err) return res.status(500).send({ message: 'Error retrieving users.' });
            res.status(200).send(results);
        });
    };

