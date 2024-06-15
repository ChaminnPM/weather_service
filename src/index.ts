import express from 'express';
import { PORT } from './constans';

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
    res.send('pong');
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
});
