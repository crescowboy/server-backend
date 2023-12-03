import {readJSON} from '../utils'
const product = readJSON('../product.json')

export class ProductModel{
    static getAll({type}){
        if(type){
            return products.filter(
                product => product.type.some(g => g.toLowerCase() === type.toLowerCase())
            )
        }
    }
}