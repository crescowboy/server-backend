// import { ProductModel } from "../models/product.js";
import { ProductModel } from "../models/mysql/product.js";
import { validatePartialProduct, validateProduct } from "../schemas/products.js";

export class ProductController{

    static async getAll(req, res){
        const {type} = req.query
        const products = await ProductModel.getAll({type})

        res.json(products)
    }


    static async getById(req, res){
    const {id} = req.params
    const product = await ProductModel.getById({id})
    if(product) return res.json(product)

    res.status(404).json({message: "No se encontro el producto"})
    }


    static async create(req, res){
        const result = validateProduct(req.body) 
    console.log(req.body)

    if(result.error){
        return res.status(400).json({message: JSON.parse(result.error.message)})
    }

   const newProduct = await ProductModel.create({input: result.data})
    res.status(201).json(newProduct)
    }


    static async delete (req, res){
        const {id} = req.params;
        const result = await ProductModel.delete({id})
    
        if(result == false){
            return res.status(404).json({message: 'product not found'})
        }
    
        return res.json({message: 'Product deleted'})
    }


    static async update(req, res){
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
    }
}