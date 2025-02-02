import dotenv from 'dotenv'
import {app} from "./app.js"
import connectDb from "./db/index.db.js";

dotenv.config({
    path: './env'
})

connectDb()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,"0.0.0.0", ()=>{
        console.log(`Server is listening on port: ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log(`MongoDb Connection Error`);
})