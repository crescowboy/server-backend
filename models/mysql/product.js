import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '123456',
    database: 'ecommercedb'
}

const connection = await mysql.createConnection(config)
export class ProductModel {
    static async getAll({ type }) {
        const [product] = await connection.query(
            'SELECT name, description, price, imgUrl, BIN_TO_UUID(id) id FROM product;'
        )

        return product
    }

    static async getById({ id }) {
        const [product] = await connection.query(
            `SELECT name, description, price, imgUrl, BIN_TO_UUID(id) id 
            FROM product WHERE id = UUID_TO_BIN(?);`,
            [id]
        )

        if (product.length == 0) return null

        return product[0]
    }

    static async create({ input }) {
        const {
            type: typeInput,
            name,
            description,
            price,
            imageUrl,

        } = input

        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult

        try {
            await connection.query(
                `INSERT INTO product (id, name, description, price, imgUrl)
                 VALUES ((UUID_TO_BIN("${uuid}")), ?, ?, ?, ?);`,
                [name, description, price, imageUrl]
            )
        } catch (e) {
            throw new Error('Error creating products')
        }



        const [product] = await connection.query(
            `SELECT name, description, price, imgUrl, BIN_TO_UUID(id) id
            FROM product WHERE id = UUID_TO_BIN(?);`,
            [uuid]
        )

        return product[0]
    }

    static async delete({ id }) {
        const [product] = await connection.query(
            `DELETE FROM product WHERE id = UUID_TO_BIN(?)`,
            [id]
        )
        return product
    }

    static async update({ id, input }) {
        const {
            type: typeInput,
            name,
            description,
            price,
            imageUrl,

        } = input

         // Ejecuta la consulta de actualización
        await connection.query(
        `UPDATE product SET 
        name = '${name}',
        description = '${description}',
        price = '${price}',
        imageURL = '${imageUrl}'
        WHERE id = ?`, [id]
    );

        // Consulta el producto actualizado después de la actualización
        const [updatedProduct] = await connection.query('SELECT * FROM product WHERE id = ?', [id]);

        // Retorna el producto actualizado
        return updatedProduct[0];
    }

}