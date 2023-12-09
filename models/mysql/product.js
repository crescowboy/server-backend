import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '123456',
    database: 'ecommercedb'
}

const connection = await mysql.createConnection(config)
export class ProductModel{
    static async getAll({ type }){
        const [product] = await connection.query(
            'SELECT name, description, price, imgUrl, BIN_TO_UUID(id) id FROM product;'
        )

        return product
    }

    static async getById({ id }){
        const [product] = await connection.query(
            `SELECT name, description, price, imgUrl, BIN_TO_UUID(id) id 
            FROM product WHERE id = UUID_TO_BIN(?);`,
            [id]
        )

        if(product.length == 0) return null

        return product[0]
    }

    static async create ({ input }){
        const {
            type: typeInput,
            name,
            description,
            price,
            imageUrl,

        } = input

        const result = await connection.query(
            `INSERT INTO product(id, name, description, price, imgUrl)
             VALUES (? , ?, ?, ?, ?, ?);`,
             [name, description, price, imageUrl]
        )

        console.log(result)
    }

    static async delete ({ id }){

    }

    static async update ({ id, input}){

    }
    
}