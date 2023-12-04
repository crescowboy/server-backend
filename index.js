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


app.listen(PORT, ()=>{
    console.log(`Server running on port http://localhost:${PORT}`)
})