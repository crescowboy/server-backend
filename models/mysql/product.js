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
        // Inicializar un array para almacenar los resultados
        let allProducts = [];
    
        // Filtrar por tipo si se proporciona
        if (type) {
            // Obtener el tipo
            const [types] = await connection.query(
                'SELECT id, name FROM type WHERE LOWER(name) = ?;', [type.toLowerCase()]
            );
    
            // Verificar si se encontró el tipo
            if (types.length > 0) {
                const [{ id }] = types;
    
                // Obtener productos por tipo
                const [productsTypes] = await connection.query(
                    'SELECT BIN_TO_UUID(products_id) id FROM type_product WHERE types_id = ?;', [id]
                );
    
                // Agregar productos por tipo al array de resultados
                allProducts = allProducts.concat(productsTypes);
            }
        }
    
        // Obtener todos los productos si no se proporciona un tipo o si no se encontró el tipo
        if (allProducts.length === 0) {
            const [allProductsResult] = await connection.query(
                'SELECT name, description, price, imgUrl, BIN_TO_UUID(id) id FROM product;'
            );
    
            allProducts = allProducts.concat(allProductsResult);
        }
    
        return allProducts;
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
        console.log(id);
        const {
            type: typeInput,
            name,
            description,
            price,
            imageUrl,
        } = input;
    
        const sql = `UPDATE product SET 
            name = '${name}',
            description = '${description}',
            price = '${price}',
            imgUrl = '${imageUrl}'
            WHERE id = UUID_TO_BIN(?)`;
    
        console.log(sql);
    
        try {
            // Ejecuta la consulta de actualización
            await connection.query(sql, [id]);
    
            // Consulta el producto actualizado después de la actualización
            const [updatedProduct] = await connection.query(`SELECT name, description, price, imgUrl, BIN_TO_UUID(id) id 
            FROM product WHERE id = UUID_TO_BIN(?);`,
            [id]);
    
            // Retorna el producto actualizado
            return updatedProduct[0];
        } catch (error) {
            console.error('Error en la actualización:', error);
            throw new Error('Error en la actualización del producto');
        }
    }
    

}