const express = require('express')
require("./db/mongoose");
const userRouter = require('./routers/main-routers');

const app=express();
const port =3000||process.env.PORT;


app.use(express.json());
app.use(userRouter);















app.listen(port,()=>{
    console.log(`Server is Up on ${port}`);
});