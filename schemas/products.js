import z from 'zod'
// const { object } = require('zod')


const productSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number().int().positive(),
    imageUrl: z.string().url({
        message: 'La imagen debe ser valida'
    }),
    type: z.array(
        z.enum(['camiseta', 'pantalon', 'blusa'])
    ),
    
})

export const validateProduct = (input)=>{
    return  productSchema.safeParse(input)
}

export function validatePartialProduct(input){
    return productSchema.partial().safeParse(input);
    
    
}




