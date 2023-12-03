import {Router} from 'express'
import { ProductModel } from '../models/product.js';
const router = Router()

router.get('/', async (req, res)=>{
    const { type } = req.query
    const products = await ProductModel.getAll({type})
    res.json(products)
})

router.get('/:id', async (req,res)=>{
    const {id} = req.params
    const product = await ProductModel.getById({id})
    if(product) return res.json(product)

    res.status(404).json({message: "No se encontro el producto"})
})

router.post('/', async (req,res)=>{
    const result = validateProduct(req.body) 
    console.log(req.body)

    if(result.error){
        return res.status(400).json({message: JSON.parse(result.error.message)})
    }

    

   const newProduct = await ProductModel.create({input: result.data})
    res.status(201).json(newProduct)
})

router.delete('/:id', async (req,res)=>{
    
    
    const {id} = req.params;
    const result = await ProductModel.delete({id})

    if(result == false){
        return res.status(404).json({message: 'product not found'})
    }

    

    return res.json({message: 'Product deleted'})

})

router.patch('/:id', async (req,res)=>{
    const result = validatePartialProduct(req.body);
    // console.log(req.body)

    if(!result.success){
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }

    const {id} = req.params
    // console.log(id)
    const updatedProduct = await ProductModel.update({id, input: result.data})
    // console.log(productIndex)
     

    return res.json(updatedProduct)
})

export default router