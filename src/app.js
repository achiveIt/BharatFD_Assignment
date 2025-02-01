import express from 'express'
import bodyParser from 'body-parser';

const app = express();

app.use(express.json({limit:"16kb"}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

import AdminRouter from "../src/routes/admin.route.js"

app.use('/api/v1/Admin',AdminRouter)

export {app}