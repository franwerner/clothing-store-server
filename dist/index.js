// src/index.ts
import express14 from "express";

// src/config/cors.config.ts
import cors from "cors";

// src/constant/_env.constant.ts
var _env = process.env;
var env_constant_default = _env;

// src/config/cors.config.ts
var corsConfig = cors({
  origin: env_constant_default.FROTEND_DOMAIN
});
var cors_config_default = corsConfig;

// src/config/dotenv.config.ts
import dotenv from "dotenv";
var dotenvConfig = dotenv.config({ path: ".env.local" });

// src/config/session.config.ts
import session from "express-session";
var sessionConfig = session({
  secret: crypto.randomUUID(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1e3 * 60 * 60 * 24 * 30,
    // 30 dias,
    secure: env_constant_default.NODE_ENV == "prod",
    httpOnly: true
  }
});
var session_config_default = sessionConfig;

// src/middleware/errorGlobal.middleware.ts
var errorGlobal = (_, res) => {
  res.status(500).json({
    message: "Ocurri\xF3 un error inesperado en el servidor."
  });
};
var errorGlobal_middleware_default = errorGlobal;

// src/middleware/isAdmin.middleware.ts
var isAdmin = (req, res, next) => {
  const user = req.session.user;
  if (!user || user.permission == "standard") {
    res.status(403).json({
      message: "No tienes permisos suficientes para continuar."
    });
  } else {
    next();
  }
};
var isAdmin_middleware_default = isAdmin;

// src/router/brands.router.ts
import express from "express";

// src/utils/zodErrorHandler.utilts.ts
import { ZodError } from "zod";

// src/utils/errorHandler.utilts.ts
var ErrorHandler = class _ErrorHandler extends Error {
  message;
  name;
  status;
  data;
  constructor({ message, status, data }) {
    super();
    this.message = message || "";
    this.name = "ErrorHandler", this.status = status || 500;
    this.data = data;
  }
  static isInstanceOf(instance) {
    return instance instanceof _ErrorHandler;
  }
  response(res) {
    res.status(this.status).json({
      message: this.message || void 0,
      //Si es undefined la propiedad no se incluira
      data: this.data
    });
  }
};
var errorHandler_utilts_default = ErrorHandler;

// src/utils/zodErrorHandler.utilts.ts
function transformErrorToClient(zod_error) {
  return zod_error.issues.map(({ message, path }) => {
    return {
      property: path.find((i) => typeof i === "string"),
      message
    };
  });
}
var ZodErrorHandler = class extends errorHandler_utilts_default {
  zod_error;
  constructor(error) {
    super({
      status: 400,
      data: transformErrorToClient(error)
    });
    this.zod_error = error;
  }
  static isZodError(error) {
    return error instanceof ZodError;
  }
};
var zodErrorHandler_utilts_default = ZodErrorHandler;

// src/helper/zodParse.helper.ts
var zodParse = (z14) => {
  return (data) => {
    try {
      return z14.parse(data);
    } catch (error) {
      if (zodErrorHandler_utilts_default.isZodError(error)) {
        throw new zodErrorHandler_utilts_default(error);
      }
      throw error;
    }
  };
};
var zodParse_helper_default = zodParse;

// src/config/knex.config.ts
import knex from "knex";
var { DB_HOST, DB_USER, DB_PORT, DB_PASSWORD, DB } = env_constant_default;
var sql = knex({
  client: "mysql2",
  connection: {
    host: DB_HOST,
    user: DB_USER,
    port: DB_PORT,
    password: DB_PASSWORD,
    database: DB
  },
  pool: {
    min: 1,
    max: 10,
    createTimeoutMillis: 3e3,
    idleTimeoutMillis: 3e4
  }
});
var knex_config_default = sql;

// src/utils/databaseErrorHandler.utilts.ts
var sqlErrorMapping = {
  "ER_ACCESS_DENIED_ERROR": 401,
  "ER_BAD_DB_ERROR": 404,
  "ER_BAD_FIELD_ERROR": 400,
  "ER_SYNTAX_ERROR": 400,
  "ER_DUP_ENTRY": 409,
  "ER_LOCK_WAIT_TIMEOUT": 503,
  "CR_CONNECTION_REFUSED": 503,
  "ER_NO_SUCH_TABLE": 404,
  "ER_ROW_IS_REFERENCED_2": 409,
  "ER_WARN_DATA_OUT_OF_RANGE": 422,
  "ER_UNKNOWN_ERROR": 500,
  "ER_TIMEOUT": 408,
  "ER_TOO_MANY_CONCURRENT_CONNECTIONS": 503,
  "ER_BAD_NULL_ERROR": 400,
  "ER_OUTOFMEMORY": 500,
  "ER_INVALID_GROUP_FUNC_MIN_MAX": 400,
  "ER_SUBQUERY_NO_1_ROW": 400
};
var defaultMessage = "Ocurrio un error desconocido en la base de datos.";
var DatabaseErrorHandler = class extends errorHandler_utilts_default {
  queryError;
  constructor(queryError, messages = {}) {
    super({
      message: messages[queryError.code] || defaultMessage,
      status: sqlErrorMapping[queryError.code] || 500
    });
    this.queryError = queryError;
    this.name = "DatabaseErrorHandler";
  }
  static isSqlError(error) {
    return error?.sql;
  }
};
var databaseErrorHandler_utilts_default = DatabaseErrorHandler;

// src/utils/model.utils.ts
var ModelUtils = class {
  static removePropertiesUndefined(properties) {
    return Object.fromEntries(Object.entries(properties).filter(([_, value]) => value));
  }
  static generateError(error, messages = {}) {
    if (databaseErrorHandler_utilts_default.isSqlError(error)) {
      return new databaseErrorHandler_utilts_default(error, messages);
    }
    return error;
  }
};
var model_utils_default = ModelUtils;

