
import { v2 as cloudinary } from 'cloudinary'
import productModel from '../models/product.model.js'

const addProducts = async (req, res) => {
    try {
        const { name,gender, description, price, category,sizes,  subCategory,  bestseller, date, } = req.body

        // let sizes = req.body.sizes
        
        // if (sizes && !Array.isArray(sizes)) {
        //     sizes = [sizes]
            
        // }


        
        const image1 = req.files?.image1?.[0] || null
        const image2 = req.files?.image2?.[0] || null
        const image3 = req.files?.image3?.[0] || null
        const image4 = req.files?.image4?.[0] || null

        const images = [image1, image2, image3, image4].filter((item) => item !== null)
        let imageurl = await Promise.all(
            images.map(async (item) => {
                let result = cloudinary.uploader.upload(item.path, { resource_type: "image" })
                return (await result).secure_url
            })
        )
        const product = await productModel.create({
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes,
            bestseller: bestseller === "true" ? "true" : 'false',
            date: Date.now(),
            image: imageurl,
            gender: gender


        })
        console.log(name, description, price, category, subCategory, sizes,gender, bestseller, date)
        console.log(image1, image2, image3, image4)
        console.log(imageurl)
        res.status(200).json({
            success: true,
            message: "product added successfully",


        })




    } catch (error) {
        res.json({
            message: error.message
        })

    }

}


const deleteSingleProduct = async(req, res) => {
    const {productId} = req.params
    
    const Delete = await productModel.findByIdAndDelete(productId)
    return res.status(200).json({
        success: true,
        message: "product deleted successfully"
    })


}

const listProducts = async (req, res) => {
  try {
    const { priceMin,page,limit, priceMax,  ...filter } = req.query;

  const {page: p , limit: l ,skip} = req.pagination


    // Price filter
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    const products = await productModel
      .find(filter)
      .skip(skip)
      .limit(l);

    const totalProducts = await productModel.countDocuments(filter);

    res.json({
      success: true,
      message: "Product list found",
      page: p,
      limit: l,
      totalPages: Math.ceil(totalProducts / l),
      totalProducts,
      length: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const productInfo = async (req, res) => {
    try {
          const {productId} =  req.query
    const info = await productModel.findById( productId)
    
     
   return res.status(200).json({
    success: true,
    message: "product found successfully",
    info
        
    })
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "product not found"
        })        
        
    }
  
   

}

const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, description, category, subCategory, price, gender } = req.body;

        
        let sizes = req.body.sizes || [];
        if (typeof sizes === "string") sizes = [sizes];

       
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const imageFields = ["image1", "image2", "image3", "image4"];

        
        const updatedImages = await Promise.all(
            imageFields.map(async (field, index) => {
                const file = req?.files?.[field]?.[0];

               
                if (file) {
                    const upload = await cloudinary.uploader.upload(file.path, {
                        folder: "products",
                    });
                    return upload.secure_url;
                }

                // Otherwise keep old image
                return product.image?.[index] || null;
            })
        );

        const updateData = {
            name,
            description,
            category,
            subCategory,
            price,
            gender,
            sizes,
            image: updatedImages,
        };

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            updateData,
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "product updated successfully",
            product: updatedProduct,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "product cannot be updated",
        });
    }
};

    

export {
    addProducts,
    deleteSingleProduct,
    listProducts,
    productInfo,
    updateProduct
}


