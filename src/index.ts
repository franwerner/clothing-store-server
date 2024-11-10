import cors from "cors"
import express from "express"
import errorGlobal from "./middleware/errorGlobal.middleware.js"
import brandsRouter from "./router/brands.router.js"
import categoriesRouter from "./router/categories.router.js"
import productsRouter from "./router/products.router.js"
import productsViewRouter from "./router/productsView.router.js"
import productColorsRouter from "./router/productColors.router.js"
import sizesRouter from "./router/sizes.router.js"
import colorsRouter from "./router/colors.router.js"
import usersRouter from "./router/users.router.js"
import productColorSizesRouter from "./router/ProductColorSizes.router.js"
import productColorImagesRouter from "./router/ProductColorImages.router.js"

const port = 3000
const app = express()

app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173"
}))


app.use("/categories", categoriesRouter)
app.use("/products", productsRouter)
app.use("/products/view", productsViewRouter)
app.use("/products/colors", productColorsRouter)
app.use("/products/colors/sizes", productColorSizesRouter)
app.use("/products/colors/images", productColorImagesRouter)
app.use("/brands", brandsRouter)
app.use("/sizes", sizesRouter)
app.use("/colors", colorsRouter)
app.use("/users", usersRouter)
app.use(errorGlobal)

app.listen(port, () => console.log("SERVER START"))