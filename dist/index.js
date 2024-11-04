import cors from "cors";
import express from "express";
import productsPreview from "./router/productsPreview.router.js";
import errorGlobal from "./middleware/errorGlobal.middleware.js";
import user from "./router/user.router.js";
import productsManager from "./router/productsManager.router.js";
import brandsManager from "./router/brandsManager.router.js";
import categoriesManager from "./router/categoriesManager.router.js";
const port = 3000;
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use("/categoriesManager", categoriesManager);
app.use("/productsManager", productsManager);
app.use("/brandsManager", brandsManager);
app.use("/productsPreview", productsPreview);
app.use("/user", user);
app.use(errorGlobal);
app.listen(port, () => console.log("SERVER START"));
//# sourceMappingURL=index.js.map