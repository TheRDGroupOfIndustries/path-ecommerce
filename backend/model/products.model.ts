import db from "../client/connect.js";

export const getAllProducts = async () => {
    return await db.products.findMany({})
}

export const getSlug = async (id: string) => {
    return await db.products.findUnique({where: {id: id}})
}

export const getByCategory = async (category: string) => {
    return await db.products.findMany({where: {category: category}})
}

export const getTrendyProducts = async () => {
  return await db.products.findMany({
    where: {
      isTrendy: true,
    },
  });
};


export const createProduct = async (data: any, sellerId: string) => {
    try {
        const product = await db.products.create({
           data: {
            name: data.name,
            description: data.description,
            images: data.images,
            price: data.price,
            discount: data.discount,
            ratings: data.ratings,
            sellerId: sellerId,
            features: data.features,
            highlights: data.highlights,
            insideBox: data.insideBox,
            category: data.category,
            isTrendy:data.isTrendy,
            referralBy: data.referralBy,                  
            referralPercentage: data.referralPercentage,  
            }
        })
        return product
    }
    catch (err) {
        console.log(err)
    }
}

export const deleteProduct = async (id: string) => {
    return await db.products.delete({where: {id}})
}

export const updateProduct = async (data: any, id: string) => {
    const existing: any = await db.products.findUnique({where: {id: id}})
    try {
        const update = await db.products.update({
            where: {id},
            data: {
                name: data.name || existing.name,
                description: data.description || existing.description,
                images: data.images || existing.images,
                price: data.price || existing.price,
                discount: data.discount || existing.discount,
                ratings: data.ratings || existing.ratings,
                features: data.features || existing.features,
                highlights: data.highlights || existing.highlights,
                insideBox: data.insideBox || existing.insideBox,
                category: data.category || existing.category,
                isTrendy:data.isTrendy || existing.isTrendy,
                referralBy:data.referralBy || existing.referralBy,
                referralPercentage:data.referralPercentage || existing.referralPercentage
            }
        })
        return update
    }
    catch (err) {
        console.log(err)
    }
}