// src/model/brands.model.ts
var BrandsModel = class extends model_utils_default {
  static async select(props = {}) {
    try {
      const query = knex_config_default("brands as b").where(this.removePropertiesUndefined(props));
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async insert(props) {
    try {
      return await knex_config_default("brands").insert(props);
    } catch (error) {
      throw this.generateError(error, {
        ER_DUP_ENTRY: "La marca que intentas registrar ya se existe en la base de datos."
      });
    }
  }
  static async update({ brand_id, ...brand }) {
    try {
      return await knex_config_default("brands").update(brand).where("brand_id", brand_id);
    } catch (error) {
      throw this.generateError(error, {
        ER_DUP_ENTRY: "El nombre de la marca que intentas actualizar ya se existe en la base de datos."
      });
    }
  }
  static async delete(brandID) {
    try {
      return await knex_config_default("brands").where("brand_id", brandID).delete();
    } catch (error) {
      throw this.generateError(error, {
        ER_ROW_IS_REFERENCED_2: "No se puede eliminar la marca porque existen productos asociados a la lista de compras de usuarios."
      });
    }
  }
};
var brands_model_default = BrandsModel;

// src/schema/brand.schema.ts
import z4 from "zod";

// src/schema/databaseKey.schema.ts
import { z as z2 } from "zod";
var databaseKeySchema = z2.union([z2.number(), z2.string().regex(/^\d+$/, "El tipo de la clave no es valido.")]);
var databaseKey_schema_default = databaseKeySchema;

// src/schema/databaseBoolean.schema.ts
import { z as z3 } from "zod";
var databaseBooleanSchema = z3.union([z3.literal(0), z3.literal(1), z3.boolean()]);
var databaseBoolean_schema_default = databaseBooleanSchema;

// src/schema/brand.schema.ts
var base = z4.object({
  brand_id: databaseKey_schema_default,
  brand: z4.string(),
  status: databaseBoolean_schema_default.optional().default(false)
});
var insert = base.omit({
  brand_id: true
});
var update = base.partial().extend({
  brand_id: base.shape.brand_id
});
var brandSchema = {
  base,
  update,
  insert,
  delete: databaseKey_schema_default
};
var brand_schema_default = brandSchema;

// src/utils/service.utils.ts
var ServiceUtils = class {
  static async writeOperationsHandler(input, operation) {
    const data = [];
    for (const e of input) {
      try {
        await operation(e);
        data.push({
          payload: e,
          success: true
        });
      } catch (error) {
        data.push({
          success: false,
          payload: e,
          message: databaseErrorHandler_utilts_default.isInstanceOf(error) ? error.message : "Error interno del servidor."
        });
      }
    }
    return data;
  }
};
var service_utils_default = ServiceUtils;

// src/service/brands.service.ts
var BrandsService = class extends service_utils_default {
  static async get() {
    const brands = await brands_model_default.select();
    if (brands.length === 0) throw new errorHandler_utilts_default({
      message: "No se ninguna marca",
      status: 404
    });
    return brands;
  }
  static async update(brands) {
    const data = zodParse_helper_default(brand_schema_default.update.array())(brands);
    return await this.writeOperationsHandler(data, (e) => brands_model_default.update(e));
  }
  static async insert(brands) {
    const data = zodParse_helper_default(brand_schema_default.insert.array())(brands);
    return await this.writeOperationsHandler(data, (e) => brands_model_default.insert(e));
  }
  static async delete(brands) {
    const data = zodParse_helper_default(brand_schema_default.delete.array())(brands);
    return await this.writeOperationsHandler(data, (e) => brands_model_default.delete(e));
  }
};
var brands_service_default = BrandsService;

// src/controller/brands.controller.ts
var BrandsController = class {
  static async getBrands(_, res, next) {
    try {
      const data = await brands_service_default.get();
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async addBrands(req, res, next) {
    try {
      const data = await brands_service_default.insert(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async modifyBrands(req, res, next) {
    try {
      const data = await brands_service_default.update(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async removeBrands(req, res, next) {
    try {
      const data = await brands_service_default.delete(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
};
var brands_controller_default = BrandsController;

// src/router/brands.router.ts
var brandsRouter = express.Router();
brandsRouter.get("/", brands_controller_default.getBrands);
brandsRouter.post("/", isAdmin_middleware_default, brands_controller_default.addBrands);
brandsRouter.patch("/", isAdmin_middleware_default, brands_controller_default.modifyBrands);
brandsRouter.delete("/", isAdmin_middleware_default, brands_controller_default.removeBrands);
var brands_router_default = brandsRouter;

// src/router/categories.router.ts
import express2 from "express";

// src/schema/category.schema.ts
import { z as z5 } from "zod";
var base2 = z5.object({
  category_id: databaseKey_schema_default,
  category: z5.string(),
  brand_fk: databaseKey_schema_default,
  status: databaseBoolean_schema_default.optional().default(false)
});
var update2 = base2.partial().extend({
  category_id: base2.shape.category_id
});
var insert2 = base2.omit({ category_id: true });
var categorySchema = {
  base: base2,
  update: update2,
  insert: insert2,
  delete: databaseKey_schema_default
};
var category_schema_default = categorySchema;

// src/model/categories.model.ts
var CategoriesModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("categories as c").where(this.removePropertiesUndefined(props));
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async insert(props) {
    try {
      return await knex_config_default("categories").insert(props);
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async update({ category_id, ...category }) {
    try {
      return await knex_config_default("categories").update(category).where("category_id", category_id);
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async delete(categoryID) {
    try {
      return await knex_config_default("categories").where("category_id", categoryID).delete();
    } catch (error) {
      throw this.generateError(error, {
        ER_ROW_IS_REFERENCED_2: "No se puede eliminar la categoria porque existen productos asociados a la lista de compras de usuarios."
      });
    }
  }
};
var categories_model_default = CategoriesModel;

// src/service/categories.service.ts
var CategoriesService = class extends service_utils_default {
  static async get() {
    const categories = await categories_model_default.select();
    if (categories.length === 0) throw new errorHandler_utilts_default({
      message: "No se encontraron categorias.",
      status: 404
    });
    return categories;
  }
  static async update(categories) {
    const data = zodParse_helper_default(category_schema_default.update.array())(categories);
    return await this.writeOperationsHandler(data, (e) => categories_model_default.update(e));
  }
  static async insert(categories) {
    const data = zodParse_helper_default(category_schema_default.insert.array())(categories);
    return await this.writeOperationsHandler(data, (e) => categories_model_default.insert(e));
  }
  static async delete(categories) {
    const data = zodParse_helper_default(category_schema_default.delete.array())(categories);
    return await this.writeOperationsHandler(data, (e) => categories_model_default.delete(e));
  }
};
var categories_service_default = CategoriesService;

// src/controller/categories.controller.ts
var CategoriesController = class {
  static async getCategoriesPerBrand(req, res, next) {
    try {
      const { brand_id } = req.params;
      const data = await categories_model_default.select({ brand_fk: brand_id });
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async addCategories(req, res, next) {
    try {
      const categories = category_schema_default.insert.array().parse(req.body);
      const data = await categories_service_default.insert(categories);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async modifyCategories(req, res, next) {
    try {
      const categories = category_schema_default.update.array().parse(req.body);
      const data = await categories_service_default.update(categories);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async removeCategories(req, res, next) {
    try {
      const categories = brand_schema_default.delete.array().parse(req.body);
      const data = await categories_service_default.delete(categories);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
};
var categories_controller_default = CategoriesController;

// src/router/categories.router.ts
var categoriesRouter = express2.Router();
categoriesRouter.get("/brand/:brand_id", categories_controller_default.getCategoriesPerBrand);
categoriesRouter.post("/", isAdmin_middleware_default, categories_controller_default.addCategories);
categoriesRouter.patch("/", isAdmin_middleware_default, categories_controller_default.modifyCategories);
categoriesRouter.delete("/", isAdmin_middleware_default, categories_controller_default.removeCategories);
var categories_router_default = categoriesRouter;

// src/router/colors.router.ts
import express3 from "express";

// src/model/colors.model.ts
var ColorsModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("colors").where(this.removePropertiesUndefined(props));
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async insert(color) {
    try {
      return await knex_config_default("colors").insert(color);
    } catch (error) {
      throw this.generateError(error, {
        ER_DUP_ENTRY: "El color que intentas registrar ya existe en la base de datos."
      });
    }
  }
  static async update({ color_id, ...color }) {
    try {
      return await knex_config_default("colors").update(color).where("color_id", color_id);
    } catch (error) {
      throw this.generateError(error, {
        ER_DUP_ENTRY: "El nombre del color que intentas actualizar ya se existe en la base de datos."
      });
    }
  }
  static async delete(colorsID) {
    try {
      return await knex_config_default("colors").where("color_id", colorsID).delete();
    } catch (error) {
      throw this.generateError(error, {
        ER_ROW_IS_REFERENCED_2: "No se puede eliminar el color porque esta asociado a la lista de compras de usuarios."
      });
    }
  }
};
var colors_model_default = ColorsModel;

// src/schema/color.schema.ts
import { z as z6 } from "zod";
var hexadecimalPattern = {
  regexp: /#([A-Fa-f0-9]{6})/g,
  message: "No es un hexadecimal valido."
};
var base3 = z6.object({
  color_id: databaseKey_schema_default,
  color: z6.string(),
  hexadecimal: z6.string().regex(hexadecimalPattern.regexp, hexadecimalPattern.message)
});
var update3 = base3.partial().extend({
  color_id: base3.shape.color_id
});
var insert3 = base3.omit({ color_id: true });
var colorSchema = {
  base: base3,
  update: update3,
  insert: insert3,
  delete: databaseKey_schema_default
};
var color_schema_default = colorSchema;

// src/service/colors.service.ts
var ColorsService = class extends service_utils_default {
  static async get() {
    const res = await colors_model_default.select();
    if (res.length === 0) {
      throw new errorHandler_utilts_default({
        message: "No se encontraron colores.",
        status: 404
      });
    }
  }
  static async delete(colors) {
    const data = zodParse_helper_default(color_schema_default.delete.array())(colors);
    return await this.writeOperationsHandler(data, (color) => colors_model_default.delete(color));
  }
  static async insert(colors) {
    const data = zodParse_helper_default(color_schema_default.insert.array())(colors);
    return await this.writeOperationsHandler(data, (color) => colors_model_default.insert(color));
  }
  static async update(colors) {
    const data = zodParse_helper_default(color_schema_default.update.array())(colors);
    return await this.writeOperationsHandler(data, (color) => colors_model_default.update(color));
  }
};
var colors_service_default = ColorsService;

// src/controller/colors.controller.ts
var ColorsController = class {
  static async addColors(req, res, next) {
    try {
      const data = await colors_service_default.insert(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async modifyColors(req, res, next) {
    try {
      const data = await colors_service_default.update(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async removeColors(req, res, next) {
    try {
      const data = await colors_service_default.delete(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async getColors(_, res, next) {
    try {
      const data = await colors_model_default.select();
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
};
var colors_controller_default = ColorsController;

// src/router/colors.router.ts
var colorsRouter = express3.Router();
colorsRouter.get("/", colors_controller_default.getColors);
colorsRouter.delete("/", isAdmin_middleware_default, colors_controller_default.removeColors);
colorsRouter.patch("/", isAdmin_middleware_default, colors_controller_default.modifyColors);
colorsRouter.post("/", isAdmin_middleware_default, colors_controller_default.addColors);
var colors_router_default = colorsRouter;

// src/router/ProductColorImages.router.ts
import express4 from "express";

// src/model/productColorImages.model.ts
var ProductColorImagesModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("product_color_images ").where(this.removePropertiesUndefined(props));
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async insert(colorImage) {
    try {
      return await knex_config_default("product_color_images").insert(colorImage);
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async update({ product_color_image_id, ...colorImage }) {
    try {
      return await knex_config_default("product_color_images").update(colorImage).where("product_color_image_id", product_color_image_id);
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async delete(product_color_image_id) {
    try {
      return await knex_config_default("product_color_images").where("product_color_image_id", product_color_image_id).delete();
    } catch (error) {
      throw this.generateError(error);
    }
  }
};
var productColorImages_model_default = ProductColorImagesModel;

// src/schema/productColorImage.schema.ts
import { z as z7 } from "zod";
var base4 = z7.object({
  product_color_image_id: databaseKey_schema_default,
  product_color_fk: databaseKey_schema_default,
  url: z7.string()
});
var update4 = base4.partial().extend({
  product_color_image_id: base4.shape.product_color_image_id
});
var insert4 = base4.omit({ product_color_image_id: true });
var productColorImageSchema = {
  base: base4,
  update: update4,
  insert: insert4,
  delete: databaseKey_schema_default
};
var productColorImage_schema_default = productColorImageSchema;

// src/service/productColorImages.service.ts
var ProductColorImagesService = class extends service_utils_default {
  static async update(productColorImages) {
    const data = zodParse_helper_default(productColorImage_schema_default.update.array())(productColorImages);
    return await this.writeOperationsHandler(data, (e) => productColorImages_model_default.update(e));
  }
  static async delete(productColorImages) {
    const data = zodParse_helper_default(productColorImage_schema_default.delete.array())(productColorImages);
    return await this.writeOperationsHandler(data, (e) => productColorImages_model_default.delete(e));
  }
  static async insert(productColorImages) {
    const data = zodParse_helper_default(productColorImage_schema_default.insert.array())(productColorImages);
    return await this.writeOperationsHandler(data, (e) => productColorImages_model_default.insert(e));
  }
};
var productColorImages_service_default = ProductColorImagesService;

// src/controller/productColorImages.controller.ts
var ProductColorImagesController = class {
  static async addProductColorImages(req, res, next) {
    try {
      const data = await productColorImages_service_default.insert(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async modifyProductColorImages(req, res, next) {
    try {
      const data = await productColorImages_service_default.update(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async removeProductColorImages(req, res, next) {
    try {
      const data = await productColorImages_service_default.delete(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
};
var productColorImages_controller_default = ProductColorImagesController;

// src/router/ProductColorImages.router.ts
var productColorImagesRouter = express4.Router();
productColorImagesRouter.post("/", productColorImages_controller_default.addProductColorImages);
productColorImagesRouter.delete("/", productColorImages_controller_default.removeProductColorImages);
productColorImagesRouter.patch("/", productColorImages_controller_default.modifyProductColorImages);
var ProductColorImages_router_default = productColorImagesRouter;

// src/router/productColors.router.ts
import express5 from "express";

// src/model/productColors.model.ts
var ProductColorsModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("product_colors as pc").where(this.removePropertiesUndefined(props));
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async insert(productColor) {
    try {
      return await knex_config_default("product_colors").insert(productColor);
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async update({ product_color_id, ...productColor }) {
    try {
      return await knex_config_default("product_colors").update(productColor).where("product_color_id", product_color_id);
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async delete(productColorID) {
    try {
      return await knex_config_default("product_colors").where("product_color_id", productColorID).delete();
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static selectWithTableColor(props, modify) {
    return this.select(props, (builder) => {
      modify && builder.modify(modify);
      builder.leftJoin("colors as c", "c.color_id", "pc.color_fk");
    });
  }
  static selectExistsSizes(props, modify) {
    return this.selectWithTableColor(props, (builder) => {
      modify && builder.modify(modify);
      builder.whereExists(
        knex_config_default("product_color_sizes").whereRaw("product_color_fk = pc.product_color_id")
      );
    });
  }
};
var productColors_model_default = ProductColorsModel;

// src/schema/productColor.schema.ts
import { z as z8 } from "zod";
var base5 = z8.object({
  product_color_id: databaseKey_schema_default,
  color_fk: databaseKey_schema_default,
  product_fk: databaseKey_schema_default
});
var update5 = base5.partial().extend({
  product_color_id: base5.shape.product_color_id
});
var insert5 = base5.omit({
  product_color_id: true
});
var productColorSchema = {
  base: base5,
  update: update5,
  insert: insert5,
  delete: databaseKey_schema_default
};
var productColor_schema_default = productColorSchema;

// src/service/productColors.service.ts
var ProductColorsService = class extends service_utils_default {
  static async update(productColors) {
    const data = zodParse_helper_default(productColor_schema_default.update.array())(productColors);
    return await this.writeOperationsHandler(data, (e) => productColors_model_default.update(e));
  }
  static async delete(productColors) {
    const data = zodParse_helper_default(productColor_schema_default.delete.array())(productColors);
    return await this.writeOperationsHandler(data, (e) => productColors_model_default.delete(e));
  }
  static async insert(productColors) {
    const data = zodParse_helper_default(productColor_schema_default.insert.array())(productColors);
    return await this.writeOperationsHandler(data, (e) => productColors_model_default.insert(e));
  }
};
var productColors_service_default = ProductColorsService;

// src/controller/productColors.controller.ts
var ProductColorsController = class {
  static async setProductColors(req, res, next) {
    try {
      const data = await productColors_service_default.insert(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async modifyProductColors(req, res, next) {
    try {
      const data = await productColors_service_default.update(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async removeProductColors(req, res, next) {
    try {
      const data = await productColors_service_default.delete(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
};
var productColors_controller_default = ProductColorsController;

// src/router/productColors.router.ts
var productColorsRouter = express5.Router();
productColorsRouter.post("/", productColors_controller_default.setProductColors);
productColorsRouter.delete("/", productColors_controller_default.removeProductColors);
productColorsRouter.patch("/", productColors_controller_default.modifyProductColors);
var productColors_router_default = productColorsRouter;

// src/router/ProductColorSizes.router.ts
import express6 from "express";

// src/model/productSizes.model.ts
var ProductColorSizesModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("product_color_sizes as pcs").where(this.removePropertiesUndefined(props));
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static selectWithTableSize(props, modify) {
    return this.select(props, (builder) => {
      modify && builder.modify(modify);
      builder.leftJoin("sizes as s", "s.size_id", "pcs.size_fk");
    });
  }
  static async insert(size) {
    try {
      return await knex_config_default("product_color_sizes").insert(size);
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async update({ product_color_size_id, ...size }) {
    try {
      return await knex_config_default("product_color_sizes").update(size).where("product_color_size_id", product_color_size_id);
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async delete(product_color_size_ids) {
    try {
      return await knex_config_default("product_color_sizes").where("product_color_size_id", product_color_size_ids).delete();
    } catch (error) {
      throw this.generateError(error);
    }
  }
};
var productSizes_model_default = ProductColorSizesModel;

// src/schema/productColorSize.schema.ts
import { z as z9 } from "zod";
var base6 = z9.object({
  product_color_size_id: databaseKey_schema_default,
  product_color_fk: databaseKey_schema_default,
  size_fk: databaseKey_schema_default,
  stock: databaseBoolean_schema_default.optional().default(true)
});
var update6 = base6.partial().extend({
  product_color_size_id: base6.shape.product_color_size_id
});
var insert6 = base6.omit({ product_color_size_id: true });
var productColorSizeSchema = {
  base: base6,
  update: update6,
  insert: insert6,
  delete: databaseKey_schema_default
};
var productColorSize_schema_default = productColorSizeSchema;

// src/service/productColorSizes.service.ts
var ProductColorSizesService = class extends service_utils_default {
  static async insert(sizes) {
    const data = zodParse_helper_default(productColorSize_schema_default.insert.array())(sizes);
    return await this.writeOperationsHandler(data, (e) => productSizes_model_default.insert(e));
  }
  static async update(sizes) {
    const data = zodParse_helper_default(productColorSize_schema_default.update.array())(sizes);
    return await this.writeOperationsHandler(data, (e) => productSizes_model_default.update(e));
  }
  static async delete(sizes) {
    const data = zodParse_helper_default(productColorSize_schema_default.delete.array())(sizes);
    return await this.writeOperationsHandler(data, (e) => productSizes_model_default.delete(e));
  }
};
var productColorSizes_service_default = ProductColorSizesService;

// src/controller/productColorSizes.controller.ts
var ProductColorSizesController = class {
  static async setProductColorSizes(req, res, next) {
    try {
      const data = await productColorSizes_service_default.insert(req.body.sizes);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async modifyProductColorSizes(req, res, next) {
    try {
      const data = await productColorSizes_service_default.update(req.body.sizes);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async removeProductColorSizes(req, res, next) {
    try {
      const data = await productColorSizes_service_default.delete(req.body.sizes);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
};
var productColorSizes_controller_default = ProductColorSizesController;

// src/router/ProductColorSizes.router.ts
var productColorSizesRouter = express6.Router();
productColorSizesRouter.post("/", productColorSizes_controller_default.setProductColorSizes);
productColorSizesRouter.delete("/", productColorSizes_controller_default.removeProductColorSizes);
productColorSizesRouter.patch("/", productColorSizes_controller_default.modifyProductColorSizes);
var ProductColorSizes_router_default = productColorSizesRouter;

// src/router/products.router.ts
import express7 from "express";

// src/model/products.model.ts
var ProductsModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("products as p").where(this.removePropertiesUndefined(props));
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static selectExistsColors(props, modify) {
    return this.select(props, (builder) => {
      modify && builder.modify(modify);
      builder.whereExists(
        knex_config_default("product_colors as pc").whereRaw("pc.product_fk = p.product_id")
      );
    });
  }
  static async insert(product) {
    try {
      return await knex_config_default("products").insert(product);
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async update({ product_id, ...props }) {
    try {
      return await knex_config_default("products").update(props).where("product_id", product_id);
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async delete(productID) {
    try {
      return await knex_config_default("products").where("product_id", productID).delete();
    } catch (error) {
      throw this.generateError(error);
    }
  }
};
var products_model_default = ProductsModel;

// src/schema/product.schema.ts
import { z as z10 } from "zod";
var base7 = z10.object({
  product_id: databaseKey_schema_default,
  category_fk: databaseKey_schema_default,
  product: z10.string(),
  discount: z10.number().optional(),
  price: z10.number(),
  status: databaseBoolean_schema_default.optional().default(false)
});
var insert7 = base7.omit({
  product_id: true
});
var update7 = base7.partial().extend({
  product_id: base7.shape.product_id
});
var productSchema = {
  base: base7,
  update: update7,
  insert: insert7,
  delete: databaseKey_schema_default
};
var product_schema_default = productSchema;

// src/service/products.service.ts
var ProductsService = class extends service_utils_default {
  static async get() {
    const products = await products_model_default.select();
    if (products.length === 0) throw new errorHandler_utilts_default({
      message: "No se encontraron productos",
      status: 404
    });
    return products;
  }
  static async update(products) {
    const data = zodParse_helper_default(product_schema_default.update.array())(products);
    return await this.writeOperationsHandler(data, (e) => products_model_default.update(e));
  }
  static async insert(products) {
    const data = zodParse_helper_default(product_schema_default.insert.array())(products);
    return await this.writeOperationsHandler(data, (e) => products_model_default.insert(e));
  }
  static async delete(products) {
    const data = zodParse_helper_default(product_schema_default.delete.array())(products);
    return await this.writeOperationsHandler(data, (e) => products_model_default.delete(e));
  }
};
var products_service_default = ProductsService;

// src/controller/products.controller.ts
var ProductsController = class {
  static async getProductsPerCategory(_, res, next) {
    try {
      const data = await products_service_default.get();
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async addProducts(req, res, next) {
    try {
      const data = await products_service_default.insert(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async modifyProducts(req, res, next) {
    try {
      const data = await products_service_default.update(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async removeProducts(req, res, next) {
    try {
      const data = await products_service_default.delete(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
};
var products_controller_default = ProductsController;

// src/router/products.router.ts
var productsRouter = express7.Router();
productsRouter.get("/category/:category_id", products_controller_default.getProductsPerCategory);
productsRouter.post("/", isAdmin_middleware_default, products_controller_default.addProducts);
productsRouter.patch("/", isAdmin_middleware_default, products_controller_default.modifyProducts);
productsRouter.delete("/", isAdmin_middleware_default, products_controller_default.removeProducts);
var products_router_default = productsRouter;

// src/router/productsRecomendations.router.ts
import express8 from "express";

// src/model/categoriesRecomendations.model.ts
var CategoriesRecomendationsModel = class extends model_utils_default {
  static async randomRecomendation({ limit }) {
    try {
      const subQueryCategoriesPerBrand = knex_config_default("categories").select(
        "*",
        knex_config_default.raw("ROW_NUMBER() OVER (PARTITION BY brand_fk ORDER BY RAND()) AS row_num")
      ).whereExists(
        //Selecciona las categorias si unicamente tienen al menos un producto activo.
        knex_config_default("products as p").select("category_fk").whereRaw("p.category_fk = category_id").where("status", true)
      ).where("status", true);
      const query = knex_config_default("brands as b").select("brand", "category", "brand_id", "category_id").innerJoin(subQueryCategoriesPerBrand.as("c"), (c) => {
        c.on("c.brand_fk", "b.brand_id");
      }).where("c.row_num", 1).where("b.status", true).limit(limit);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
};
var categoriesRecomendations_model_default = CategoriesRecomendationsModel;

// src/service/productsRecomendations.service.ts
var ProductsRecomendationsService = class {
  static async getRandomProductRecomendation() {
    const res = await categoriesRecomendations_model_default.randomRecomendation({ limit: 3 });
    if (res.length === 0) throw new errorHandler_utilts_default({ message: "No se encontraron categorias para recomendar.", status: 404 });
    return await Promise.all(res.map(async (i) => {
      return {
        ...i,
        products: await products_model_default.select({ category_fk: i.category_id, status: true })
      };
    }));
  }
};
var productsRecomendations_service_default = ProductsRecomendationsService;

// src/controller/productsRecomendations.controller.ts
var ProductsRecomendationsController = class {
  static async getRandomProductRecomendation(_, res, next) {
    try {
      const products = await productsRecomendations_service_default.getRandomProductRecomendation();
      res.json({
        data: {
          products
        }
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
};
var productsRecomendations_controller_default = ProductsRecomendationsController;

// src/router/productsRecomendations.router.ts
var productRecomendationsRouter = express8.Router();
productRecomendationsRouter.get("/random", productsRecomendations_controller_default.getRandomProductRecomendation);
var productsRecomendations_router_default = productRecomendationsRouter;

// src/router/productsView.router.ts
import express9 from "express";

// src/service/productFullview.service.ts
var handleEmptyResult = (isError, message) => {
  if (isError) throw new errorHandler_utilts_default({ message, status: 404 });
};
var ProductFullViewService = class {
  static async getProduct(product_id) {
    const [product] = await products_model_default.selectExistsColors({ product_id, status: true });
    handleEmptyResult(!product, "No se encontro ningun producto");
    return product;
  }
  static async getProductColors(product_fk) {
    const productColorModel = await productColors_model_default.selectExistsSizes({ product_fk });
    handleEmptyResult(productColorModel.length === 0, "No se encontro ningun color asociado al producto");
    return productColorModel;
  }
  static async getProductColorSize(product_color_fk) {
    const color_sizes = await productSizes_model_default.selectWithTableSize({ product_color_fk });
    handleEmptyResult(color_sizes.length === 0, "No se encontro ningun tama\xF1o asociado al color");
    return color_sizes;
  }
  static async getProductColorImage(product_color_fk) {
    const color_images = await productColorImages_model_default.select({ product_color_fk });
    return color_images;
  }
  static async groupByColor(colors) {
    return await Promise.all(
      colors.map(async (i) => {
        const product_color_id = i.product_color_id;
        const color_images = await this.getProductColorImage(product_color_id);
        const color_sizes = await this.getProductColorSize(product_color_id);
        return {
          color: i,
          color_images,
          color_sizes
        };
      })
    );
  }
  static async main(product_id) {
    const product = await this.getProduct(product_id);
    const colors = await this.getProductColors(product.product_id);
    const groupByColor = await this.groupByColor(colors);
    return {
      product,
      colors: groupByColor
    };
  }
};
var productFullview_service_default = ProductFullViewService;

// src/model/productsPreview.model.ts
var productsPreviewModel = async (querys) => {
  try {
    const { color, price, search, size, brand_id, category_id } = querys;
    const subQueryForOneImagePerProductColor = knex_config_default("product_color_images as pci").select(
      "pci.*",
      knex_config_default.raw("ROW_NUMBER() OVER (PARTITION BY pci.product_color_fk) AS row_num")
    );
    const query = knex_config_default("brands as pb").select(
      "p.product_id",
      "p.product",
      "p.discount",
      "p.price",
      "pt.category",
      "pb.brand",
      "pci.url",
      "c.color"
    ).innerJoin("categories as pt", "pt.brand_fk", "pb.brand_id").innerJoin("products as p", "p.category_fk", "pt.category_id").innerJoin("product_colors as pc", "pc.product_fk", "p.product_id").innerJoin("colors as c", "c.color_id", "pc.color_fk").leftJoin(subQueryForOneImagePerProductColor.as("pci"), (pci) => {
      pci.on("pci.product_color_fk", "=", "pc.product_color_id");
      pci.andOn("pci.row_num", "=", 1);
    }).where("p.status", true).where("pb.status", true).where("pt.status", true);
    !size && query.whereExists(
      knex_config_default("product_color_sizes").whereRaw("product_color_fk = pc.product_color_id")
    );
    brand_id && query.where("pb.brand_id", brand_id);
    category_id && query.where("pt.category_id", category_id);
    search && query.whereRaw("p.product LIKE ?", [`%${search}%`]);
    price && query.whereBetween("p.price", price);
    color && query.whereIn("c.color_id", color);
    size && query.whereIn(
      "pc.product_color_id",
      knex_config_default("product_color_sizes").select("product_color_fk").whereIn("size_fk", size)
    );
    return await query;
  } catch (error) {
    throw model_utils_default.generateError(error);
  }
};
var productsPreview_model_default = productsPreviewModel;

// src/utils/toNumber.utilts.ts
var toNumber = (value) => {
  const number = Number(value);
  if (typeof number === "number" && !isNaN(number)) {
    return number;
  } else {
    return 0;
  }
};
var toNumber_utilts_default = toNumber;

// src/service/productsPreview.service.ts
var ProductsPreviewService = class {
  static generateProductPreviewFilters(filterProperties) {
    let res = {};
    for (const key in filterProperties) {
      const k = key;
      const current = filterProperties[k];
      if (current) {
        if (k === "price") {
          const [_min, _max] = current.split("-");
          const min = toNumber_utilts_default(_min);
          const toNumberMax = toNumber_utilts_default(_max);
          const max = !toNumberMax ? 1e10 : toNumberMax;
          const op = (prop) => Math[prop](min, max).toString();
          res[k] = [
            op("min"),
            op("max")
          ];
        } else if (k == "color" || k == "size") {
          const split = current.split("-").filter(Boolean);
          res[k] = split;
        } else {
          res[k] = current;
        }
      }
    }
    return res;
  }
  static async getProductPreview(filterParams) {
    const res = await productsPreview_model_default(filterParams);
    if (res.length == 0) {
      throw new errorHandler_utilts_default({
        message: "No se encontro ningun producto",
        status: 404
      });
    }
    return res;
  }
  static async main(filterProperties) {
    const filterParams = this.generateProductPreviewFilters(filterProperties);
    return await this.getProductPreview(filterParams);
  }
};
var productsPreview_service_default = ProductsPreviewService;

// src/controller/productsView.controller.ts
var ProductsViewController = class {
  static async getProductsPreview(req, res, next) {
    try {
      const { brand_id, category_id } = req.params;
      const { color, price, search, size } = req.query;
      const data = await productsPreview_service_default.main({
        brand_id,
        category_id,
        color,
        price,
        search,
        size
      });
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async getProductFullView(req, res, next) {
    try {
      const { product_id } = req.params;
      const data = await productFullview_service_default.main(product_id);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
};
var productsView_controller_default = ProductsViewController;

// src/router/productsView.router.ts
var productsViewRouter = express9.Router();
productsViewRouter.get("/preview", productsView_controller_default.getProductsPreview);
productsViewRouter.get("/preview/:brand_id", productsView_controller_default.getProductsPreview);
productsViewRouter.get("/preview/:brand_id/:category_id", productsView_controller_default.getProductsPreview);
productsViewRouter.get("/fullview/:product_id", productsView_controller_default.getProductFullView);
var productsView_router_default = productsViewRouter;

// src/router/sizes.router.ts
import express10 from "express";

// src/model/sizes.model.ts
var SizesModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("sizes").where(this.removePropertiesUndefined(props));
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async insert(size) {
    try {
      return await knex_config_default("sizes").insert(size);
    } catch (error) {
      throw this.generateError(error, {
        ER_DUP_ENTRY: "El tama\xF1o que intentas registrar ya se existe en la base de datos."
      });
    }
  }
  static async update({ size_id, ...size }) {
    try {
      return await knex_config_default("sizes").update(size).where("size_id", size_id);
    } catch (error) {
      throw this.generateError(error, {
        ER_DUP_ENTRY: "El nombre del tama\xF1o que intentas actualizar ya existe en la base de datos."
      });
    }
  }
  static async delete(sizesId) {
    try {
      return await knex_config_default("sizes").where("size_id", sizesId).delete();
    } catch (error) {
      throw this.generateError(error);
    }
  }
};
var sizes_model_default = SizesModel;

// src/schema/size.schema.ts
import { z as z11 } from "zod";
var base8 = z11.object({
  size_id: databaseKey_schema_default,
  size: z11.string()
});
var insert8 = base8.omit({
  size_id: true
});
var update8 = base8.partial().extend({
  size_id: base8.shape.size_id
});
var sizeSchema = {
  base: base8,
  update: update8,
  insert: insert8,
  delete: databaseKey_schema_default
};
var size_schema_default = sizeSchema;

// src/service/sizes.service.ts
var SizeService = class extends service_utils_default {
  static async get() {
    const sizes = await sizes_model_default.select();
    if (sizes.length === 0) {
      throw new errorHandler_utilts_default({
        message: "No se encontraron tama\xF1os",
        status: 404
      });
    }
    return sizes;
  }
  static async update(sizes) {
    const data = zodParse_helper_default(size_schema_default.update.array())(sizes);
    return await this.writeOperationsHandler(data, (e) => sizes_model_default.update(e));
  }
  static async insert(sizes) {
    const data = zodParse_helper_default(size_schema_default.insert.array())(sizes);
    return await this.writeOperationsHandler(data, (e) => sizes_model_default.insert(e));
  }
  static async delete(sizes) {
    const data = zodParse_helper_default(size_schema_default.delete.array())(sizes);
    return await this.writeOperationsHandler(data, (e) => sizes_model_default.delete(e));
  }
};
var sizes_service_default = SizeService;

// src/controller/sizes.controller.ts
var SizeController = class {
  static async getSizes(_, res, next) {
    try {
      const data = await sizes_service_default.get();
      res.json({ data });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async addSizes(req, res, next) {
    try {
      const data = await sizes_service_default.insert(req.body);
      res.json({ data });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async modifySizes(req, res, next) {
    try {
      const data = await sizes_service_default.update(req.body);
      res.json({
        data
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async removeSizes(req, res, next) {
    try {
      const data = await sizes_service_default.delete(req.body.sizes);
      res.json({ data });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
};
var sizes_controller_default = SizeController;

// src/router/sizes.router.ts
var sizesRouter = express10.Router();
sizesRouter.get("/", sizes_controller_default.getSizes);
sizesRouter.post("/", isAdmin_middleware_default, sizes_controller_default.addSizes);
sizesRouter.patch("/", isAdmin_middleware_default, sizes_controller_default.modifySizes);
sizesRouter.delete("/", isAdmin_middleware_default, sizes_controller_default.removeSizes);
var sizes_router_default = sizesRouter;

// src/router/users.router.ts
import express11 from "express";

// src/service/userAuth.service.ts
import bcrypt from "bcrypt";

// src/model/users.model.ts
var UsersModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("users").where(this.removePropertiesUndefined(props));
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async update({ user_id, ...props }, modify) {
    try {
      const query = knex_config_default("users").update(props).where("user_id", user_id);
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static updateUnconfirmedEmail(props) {
    return this.update(props, (builder) => {
      builder.where("email_confirmed", false);
    });
  }
  static async insertByLimitIP(user, ip_limit = 0) {
    const { email, fullname, ip, password, phone, permission } = user;
    try {
      return await knex_config_default.raw(`
            INSERT INTO users (fullname,phone,email,password,ip,permission)
            SELECT ?, ?, ?, ?, ?,?
            WHERE (SELECT COUNT(*) FROM users WHERE ip = ?) < ?
              `, [
        fullname,
        phone,
        email,
        password,
        ip,
        permission,
        ip,
        ip_limit
      ]);
    } catch (error) {
      throw this.generateError(error, {
        ER_DUP_ENTRY: "El email que est\xE1s intentando registrar ya est\xE1 en uso."
      });
    }
  }
  static async delete(userID) {
    try {
      return await knex_config_default("users").where("user_id", userID).delete();
    } catch (error) {
      throw this.generateError(error);
    }
  }
};
var users_model_default = UsersModel;

// src/schema/user.schema.ts
import { z as z12 } from "zod";

// src/constant/IPsRegExp.constant.ts
var v4 = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
var v6 = /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)|(([0-9a-fA-F]{1,4}:){1,7}:)|(([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})|(([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2})|(([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3})|(([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4})|(([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5})|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6}))|(:((:[0-9a-fA-F]{1,4}){1,7}|:))|(::))$/;
var v4Mappedv6 = /^::ffff:(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
var IPsRegExp = {
  v4,
  v6,
  v4Mappedv6
};
var IPsRegExp_constant_default = IPsRegExp;

// src/schema/user.schema.ts
var fullnamePattern = {
  regexp: /^[A-Za-z]+( [A-Za-z]+){1,}$/,
  message: "El nombre ingresado no es valido."
};
var passwordPatterns = [
  { regexp: /^(?=.*[A-Z])/, message: "Debe contener al menos una letra may\xFAscula" },
  { regexp: /(?=.*[\W_])/, message: "Debe contener al menos un car\xE1cter especial (o guion bajo)" },
  { regexp: /(?=.*\d)/, message: "Debe contener al menos un n\xFAmero" },
  { regexp: /^.{8,16}$/, message: "Debe tener entre 8 y 16 caracteres de longitud" }
];
var addRegexpInPasswor = (init = z12.string()) => {
  passwordPatterns.forEach(({ regexp, message }) => init = init.regex(regexp, message));
  return init;
};
var base9 = z12.object({
  user_id: databaseKey_schema_default,
  fullname: z12.string().regex(fullnamePattern.regexp, fullnamePattern.message),
  phone: z12.string().nullable().optional().default(null),
  //FALTA MEJORAR ESTO
  email: z12.string().email("El formato del email no es valido"),
  password: addRegexpInPasswor(),
  permission: z12.enum(["admin", "standard"]).optional().default("standard"),
  ip: z12.string().refine((value) => Object.values(IPsRegExp_constant_default).some((i) => i.test(value)), { message: "No es una IP valida.", path: ["ip"] }),
  email_confirmed: databaseBoolean_schema_default.optional().default(false),
  create_at: z12.string().optional()
});
var insert9 = base9.omit({
  user_id: true,
  create_at: true,
  email_confirmed: true
}).extend({
  permission: z12.literal("standard").default("standard")
});
var update9 = base9.partial().extend({
  user_id: base9.shape.user_id
}).omit({
  ip: true,
  permission: true,
  create_at: true
});
var formatUser = base9.omit({
  create_at: true,
  password: true
}).required();
var userSchema = {
  base: base9,
  insert: insert9,
  update: update9,
  delete: databaseKey_schema_default,
  formatUser
};
var user_schema_default = userSchema;

// src/service/userAuth.service.ts
var UserAuthService = class {
  static async findUserByEmail(email) {
    const [user] = await users_model_default.select({ email });
    if (!user) throw new errorHandler_utilts_default({ message: "El email no esta asociado a ningun usuario.", status: 422 });
    return user;
  }
  static async verifyPassword(password, hash) {
    const compare = await bcrypt.compare(password, hash);
    if (!compare) throw new errorHandler_utilts_default({ message: "La contrase\xF1a ingresada es incorrecta.", status: 422 });
  }
  static async main({ email, password }) {
    const user = await this.findUserByEmail(email);
    await this.verifyPassword(password, user.password);
    return zodParse_helper_default(user_schema_default.formatUser)(user);
  }
};
var userAuth_service_default = UserAuthService;

// src/controller/users.controller.ts
var UsersController = class {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userAuth_service_default.main({ email, password });
      req.session.user = user;
      res.json({
        data: user
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async logout(req, res, next) {
    req.session.destroy((err) => {
      if (err) {
        next();
      } else {
        res.json({
          message: "Deslogeo exitoso."
        });
      }
    });
  }
};
var users_controller_default = UsersController;

// src/middleware/isUser.middleware.ts
var isUser = (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    res.status(401).json({
      message: "La sesi\xF3n ha expirado o no existe, por favor inicia sesi\xF3n nuevamente."
    });
  } else {
    next();
  }
};
var isUser_middleware_default = isUser;

// src/router/users.router.ts
var usersRouter = express11.Router();
usersRouter.post("/login", users_controller_default.login);
usersRouter.get("/logout", isUser_middleware_default, users_controller_default.logout);
var users_router_default = usersRouter;

// src/service/userToken.service.ts
import crypto2 from "crypto";

// src/model/userTokens.model.ts
var UserTokensModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("user_tokens as ut").where(this.removePropertiesUndefined(props));
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static selectActiveToken(props, modify) {
    return this.select(props, (builder) => {
      builder.whereRaw("expired_at > NOW()").where("used", false);
      modify && builder.modify(modify);
    });
  }
  static async insertWithTokenLimit(props, tokenLimit) {
    try {
      const { request, ip, token, user_fk, expired_at } = props;
      const parametersForInsert = [request, token, ip, user_fk, expired_at];
      const parametersForSubQuery = [request, user_fk, tokenLimit];
      const query = await knex_config_default.raw(
        `
                INSERT INTO user_tokens (request,token,ip,user_fk,expired_at)
                SELECT ?, ?, ?, ?, ?
                WHERE (SELECT COUNT(*) FROM user_tokens WHERE request = ? AND user_fk = ?) < ?`,
        [
          ...parametersForInsert,
          ...parametersForSubQuery
        ]
      );
      return query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async updateToken({ token, ...userToken }, modify) {
    try {
      const query = knex_config_default("user_tokens").update(userToken).where("token", token);
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static updateNotUsedToken(props) {
    return this.updateToken(props, (builder) => {
      builder.where("used", false);
    });
  }
  static async deleteAllExpiredTokens() {
    try {
      return await knex_config_default("user_tokens").whereRaw("expired_at < NOW()").orWhere("used", true).delete();
    } catch (error) {
      throw this.generateError(error);
    }
  }
};
var userTokens_model_default = UserTokensModel;

// src/utils/getAdjustedUTCDate.utils.ts
var getAdjustedUTCDate = (UTC) => {
  const date = /* @__PURE__ */ new Date();
  date.setUTCHours(date.getUTCHours() + UTC);
  return date;
};
var getAdjustedUTCDate_utils_default = getAdjustedUTCDate;

// src/schema/token.schema.ts
import { z as z13 } from "zod";
var requestTokenSchema = z13.enum(["register_confirm", "email_update", "password_update"]);
var base10 = z13.object({
  user_token_id: databaseKey_schema_default,
  user_fk: databaseKey_schema_default,
  request: requestTokenSchema,
  token: z13.string(),
  ip: z13.string(),
  expired_at: z13.string(),
  used: databaseBoolean_schema_default.optional().default(false),
  created_at: z13.string().optional()
});
var insert10 = base10.omit({
  user_token_id: true,
  created_at: true,
  used: true
});
var update10 = base10.pick({ token: true, used: true });
var userTokenSchema = {
  base: base10,
  insert: insert10,
  update: update10,
  delete: databaseKey_schema_default
};
var token_schema_default = userTokenSchema;

// src/service/userToken.service.ts
var UserTokenService = class {
  static createTokenDate({ timeUnit, timeValue }) {
    const date = getAdjustedUTCDate_utils_default(-3);
    if (timeUnit == "day") {
      date.setUTCDate(date.getUTCDate() + timeValue);
    } else if (timeUnit == "hour") {
      date.setUTCHours(date.getUTCHours() + timeValue);
    } else {
      date.setUTCMinutes(date.getUTCMinutes() + timeValue);
    }
    return date.toISOString().replace("T", " ").substring(0, 19);
  }
  static async createToken(props, { maxTokens, ...tokenDate }) {
    const token = crypto2.randomUUID();
    const data = zodParse_helper_default(token_schema_default.insert)({
      ...props,
      token,
      expired_at: this.createTokenDate(tokenDate)
    });
    const [ResultSetHeader] = await userTokens_model_default.insertWithTokenLimit(data, maxTokens);
    if (ResultSetHeader.affectedRows == 0) {
      throw new errorHandler_utilts_default({
        status: 429,
        message: "Se ha excedido el l\xEDmite de solicitudes de generaci\xF3n de tokens para este usuario."
      });
    }
    return token;
  }
  static async useToken(token) {
    const [user] = await userTokens_model_default.selectActiveToken({ token }, (builder) => builder.select("user_fk"));
    if (!user) {
      throw new errorHandler_utilts_default({
        status: 404,
        message: `El token que est\xE1s intentando utilizar ha expirado`
      });
    }
    await userTokens_model_default.updateNotUsedToken({ token, used: true });
    return user.user_fk;
  }
  static async cleanExpiredTokens({ cleaning_hour, cleaning_minute }) {
    if (cleaning_hour > 23 || cleaning_hour < 0 || cleaning_minute > 60 || cleaning_minute < 0) {
      console.log("The expired token cleanup process failed to initialize due to incorrect time range data.");
      return;
    }
    const current_date = getAdjustedUTCDate_utils_default(-3);
    const expected_date = getAdjustedUTCDate_utils_default(-3);
    expected_date.setUTCHours(cleaning_hour);
    expected_date.setUTCMinutes(cleaning_minute);
    if (expected_date.getTime() - current_date.getTime() <= 0) {
      expected_date.setUTCDate(expected_date.getUTCDate() + 1);
    }
    const milliseconds = expected_date.getTime() - current_date.getTime();
    const hours = Math.floor(milliseconds / 36e5);
    const minutes = Math.ceil(milliseconds % 36e5 / 6e4);
    try {
      const cleanCount = await userTokens_model_default.deleteAllExpiredTokens();
      console.log(`${cleanCount} tokens were cleaned`);
      console.log(`The next token cleanup is in ${hours}H ${minutes}M`);
      setTimeout(() => {
        this.cleanExpiredTokens({ cleaning_hour, cleaning_minute });
      }, milliseconds);
    } catch (error) {
      console.error("Error cr\xEDtico: Fallo al intentar eliminar los tokens expirados. Se requiere atenci\xF3n inmediata.");
    }
  }
};
var userToken_service_default = UserTokenService;

// src/router/userRegister.router.ts
import express12 from "express";

// src/helper/getSessionData.helper.ts
var getSessionData = (keys, session2) => {
  const data = session2[keys];
  if (!data) throw new errorHandler_utilts_default({
    status: 500,
    message: "Problemas internos para encontrar la session."
  });
  return data;
};
var getSessionData_helper_default = getSessionData;

// src/config/nodemailer.config.ts
import nodemailer from "nodemailer";
var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env_constant_default.EMAIL,
    pass: env_constant_default.EMAIL_PASSWORD
  }
});
var nodemailer_config_default = transport;

// src/service/email/sendPasswordUpdate.email.ts
var sendPasswordUpate = async ({ email, token }) => {
  const url = `http://localhost:3000/users/password/update/${token}`;
  return await nodemailer_config_default.sendMail({
    from: "Olga Hat's <olgahats@noreply.com>",
    to: email,
    subject: "Cambio de contrase\xF1a",
    html: `
        <p>Recibimos una solicitud para cambiar tu contrase\xF1a. Si fuiste t\xFA, por favor haz clic en el siguiente enlace para proceder con el cambio:</p>
        <a href=${url}>Cambiar mi contrase\xF1a</a>
        <p><strong>Este enlace expira en 24 horas.</strong></p>
        `
  });
};
var sendPasswordUpdate_email_default = sendPasswordUpate;

// src/service/email/sendRegisterConfirm.email.ts
var sendRegisterConfirm = async ({ email, token }) => {
  return await nodemailer_config_default.sendMail({
    from: "Olga Hat's <olgahats@noreply.com>",
    to: email,
    subject: "Verificaci\xF3n de correo electr\xF3nico",
    html: `
            <p>Gracias por registrarte. Por favor, haz clic en el siguiente enlace para confirmar tu registro:</p>
            <a href="http://localhost:3000/users/register/confirmation/${token}">Confirmar mi registro</a>
            <p><strong>Este enlace expira en 24 horas.</strong></p>
        `
  });
};
var sendRegisterConfirm_email_default = sendRegisterConfirm;

// src/service/email/index.ts
var emailService = {
  sendRegisterConfirm: sendRegisterConfirm_email_default,
  sendPasswordUpate: sendPasswordUpdate_email_default
};
var email_default = emailService;

// src/service/userRegister.service.ts
import bcrypt2 from "bcrypt";

// src/constant/maxAccoutPerIP.constant.ts
var maxAccountPerIp = 10;
var maxAccoutPerIP_constant_default = maxAccountPerIp;

// src/service/userRegister.service.ts
var UserRegisterService = class {
  static async completeRegister(user_id) {
    const updateAffects = await users_model_default.updateUnconfirmedEmail({ user_id, email_confirmed: true });
    if (!updateAffects) {
      throw new errorHandler_utilts_default({
        message: "El email ya ha sido confirmado previamente.",
        status: 409
      });
    }
  }
  static async createAccount(user) {
    const [rawHeaders] = await users_model_default.insertByLimitIP(user, maxAccoutPerIP_constant_default);
    const { insertId, affectedRows } = rawHeaders;
    if (affectedRows == 0) throw new errorHandler_utilts_default({
      message: `Superaste el limite de ${maxAccoutPerIP_constant_default} por IP`,
      status: 429
    });
    return {
      ...user,
      user_id: insertId
    };
  }
  static async createPassword(password) {
    const salt = await bcrypt2.genSalt(10);
    const hash = await bcrypt2.hash(password, salt);
    return hash;
  }
  static async main(user) {
    const data = zodParse_helper_default(user_schema_default.insert)(user);
    const hash = await this.createPassword(data.password);
    const acc = await this.createAccount({ ...data, password: hash });
    return zodParse_helper_default(user_schema_default.formatUser)(acc);
  }
};
var userRegister_service_default = UserRegisterService;

// src/constant/tokenSettings.constant.ts
var tokenSettings = {
  register_confirm: { maxTokens: 10, timeUnit: "day", timeValue: 1 },
  email_update: { maxTokens: 10, timeUnit: "day", timeValue: 1 },
  password_update: { maxTokens: 10, timeUnit: "hour", timeValue: 3 }
};
var tokenSettings_constant_default = tokenSettings;

// src/controller/userRegister.controller.ts
var UserRegisterController = class {
  static async registerReSendToken(req, res, next) {
    try {
      const { user_id, email } = getSessionData_helper_default("user", req.session);
      const token = await userToken_service_default.createToken({
        ip: req.ip || "",
        request: "register_confirm",
        user_fk: user_id
      }, tokenSettings_constant_default.register_confirm);
      await email_default.sendRegisterConfirm({ email, token });
      res.json({
        message: "Re-envio exitoso, revisa tu bandeja de entrada."
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async registerConfirm(req, res, next) {
    try {
      const { token } = req.params;
      const userID = await userToken_service_default.useToken(token);
      await userRegister_service_default.completeRegister(userID);
      if (req.session.user) {
        req.session.user.email_confirmed = true;
      }
      res.json({
        message: "Registro confirmado con exito!"
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async register(req, res, next) {
    try {
      const account = await userRegister_service_default.main({
        ...req.body,
        ip: req.ip
      });
      const token = await userToken_service_default.createToken(
        {
          ip: account.ip,
          request: "register_confirm",
          user_fk: account.user_id
        },
        tokenSettings_constant_default.register_confirm
      );
      await email_default.sendRegisterConfirm({
        email: account.email,
        token
      });
      req.session.user = account;
      res.json({
        message: "Cuenta creada creado con \xE9xito, por favor confirma el email registrado.",
        data: {
          created_id: account.user_id
        }
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
};
var userRegister_controller_default = UserRegisterController;

// src/middleware/isConfirmedEmail.middleware.ts
var response = (res) => {
  res.status(400).json({
    message: "El email ya est\xE1 confirmado. No es necesario reenviar el token."
  });
};
var isConfirmedEmail = async (req, res, next) => {
  const user = req.session.user;
  if (user && user.email_confirmed) {
    response(res);
  } else if (user) {
    const [u] = await users_model_default.select({ user_id: user.user_id }, (builder) => builder.select("email_confirmed"));
    const { email_confirmed } = u;
    if (email_confirmed) {
      user.email_confirmed = true;
      response(res);
    } else {
      next();
    }
  }
};
var isConfirmedEmail_middleware_default = isConfirmedEmail;

// src/router/userRegister.router.ts
var userRegisterRouter = express12.Router();
userRegisterRouter.post("/", userRegister_controller_default.register);
userRegisterRouter.get("/confirmation/:token", userRegister_controller_default.registerConfirm);
userRegisterRouter.get("/reSendToken", isUser_middleware_default, isConfirmedEmail_middleware_default, userRegister_controller_default.registerReSendToken);
var userRegister_router_default = userRegisterRouter;

// src/router/userAccounter.router.ts
import express13 from "express";

// src/controller/userAccount.controller.ts
var UserAccountController = class {
  static passwordUpdate(_, res, next) {
    try {
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
};
var userAccount_controller_default = UserAccountController;

// src/router/userAccounter.router.ts
var userAccountRouter = express13.Router();
userAccountRouter.get("/password/update", userAccount_controller_default.passwordUpdate);
var userAccounter_router_default = userAccountRouter;

// src/index.ts
var port = 3e3;
var app = express14();
app.use(express14.json());
app.use(session_config_default);
app.use(cors_config_default);
app.use("/categories", categories_router_default);
app.use("/products", products_router_default);
app.use("/products/recomendations", productsRecomendations_router_default);
app.use("/products/view", productsView_router_default);
app.use("/products/colors", isAdmin_middleware_default, productColors_router_default);
app.use("/products/colors/sizes", isAdmin_middleware_default, ProductColorSizes_router_default);
app.use("/products/colors/images", isAdmin_middleware_default, ProductColorImages_router_default);
app.use("/brands", brands_router_default);
app.use("/sizes", sizes_router_default);
app.use("/colors", colors_router_default);
app.use("/users", users_router_default);
app.use("/users/register", userRegister_router_default);
app.use("/users/account/", userAccounter_router_default);
app.use(errorGlobal_middleware_default);
userToken_service_default.cleanExpiredTokens({ cleaning_hour: 12, cleaning_minute: 0 });
app.listen(port, () => console.log("SERVER START"));
