import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { router } from './routes/route.js';
import { mongoConnect } from './util/database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));




mongoConnect(() => {
    app.use(router);
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});

