import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

const corsOptions = {
origin: '*',
methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
credentials: true,               
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({limit:"16kb"}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

import AdminRouter from "../src/routes/admin.route.js"
import UserRouter from "../src/routes/user.route.js"

app.use('/api/v1/Admin', AdminRouter)
app.use('/api/v1/User', UserRouter)

export {app}