const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const products = require('./json/products.json');
const { validateProduct, validatePartialProduct } = require('./schemas/products');

const app = express();
app.disable('x-powered-by')
const PORT = process.env.PORT ?? 5000

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());

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
    
    const { type } = req.query
    if(type){
        const filteredType = products.filter(
            product => product.type.some(g => g.toLowerCase() === type.toLowerCase())
        )
        return res.json(filteredType)
    }
    res.json(products)
});

app.delete('/products/:id', (req,res)=>{
    
    
    const {id} = req.params;
    const productIndex = products.findIndex(product => product.id == id);

    if(productIndex == -1){
        return res.status(404).json({message: 'product not found'})
    }

    products.splice(productIndex, 1)

    return res.json({message: 'Product deleted'})

})

app.get('/products/:id', (req, res)=>{
    const {id} = req.params
    const product = products.find(product => product.id == id)
    if(product) return res.json(product)

    res.status(404).json({message: "No se encontro el producto"})
})

app.post('/products', (req, res)=>{
    const result = validateProduct(req.body) 
    console.log(req.body)

    if(result.error){
        return res.status(400).json({message: JSON.parse(result.error.message)})
    }

    

    const newProduct = {
        id: crypto.randomUUID(),
        ...result.data
    }

    // console.log(newProduct)

    products.push(newProduct)
    res.status(201).json(newProduct)
})


app.patch('/products/:id', (req,res)=>{
    const result = validatePartialProduct(req.body);
    // console.log(req.body)

    if(!result.success){
        console.log(result);
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }

    const {id} = req.params
    // console.log(id)
    const productIndex = products.findIndex(product => product.id == id)
    // console.log(productIndex)
    if(productIndex === -1){
        return res.status(404).json({message: 'producto no encontrado'})
    } 

    const updateProduct = {
        ...products[productIndex],
        ...result.data
    }

    // console.log('Producto actualizado:', result.data);

    products[productIndex] = updateProduct

    res.status(201).json(updateProduct)
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