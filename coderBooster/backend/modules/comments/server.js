const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configuración conexión MySQL
const db = mysql.createConnection({
    host: '34.123.42.113',      // cambia si usas otro host
    user: 'root',
    password: 'Superdev123456?',
    database: 'superdev'
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        process.exit(1);
    }
    console.log('Conectado a MySQL');
});

// Obtener comentarios de un video
app.get('/comentarios', (req, res) => {
    const id_video = req.query.id_video;
    if (!id_video) return res.status(400).json({ error: 'id_video es requerido' });

    const query = `
        SELECT c.id_comment, c.id_video, c.id_user, c.comments, c.comment_date, u.nickname
        FROM comments c
        JOIN users u ON c.id_user = u.id_user
        WHERE c.id_video = ?
        ORDER BY c.comment_date DESC
    `;

    db.query(query, [id_video], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Crear comentario nuevo
app.post('/comentarios', (req, res) => {
    const { id_user, id_video, comments } = req.body;
    if (!id_user || !id_video || !comments) {
        return res.status(400).json({ error: 'id_user, id_video y comments son requeridos' });
    }

    const query = `INSERT INTO comments (id_user, id_video, comments, comment_date) VALUES (?, ?, ?, NOW())`;
    db.query(query, [id_user, id_video, comments], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const newCommentId = result.insertId;
        const query2 = `
            SELECT c.id_comment, c.id_video, c.id_user, c.comments, c.comment_date, u.nickname
            FROM comments c
            JOIN users u ON c.id_user = u.id_user
            WHERE c.id_comment = ?
        `;
        db.query(query2, [newCommentId], (err2, results2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json(results2[0]);
        });
    });
});

// Editar comentario
app.put('/comentarios/:id_comment', (req, res) => {
    const id_comment = req.params.id_comment;
    const { comments, id_user } = req.body;
    if (!comments || !id_user) return res.status(400).json({ error: 'comments e id_user son requeridos' });

    // Validar que el comentario pertenece al usuario que lo quiere editar
    const validarQuery = `SELECT id_user FROM comments WHERE id_comment = ?`;
    db.query(validarQuery, [id_comment], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Comentario no encontrado' });
        if (results[0].id_user !== id_user) return res.status(403).json({ error: 'No autorizado para editar este comentario' });

        const updateQuery = `UPDATE comments SET comments = ? WHERE id_comment = ?`;
        db.query(updateQuery, [comments, id_comment], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ id_comment, comments });
        });
    });
});

// Borrar comentario
app.delete('/comentarios/:id_comment', (req, res) => {
    const id_comment = req.params.id_comment;
    const id_user = req.query.id_user;  // pasamos id_user por query para validar

    if (!id_user) return res.status(400).json({ error: 'id_user es requerido para borrar' });

    // Validar propietario
    const validarQuery = `SELECT id_user FROM comments WHERE id_comment = ?`;
    db.query(validarQuery, [id_comment], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Comentario no encontrado' });
        if (results[0].id_user !== parseInt(id_user)) return res.status(403).json({ error: 'No autorizado para borrar este comentario' });

        const deleteQuery = `DELETE FROM comments WHERE id_comment = ?`;
        db.query(deleteQuery, [id_comment], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ mensaje: 'Comentario borrado' });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
