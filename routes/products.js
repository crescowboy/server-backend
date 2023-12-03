import {Router} from 'express'
import { readJSON } from './utils.js';
import { randomUUID } from 'node:crypto';
import { ProductModel } from '../models/product.js';
const router = Router()
const products = readJSON('./json/products.json')

router.get('/', (req, res)=>{
    const { type } = req.query
    const products = ProductModel.getAll({type})
    res.json(products)
})

router.get('/:id', (req,res)=>{
    const {id} = req.params
    const product = products.find(product => product.id == id)
    if(product) return res.json(product)

    res.status(404).json({message: "No se encontro el producto"})
})

router.post('/', (req,res)=>{
    const result = validateProduct(req.body) 
    console.log(req.body)

    if(result.error){
        return res.status(400).json({message: JSON.parse(result.error.message)})
    }

    

    const newProduct = {
        id: randomUUID(),
        ...result.data
    }

    // console.log(newProduct)

    products.push(newProduct)
    res.status(201).json(newProduct)
})

router.delete('/:id', (req,res)=>{
    
    
    const {id} = req.params;
    const productIndex = products.findIndex(product => product.id == id);

    if(productIndex == -1){
        return res.status(404).json({message: 'product not found'})
    }

    products.splice(productIndex, 1)

    return res.json({message: 'Product deleted'})

})

router.patch('/:id', (req,res)=>{
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

    products[productIndex] = updateProduct

    res.status(201).json(updateProduct)
})

export default router