import express, { json } from 'express';
// import products from './json/products.json';
import {productsRouter}  from './routes/products.js'
import { corsMiddleware } from './middlewares/cors.js';



const app = express();
app.disable('x-powered-by')
const PORT = process.env.PORT ?? 5000

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(json());

//Middleware cors
app.use(corsMiddleware())



app.use('/products', productsRouter)

// app.options('/products/:id', (req,res)=>{
//     const origin = req.header('origin')

//     if(ACCEPTED_ORIGINS.includes(origin) || !origin){
//         res.header('Access-Control-Allow-Origin', origin)
//         res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
//     }
//     res.sendStatus(200)
// })




app.listen(PORT, ()=>{
    console.log(`Server running on port http://localhost:${PORT}`)
})