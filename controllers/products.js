// import { ProductModel } from "../models/product.js";
// import { ProductModel } from "../models/mysql/product.js";
import { validatePartialProduct, validateProduct } from "../schemas/products.js";

export class ProductController{
    constructor({ productModel}){
        this.productModel = productModel
    }

    getAll = async(req, res) =>{
        const {type} = req.query
        const products = await this.productModel.getAll({type})

        res.json(products)
    }


    getById = async(req, res) =>{
    const {id} = req.params
    const product = await this.productModel.getById({id})
    if(product) return res.json(product)

    res.status(404).json({message: "No se encontro el producto"})
    }


    create = async(req, res) =>{
        const result = validateProduct(req.body) 
    console.log(req.body)

    if(result.error){
        return res.status(400).json({message: JSON.parse(result.error.message)})
    }

   const newProduct = await this.productModel.create({input: result.data})
    res.status(201).json(newProduct)
    }


    delete = async(req, res) =>{
        const {id} = req.params;
        const result = await this.productModel.delete({id})
    
        if(result == false){
            return res.status(404).json({message: 'product not found'})
        }
    
        return res.json({message: 'Product deleted'})
    }


    update = async(req, res) =>{
        const result = validatePartialProduct(req.body);
        // console.log(req.body)

        if(!result.success){
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }

        const {id} = req.params
        // console.log(id)
        const updatedProduct = await this.productModel.update({id, input: result.data})
        // console.log(productIndex)
        

        return res.json(updatedProduct)
    }
}