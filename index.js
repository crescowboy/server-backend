import express, { json } from 'express';
import { corsMiddleware } from './middlewares/cors.js';
import { createProductRouter } from './routes/products.js';
import { ProductModel } from './models/mysql/product.js';

export const createApp =({ productModel}) =>{
    const app = express();
app.disable('x-powered-by')
const PORT = process.env.PORT ?? 5000
// Middleware para analizar el cuerpo de la solicitud JSON
app.use(json());

//Middleware cors
app.use(corsMiddleware())


app.use('/products', createProductRouter({ productModel }))


app.listen(PORT, ()=>{
    console.log(`Server running on port http://localhost:${PORT}`)
})
}

