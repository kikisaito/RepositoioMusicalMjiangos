const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

console.log('Loaded Client ID:', client_id ? client_id.substring(0, 5) + '...' : 'undefined');
console.log('Loaded Client Secret:', client_secret ? client_secret.substring(0, 5) + '...' : 'undefined');

app.get('/auth/token', async (req, res) => {
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'grant_type=client_credentials'
    };

    try {
        const response = await axios.post(authOptions.url, authOptions.data, {
            headers: authOptions.headers
        });
        res.json(response.data);
    } catch (error) {
        const msg = error.response ? error.response.data : error.message;
        console.error('Error getting token:', msg);
        res.status(500).json({ error: 'Failed to get token', details: msg });
    }
});

const server = app.listen(port, () => {
    console.log(`Auth Server running at http://localhost:${port}`);
});
server.on('error', (e) => console.error('Server error:', e));
