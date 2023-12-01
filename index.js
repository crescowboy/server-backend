import express, { json } from 'express';
import cors from 'cors';
// import products from './json/products.json';




const app = express();
app.disable('x-powered-by')
const PORT = process.env.PORT ?? 5000

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(json());

//Middleware cors
app.use(cors({
    origin: (origin, callback) =>{
        const ACCEPTED_ORIGINS = [
            'http://localhost:3000',
            'http://localhost:5000'
        ]

        if(ACCEPTED_ORIGINS.includes(origin)){
            return callback(null, true)
        }

        if(!origin){
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    }
    
}))



app.get('/products', (req, res)=>{
    
    
});

app.delete('/products/:id', (req,res)=>{

})

app.get('/products/:id', (req, res)=>{
    
})

app.post('/products', (req, res)=>{
    
})


app.patch('/products/:id', (req,res)=>{
    
})

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