const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
const FB = '60b250cd524f5de5e6685f17719d63ed';
const CL = process.env.ANTHROPIC_KEY || '';
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'pronosticos.html')); });
app.get('/api', async (req, res) => {
  try {
    const ep = req.query.ep;
    const p = Object.assign({}, req.query);
    delete p.ep;
    const qs = Object.keys(p).length ? '?' + new URLSearchParams(p) : '';
    const r = await fetch('https://v3.football.api-sports.io/' + ep + qs, { headers: { 'x-apisports-key': FB } });
    res.json(await r.json());
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/claude', async (req, res) => {
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': CL, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(req.body)
    });
    res.json(await r.json());
  } catch(e) { res.status(500).json({ error: e.message }); }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('OK - Puerto ' + PORT));
