const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/auth/callback';

// Generar string aleatorio para state
const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

// Ruta de Login
app.get('/auth/login', (req, res) => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email streaming app-remote-control';

    const queryParams = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state
    });

    res.redirect(`https://accounts.spotify.com/authorize?${queryParams.toString()}`);
});

// Callback de Spotify
app.get('/auth/callback', async (req, res) => {
    const code = req.query.code || null;

    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: new URLSearchParams({
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
            }
        });

        const { access_token, refresh_token, expires_in } = response.data;

        // Redirigir al frontend con los tokens
        res.redirect(`http://localhost:4200/?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`);

    } catch (error) {
        console.error('Error en callback:', error.response ? error.response.data : error.message);
        res.redirect('http://localhost:4200/?error=invalid_token');
    }
});

// Refresh Token
app.get('/auth/refresh', async (req, res) => {
    const refresh_token = req.query.refresh_token;

    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error refrescando token:', error);
        res.status(500).json({ error: 'No se pudo refrescar el token' });
    }
});

app.listen(port, () => {
    console.log(`Auth Server running at http://localhost:${port}`);
});
