// src/index.ts
import express15 from "express";

// src/config/cors.config.ts
import cors from "cors";
var corsConfig = cors();
var cors_config_default = corsConfig;

// src/config/dotenv.config.ts
import dotenv from "dotenv";
var dotenvConfig = dotenv.config({ path: ".env.local" });

// src/config/mercadopago.config.ts
import { MercadoPagoConfig } from "mercadopago";

// src/constant/_env.constant.ts
var _env = process.env;
var env_constant_default = _env;

// src/config/mercadopago.config.ts
var mercadoPagoConfig = new MercadoPagoConfig({
  accessToken: env_constant_default.MP_ACCESS_TOKEN
});
var mercadopago_config_default = mercadoPagoConfig;

// src/rate-limiter/default.rate-limiter.ts
import { rateLimit } from "express-rate-limit";

// src/utils/rateLimitHandler.utilts.ts
var rateLimitHandler = (req, res) => {
  const currentTime = /* @__PURE__ */ new Date();
  const time = req.rateLimit?.resetTime || currentTime;
  const resetTime = new Date(time);
  const diffToSeconds = (resetTime.getTime() - currentTime.getTime()) / 1e3;
  const minutes = Math.floor(diffToSeconds / 60);
  const seconds = Math.floor(diffToSeconds % 60);
  res.status(429).json({
    message: `Para continuar con esta operacion deber esperar ${minutes}M ${seconds}S`,
    code: "rate_limit",
    data: {
      seconds,
      minutes,
      date: resetTime
    }
  });
};
var rateLimitHandler_utilts_default = rateLimitHandler;

// src/rate-limiter/default.rate-limiter.ts
var defaultLimiter = rateLimit({
  windowMs: 5 * 60 * 1e3,
  //5 minutos 
  limit: 150 * 350,
  handler: rateLimitHandler_utilts_default
});
var default_rate_limiter_default = defaultLimiter;

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
    httpOnly: true,
    sameSite: "lax"
  }
});
var session_config_default = sessionConfig;

// src/utils/errorHandler.utilts.ts
var ErrorHandler = class _ErrorHandler extends Error {
  message;
  name;
  status;
  data;
  code;
  constructor({ message, status, data, code }) {
    super();
    this.message = message || "";
    this.name = "ErrorHandler", this.status = status && status >= 100 && status <= 599 ? status : 500;
    this.data = data;
    this.code = code || "err";
  }
  static isInstanceOf(instance) {
    return instance instanceof _ErrorHandler;
  }
  response(res) {
    res.status(this.status).json({
      message: this.message || void 0,
      data: this.data,
      code: this.code
    });
  }
};
var errorHandler_utilts_default = ErrorHandler;

// src/middleware/errorGlobal.middleware.ts
var errorGlobal = (_, res) => {
  new errorHandler_utilts_default({
    status: 500,
    message: "Ocurri\xF3 un error inesperado en el servidor.",
    code: "err_internal"
  }).response(res);
};
var errorGlobal_middleware_default = errorGlobal;

// src/middleware/isAdmin.middleware.ts
var isAdmin = (req, res, next) => {
  const user = req.session.user_info;
  if (user && user.permission == "admin") {
    next();
  } else {
    new errorHandler_utilts_default({
      message: "No estas autorizado para continuar con esta operacion.",
      status: 401,
      code: "session_unauthorized"
    }).response(res);
  }
};
var isAdmin_middleware_default = isAdmin;

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
    database: DB,
    timezone: "+00:00"
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
  "ER_NO_REFERENCED_ROW_2": 400,
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
var DatabaseErrorHandler = class _DatabaseErrorHandler extends errorHandler_utilts_default {
  queryError;
  constructor(queryError, messages = {}) {
    super({
      message: messages[queryError.code] || defaultMessage,
      status: sqlErrorMapping[queryError.code],
      code: `SQL_${queryError.code}`
    });
    this.queryError = queryError;
    this.name = "DatabaseErrorHandler";
  }
  static isSqlError(error) {
    return error?.sql;
  }
  static isInstanceOf(instance) {
    return instance instanceof _DatabaseErrorHandler;
  }
};
var databaseErrorHandler_utilts_default = DatabaseErrorHandler;

// src/utils/model.utils.ts
var ModelUtils = class {
  static generateError(error, messages = {}) {
    if (databaseErrorHandler_utilts_default.isSqlError(error)) {
      return new databaseErrorHandler_utilts_default(error, messages);
    } else {
      throw new errorHandler_utilts_default({
        code: "SQL_ERROR",
        message: "Ocurrio un error desconocido en la base de datos.",
        status: 500
      });
    }
  }
};
var model_utils_default = ModelUtils;

// src/model/users.model.ts
var UsersModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("users").where(props);
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

// src/middleware/isUser.middleware.ts
var isUser = (req, res, next) => {
  const user = req.session.user_info;
  if (user) {
    next();
  } else {
    new errorHandler_utilts_default({
      status: 401,
      message: "La sesi\xF3n ha expirado, por favor inicia sesi\xF3n nuevamente.",
      code: "session_expired"
    }).response(res);
  }
};
var isUser_middleware_default = isUser;

// src/middleware/isCompleteUser.middleware.ts
var isCompleteUser = async (req, res, next) => {
  const user = req.session.user_info;
  if (!user) return isUser_middleware_default(req, res, next);
  if (user.email_confirmed) {
    return next();
  }
  const [u] = await users_model_default.select({ user_id: user.user_id }, (builder) => builder.select("email_confirmed"));
  const { email_confirmed } = u;
  if (email_confirmed) {
    user.email_confirmed = true;
    next();
  } else {
    new errorHandler_utilts_default({
      status: 401,
      message: "Por favor, confirma tu direcci\xF3n de correo electr\xF3nico para continuar con esta operaci\xF3n.",
      code: "session_unauthorized"
    }).response(res);
  }
};
var isCompleteUser_middleware_default = isCompleteUser;

// src/router/brands.router.ts
import express from "express";

// src/utils/zodErrorHandler.utilts.ts
import { ZodError } from "zod";
function transformErrorToClient(zod_error) {
  return zod_error.issues.map(({ message, path, code }) => {
    return {
      source: path.length > 0 ? path : [code],
      reason: message
    };
  });
}
var ZodErrorHandler = class extends errorHandler_utilts_default {
  zod_error;
  constructor(error) {
    super({
      status: 400,
      data: transformErrorToClient(error),
      code: "zod_err"
    });
    this.zod_error = error;
  }
  static isZodError(error) {
    return error instanceof ZodError;
  }
};
var zodErrorHandler_utilts_default = ZodErrorHandler;

// src/helper/zodParse.helper.ts
var zodParse = (z2) => {
  return (data) => {
    try {
      return z2.parse(data);
    } catch (error) {
      if (zodErrorHandler_utilts_default.isZodError(error)) {
        throw new zodErrorHandler_utilts_default(error);
      }
      throw error;
    }
  };
};
var zodParse_helper_default = zodParse;

// src/model/brands.model.ts
var BrandsModel = class extends model_utils_default {
  static async select(props = {}) {
    try {
      const query = knex_config_default("brands as b").where(props);
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
        ER_DUP_ENTRY: "El nombre de la marca que intentas registrar ya se existe en la base de datos."
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

// src/service/brands.service.ts
import { brandSchema } from "clothing-store-shared/schema";

// src/utils/service.utils.ts
var ServiceUtils = class {
  static async writeOperationsHandler(input, operation, logic) {
    const errors = [];
    for (const e of input) {
      try {
        const res = await operation(e);
        logic && logic(res);
      } catch (error) {
        errors.push({
          source: e,
          reason: errorHandler_utilts_default.isInstanceOf(error) ? error.message : typeof error === "string" ? error : "Error desconocido."
        });
      }
    }
    return (code) => {
      if (errors.length > 0) throw new errorHandler_utilts_default({
        data: errors,
        code: `${code}_write_failed`,
        status: 206
      });
    };
  }
  static genericMessage({ text, action }) {
    return `Al parecer ${text} que intentas ${action} no existe.`;
  }
};
var service_utils_default = ServiceUtils;

// src/service/brands.service.ts
var BrandsService = class extends service_utils_default {
  static async get() {
    const brands = await brands_model_default.select();
    if (brands.length === 0) throw new errorHandler_utilts_default({
      message: "No se econtro ninguna marca",
      status: 404,
      code: "brands_not_found"
    });
    return brands;
  }
  static async update(brands) {
    const data = zodParse_helper_default(brandSchema.update.array().min(1))(brands);
    const res = await this.writeOperationsHandler(
      data,
      (e) => brands_model_default.update(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "la marca", action: "actualizar" });
      }
    );
    res("brands_update");
  }
  static async insert(brands) {
    const data = zodParse_helper_default(brandSchema.insert.array().min(1))(brands);
    const res = await this.writeOperationsHandler(data, (e) => brands_model_default.insert(e));
    res("brands_insert");
  }
  static async delete(brands) {
    const data = zodParse_helper_default(brandSchema.delete.array().min(1))(brands);
    const res = await this.writeOperationsHandler(
      data,
      (e) => brands_model_default.delete(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "la marca", action: "eliminar" });
      }
    );
    res("brands_delete");
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
      await brands_service_default.insert(req.body);
      res.json({
        message: "Todas las marcas agregadas modificas exitosamente."
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
      await brands_service_default.update(req.body);
      res.json({
        message: "Todas las marcas fueron modificas exitosamente."
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
      await brands_service_default.delete(req.body);
      res.json({
        message: "Todas las marcas fueron modificas exitosamente."
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

// src/model/categories.model.ts
var CategoriesModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("categories as c").where(props);
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
      throw this.generateError(error, {
        "ER_NO_REFERENCED_ROW_2": "La marca que intentas referenciar con la categoria no existe."
      });
    }
  }
  static async update({ category_id, ...category }) {
    try {
      return await knex_config_default("categories").update(category).where("category_id", category_id);
    } catch (error) {
      throw this.generateError(error, {
        "ER_NO_REFERENCED_ROW_2": "La marca que intentas referenciar con la categoria no existe."
      });
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
import { categorySchema } from "clothing-store-shared/schema";
var CategoriesService = class extends service_utils_default {
  static async getByBrand(brand_fk) {
    const categories = await categories_model_default.select({ brand_fk });
    if (categories.length === 0) throw new errorHandler_utilts_default({
      message: "No se encontraron categorias.",
      status: 404,
      code: "categories_not_found"
    });
    return categories;
  }
  static async update(categories) {
    const data = zodParse_helper_default(categorySchema.update.array().min(1))(categories);
    const res = await this.writeOperationsHandler(
      data,
      (e) => categories_model_default.update(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "la categoria", action: "actualizar" });
      }
    );
    res("categories_update");
  }
  static async insert(categories) {
    const data = zodParse_helper_default(categorySchema.insert.array().min(1))(categories);
    const res = await this.writeOperationsHandler(data, (e) => categories_model_default.insert(e));
    res("categories_insert");
  }
  static async delete(categories) {
    const data = zodParse_helper_default(categorySchema.delete.array().min(1))(categories);
    const res = await this.writeOperationsHandler(
      data,
      (e) => categories_model_default.delete(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "la categoria", action: "eliminar" });
      }
    );
    res("categories_delete");
  }
};
var categories_service_default = CategoriesService;

// src/controller/categories.controller.ts
var CategoriesController = class {
  static async getByBrand(req, res, next) {
    try {
      const { brand_id } = req.params;
      const data = await categories_service_default.getByBrand(brand_id);
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
      await categories_service_default.insert(req.body);
      res.json({
        message: "Categorias agregadas exitosamente."
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
      await categories_service_default.update(req.body);
      res.json({
        message: "Categorias modificadas exitosamente."
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
      await categories_service_default.delete(req.body);
      res.json({
        message: "Todas las categorias se removiero exitosamente."
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
categoriesRouter.get("/brand/:brand_id", categories_controller_default.getByBrand);
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
      const query = knex_config_default("colors").where(props);
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

// src/service/colors.service.ts
import { colorSchema } from "clothing-store-shared/schema";
var ColorsService = class extends service_utils_default {
  static async get() {
    const res = await colors_model_default.select();
    if (res.length === 0) {
      throw new errorHandler_utilts_default({
        message: "No se encontraron colores.",
        status: 404,
        code: "colors_not_found"
      });
    }
    return res;
  }
  static async delete(colors) {
    const data = zodParse_helper_default(colorSchema.delete.array().min(1))(colors);
    const res = await this.writeOperationsHandler(
      data,
      (color) => colors_model_default.delete(color),
      (e) => {
        if (!e) throw this.genericMessage({ text: "el color", action: "eliminar" });
      }
    );
    res("colors_delete");
  }
  static async insert(colors) {
    const data = zodParse_helper_default(colorSchema.insert.array().min(1))(colors);
    const res = await this.writeOperationsHandler(data, (color) => colors_model_default.insert(color));
    res("colors_insert");
  }
  static async update(colors) {
    const data = zodParse_helper_default(colorSchema.update.array().min(1))(colors);
    const res = await this.writeOperationsHandler(
      data,
      (color) => colors_model_default.update(color),
      (e) => {
        if (!e) throw this.genericMessage({ text: "el color", action: "actualizar" });
      }
    );
    res("colors_update");
  }
};
var colors_service_default = ColorsService;

// src/controller/colors.controller.ts
var ColorsController = class {
  static async addColors(req, res, next) {
    try {
      await colors_service_default.insert(req.body);
      res.json({
        message: "Colores agregados correctamente."
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
      await colors_service_default.update(req.body);
      res.json({
        message: "Colores modificados correctamente."
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
      await colors_service_default.delete(req.body);
      res.json({
        message: "Colores eliminados correctamente."
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
      const data = await colors_service_default.get();
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

// src/router/mercadoPago.router.ts
import express4 from "express";

// src/helper/getSessionData.helper.ts
var getSessionData = (keys, session2) => {
  const data = session2[keys];
  if (!data) {
    throw new errorHandler_utilts_default({
      status: 500,
      message: "Problemas internos para encontrar la session."
    });
  }
  return data;
};
var getSessionData_helper_default = getSessionData;

// src/service/mercadoPago.service.ts
import { Payment, Preference } from "mercadopago";

// src/model/userPurchaseProducts.model.ts
var UserPurchaseProductsModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("user_purchase_products as upp").where(props);
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async selectForUser({ user_fk, ...props }, modify) {
    return this.select(props, (builder) => {
      builder.whereExists(
        knex_config_default("user_purchases").where({ user_fk, user_purchase_id: props.user_purchase_fk })
      );
      modify && builder.modify(modify);
    });
  }
  static async selectDetailed(props = {}, modify) {
    return this.select(props, (builder) => {
      builder.innerJoin("products as p", "p.product_id", "upp.product_fk").innerJoin("colors as c", "c.color_id", "upp.color_fk").innerJoin("sizes as s", "s.size_id", "upp.size_fk");
      modify && builder.modify(modify);
    });
  }
  static async selectDetailedForUser({ user_fk, ...props }, modify) {
    return this.selectDetailed(props, (builder) => {
      builder.whereExists(
        knex_config_default("user_purchases").where({ user_fk, user_purchase_id: props.user_purchase_fk })
      );
      modify && builder.modify(modify);
    });
  }
  static async insert(props, tsx = knex_config_default) {
    const { color_fk, product_fk, size_fk, user_purchase_fk, quantity } = props;
    try {
      const query = tsx.raw(`
                INSERT INTO user_purchase_products (product_fk,user_purchase_fk,color_fk,size_fk,quantity,price,discount)
                SELECT ?,?,?,?,?,p.price,p.discount FROM
                products p
                INNER JOIN product_colors pc ON pc.product_fk = p.product_id 
                INNER JOIN product_color_sizes pcs ON pcs.product_color_fk = pc.product_color_id  
                WHERE p.product_id = ? AND 
                p.status = true AND 
                pc.color_fk = ? AND  
                pcs.size_fk = ? AND
                pcs.stock = true  
                `, [
        product_fk,
        user_purchase_fk,
        color_fk,
        size_fk,
        quantity,
        product_fk,
        color_fk,
        size_fk
      ]);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
};
var userPurchaseProducts_model_default = UserPurchaseProductsModel;

// src/service/mercadoPago.service.ts
var preferences = new Preference(mercadopago_config_default);
var payment = new Payment(mercadopago_config_default);
var MercadoPagoService = class {
  static async getPayment(external_reference) {
    try {
      return await payment.search({ options: { external_reference } });
    } catch (error) {
      return new errorHandler_utilts_default({
        message: "Pago no encontrado.",
        status: 404,
        code: "payment_not_found"
      });
    }
  }
  static async getPreference(preference_id) {
    try {
      return await preferences.get({ preferenceId: preference_id });
    } catch (error) {
      return new errorHandler_utilts_default({
        message: "Preferencia no encontrada",
        status: 404,
        code: "preference_not_found"
      });
    }
  }
  static async createCheckout({
    items,
    external_reference,
    date_of_expiration,
    shipments
  }) {
    return await preferences.create({
      body: {
        items,
        external_reference: external_reference.toString(),
        expires: true,
        date_of_expiration: this.toMercadoPagoFormat(date_of_expiration),
        shipments: {
          ...shipments,
          mode: "not_specified"
        }
      }
    });
  }
  static async transformProductsToCheckoutItems(props) {
    const data = await userPurchaseProducts_model_default.selectDetailedForUser(
      props,
      (build) => build.select(knex_config_default.raw(
        `
                user_purchase_product_id as id,
                product as title,
                quantity,
                upp.price * (1 - (upp.discount / 100)) as unit_price,
                CONCAT('Color:',' ',color,' | ','Talle:',' ',size) as description,
                'ARS' as currency_id
                `
      ))
    );
    if (data.length == 0) throw new errorHandler_utilts_default({
      status: 404,
      message: "No se pueden generar productos para la preferencia, ya que no se encontraron productos asociados a la orden.",
      code: "products_not_found"
    });
    return data;
  }
  static toMercadoPagoFormat(date) {
    const offset = "-04:00";
    date.setUTCHours(date.getUTCHours() - 4);
    const isoString = date.toISOString().replace("Z", "");
    const [datePart, timePart] = isoString.split("T");
    return `${datePart}T${timePart.slice(0, 8)}${offset}`;
  }
};
var mercadoPago_service_default = MercadoPagoService;

// src/model/userPurchases.model.ts
var UserPurchasesModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("user_purchases as up").where(props);
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async insert(user_purchase, modify) {
    try {
      const query = knex_config_default("user_purchases").insert(user_purchase);
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async update({ user_purchase_id, ...user_purchase }, modify) {
    try {
      const query = knex_config_default("user_purchases").where({ user_purchase_id }).update(user_purchase);
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static async updateForUser({ user_fk, ...props }) {
    return this.update(props, (builder) => {
      builder.where("user_fk", user_fk);
    });
  }
};
var userPurchases_model_default = UserPurchasesModel;

// src/service/userPurchases.service.ts
import { userPurchaseSchema } from "clothing-store-shared/schema";
var UserPurchasesService = class {
  static async updateForUser(props) {
    const parse = zodParse_helper_default(userPurchaseSchema.updateForUser)(props);
    return await userPurchases_model_default.updateForUser(parse);
  }
  static async getForUser({ user_purchase_id, user_fk }) {
    const [res] = await userPurchases_model_default.select({ user_purchase_id, user_fk });
    if (!res) throw new errorHandler_utilts_default({
      message: "No se encontr\xF3 ninguna orden con la id especificada.",
      status: 404,
      code: "order_not_found"
    });
    return res;
  }
};
var userPurchases_service_default = UserPurchasesService;

// src/service/userPurchaseShippings.service.ts
var UserPurchaseShippings = class {
  static async calculateFreeShipping(props) {
    const [res] = await userPurchaseProducts_model_default.selectForUser(
      props,
      (builder) => {
        builder.select(
          knex_config_default.raw("SUM(price * (1-(discount / 100)) * quantity) as total")
        );
      }
    );
    const { total } = res;
    if (!total) {
      throw new errorHandler_utilts_default({
        message: "No se pudo calcular el total porque no existen productos asociados a la orden con el ID especificado.",
        status: 404,
        code: "order_products_not_found"
      });
    }
    return total;
  }
};
var userPurchaseShippings_service_default = UserPurchaseShippings;

// src/constant/storeConfig.contant.ts
var storeConfig = {
  maxAccountPerIp: 10,
  minFreeShipping: 9e4
};

// src/controller/mercadoPago.controller.ts
var MercadoPagoController = class {
  static async checkout(req, res, next) {
    try {
      const { user_id } = getSessionData_helper_default("user_info", req.session);
      const { user_purchase_id = "" } = req.query;
      const transform = await mercadoPago_service_default.transformProductsToCheckoutItems({
        user_fk: user_id,
        user_purchase_fk: user_purchase_id
      });
      const total = await userPurchaseShippings_service_default.calculateFreeShipping({
        user_fk: user_id,
        user_purchase_fk: user_purchase_id
      });
      const { init_point, date_of_expiration, id } = await mercadoPago_service_default.createCheckout({
        items: transform,
        external_reference: user_purchase_id,
        date_of_expiration: res.locals.expired_date,
        shipments: {
          cost: 15e3,
          free_shipping: total >= storeConfig.minFreeShipping
        }
      });
      await userPurchases_service_default.updateForUser({
        user_purchase_id,
        preference_id: id,
        user_fk: user_id
      });
      res.status(201).json({
        data: {
          init_point,
          date_of_expiration
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
var mercadoPago_controller_default = MercadoPagoController;

// src/middleware/verifyOrderPreference.middleware.ts
var verifyOrderPreference = async (req, res, next) => {
  const { user_purchase_id = "" } = req.query;
  const [{ preference_id, expire_at = "", user_purchase_id: id } = {}] = await userPurchases_model_default.select({ user_purchase_id }, (builder) => builder.select("preference_id", "expire_at", "user_purchase_id"));
  const current_date = /* @__PURE__ */ new Date();
  const expired_date = new Date(expire_at);
  if (!id) {
    new errorHandler_utilts_default({
      message: `No se encontro ninguna orden de compra.`,
      status: 404
    }).response(res);
    return;
  } else if (current_date > expired_date) {
    new errorHandler_utilts_default({
      message: "No puedes obtener la preferencia de pago debido a que venci\xF3 el plazo de la orden de compra.",
      status: 403
    }).response(res);
    return;
  }
  const preference = await mercadoPago_service_default.getPreference(preference_id?.toString());
  if (!errorHandler_utilts_default.isInstanceOf(preference)) {
    const { init_point, date_of_expiration } = preference;
    res.json({
      data: {
        init_point,
        date_of_expiration
      }
    });
  } else {
    res.locals = {
      expired_date
    };
    next();
  }
};
var verifyOrderPreference_middleware_default = verifyOrderPreference;

// src/router/mercadoPago.router.ts
var mercadoPagoRouter = express4.Router();
mercadoPagoRouter.get("/checkout", verifyOrderPreference_middleware_default, mercadoPago_controller_default.checkout);
var mercadoPago_router_default = mercadoPagoRouter;

// src/router/order.router.ts
import { Router } from "express";

// src/service/orders.service.ts
import { userPurchaseProductSchema, userPurchaseSchema as userPurchaseSchema2 } from "clothing-store-shared/schema";
var OrdersService = class extends service_utils_default {
  static adapteExpireDataToDB(date) {
    return date.toISOString().replace("T", " ").substring(0, 19);
  }
  static async create({ order, order_products }) {
    let tsx = {};
    try {
      const orderData = zodParse_helper_default(userPurchaseSchema2.insert)({
        ...order,
        expire_at: this.adapteExpireDataToDB(order.expire_at)
      });
      tsx = await knex_config_default.transaction();
      const [user_purchase_id] = await userPurchases_model_default.insert(orderData, (builder) => builder.transacting(tsx));
      const productsWithID = order_products.map((i) => ({ ...i, user_purchase_fk: user_purchase_id }));
      const productsData = zodParse_helper_default(userPurchaseProductSchema.insert.array().min(1))(productsWithID);
      const user_purchase_products_id = await Promise.all(productsData.map(async (i) => {
        const [result] = await userPurchaseProducts_model_default.insert(i, tsx);
        if (result.affectedRows == 0) throw new errorHandler_utilts_default({
          status: 400,
          message: "Problemas con los productos de la orden.",
          data: i,
          code: "product_unavailable"
        });
        return result.insertId;
      }));
      await tsx.commit();
      return {
        user_purchase_id,
        user_purchase_products_id
      };
    } catch (error) {
      if (tsx.rollback) await tsx.rollback();
      throw error;
    }
  }
};
var orders_service_default = OrdersService;

// src/service/userPurchaseProducts.service.ts
var UserPurchaseProductService = class extends service_utils_default {
  static async getForUser({ user_purchase_fk, user_fk }) {
    const res = await userPurchaseProducts_model_default.selectDetailedForUser({ user_purchase_fk, user_fk });
    if (res.length == 0) throw new errorHandler_utilts_default({
      status: 404,
      message: "Los detalles de la orden que intentas obtener no se encuentran disponibles.",
      code: "order_products_not_found"
    });
    return res;
  }
};
var userPurchaseProducts_service_default = UserPurchaseProductService;

// src/utils/getAdjustedUTCDate.utils.ts
var getAdjustedUTCDate = (UTC) => {
  const date = /* @__PURE__ */ new Date();
  date.setUTCHours(date.getUTCHours() + UTC);
  return date;
};
var getAdjustedUTCDate_utils_default = getAdjustedUTCDate;

// src/controller/order.controller.ts
var OrderController = class {
  static async createOrder(req, res, next) {
    try {
      const user = getSessionData_helper_default("user_info", req.session);
      const { order = {}, order_products = [] } = req.body;
      const expire_date = getAdjustedUTCDate_utils_default(3);
      const { user_purchase_id } = await orders_service_default.create({
        order: {
          ...order,
          user_fk: user.user_id,
          expire_at: expire_date
        },
        order_products
      });
      const transform = await mercadoPago_service_default.transformProductsToCheckoutItems({
        user_fk: user.user_id,
        user_purchase_fk: user_purchase_id
      });
      const total = await userPurchaseShippings_service_default.calculateFreeShipping({
        user_fk: user.user_id,
        user_purchase_fk: user_purchase_id
      });
      const data = await mercadoPago_service_default.createCheckout({
        items: transform,
        external_reference: user_purchase_id,
        date_of_expiration: expire_date,
        shipments: {
          cost: 15e3,
          free_shipping: total >= storeConfig.minFreeShipping
        }
      });
      await userPurchases_service_default.updateForUser({
        user_purchase_id,
        preference_id: data.id,
        user_fk: user.user_id
      });
      const { init_point, date_of_expiration } = data;
      res.status(201).json({
        data: {
          init_point,
          date_of_expiration
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
  static async getOrder(req, res, next) {
    try {
      const { purchase_id = "" } = req.query;
      const { user_id } = getSessionData_helper_default("user_info", req.session);
      const data = await userPurchases_service_default.getForUser({
        user_fk: user_id,
        user_purchase_id: purchase_id
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
  static async getOrderDetails(req, res, next) {
    try {
      const { user_id } = getSessionData_helper_default("user_info", req.session);
      const { purchase_id = "" } = req.query;
      const data = await userPurchaseProducts_service_default.getForUser({ user_purchase_fk: purchase_id, user_fk: user_id });
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
var order_controller_default = OrderController;

// src/router/order.router.ts
var orderRouter = Router();
orderRouter.post("/", order_controller_default.createOrder);
orderRouter.get("/", order_controller_default.getOrder);
orderRouter.get("/details", order_controller_default.getOrderDetails);
var order_router_default = orderRouter;

// src/router/ProductColorImages.router.ts
import express5 from "express";

// src/service/productColorImages.service.ts
import { productColorImageSchema } from "clothing-store-shared/schema";

// src/model/productColorImages.model.ts
var ProductColorImagesModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("product_color_images ").where(props);
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

// src/service/productColorImages.service.ts
var ProductColorImagesService = class extends service_utils_default {
  static async update(productColorImages) {
    const data = zodParse_helper_default(productColorImageSchema.update.array().min(1))(productColorImages);
    const res = await this.writeOperationsHandler(
      data,
      (e) => productColorImages_model_default.update(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "la imagen del color", action: "actualizar" });
      }
    );
    res("product_color_images_update");
  }
  static async delete(productColorImages) {
    const data = zodParse_helper_default(productColorImageSchema.delete.array().min(1))(productColorImages);
    const res = await this.writeOperationsHandler(
      data,
      (e) => productColorImages_model_default.delete(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "la imagen del color", action: "eliminar" });
      }
    );
    res("product_color_images_delete");
  }
  static async insert(productColorImages) {
    const data = zodParse_helper_default(productColorImageSchema.insert.array().min(1))(productColorImages);
    const res = await this.writeOperationsHandler(data, (e) => productColorImages_model_default.insert(e));
    res("product_color_images_insert");
  }
};
var productColorImages_service_default = ProductColorImagesService;

// src/controller/productColorImages.controller.ts
var ProductColorImagesController = class {
  static async addProductColorImages(req, res, next) {
    try {
      await productColorImages_service_default.insert(req.body);
      res.json({
        message: "Imagenes agregadas correctamente."
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
      await productColorImages_service_default.update(req.body);
      res.json({
        message: "Imagenes modificadas correctamente."
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
      await productColorImages_service_default.delete(req.body);
      res.json({
        message: "Imagenes eliminadas correctamente"
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
var productColorImagesRouter = express5.Router();
productColorImagesRouter.post("/", productColorImages_controller_default.addProductColorImages);
productColorImagesRouter.delete("/", productColorImages_controller_default.removeProductColorImages);
productColorImagesRouter.patch("/", productColorImages_controller_default.modifyProductColorImages);
var ProductColorImages_router_default = productColorImagesRouter;

// src/router/productColors.router.ts
import express6 from "express";

// src/model/productColors.model.ts
var ProductColorsModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("product_colors as pc").where(props);
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
  static selectJoinColor(props, modify) {
    return this.select(props, (builder) => {
      modify && builder.modify(modify);
      builder.innerJoin("colors as c", "c.color_id", "pc.color_fk");
    });
  }
  static selectExistsSizes(props, modify) {
    return this.selectJoinColor(props, (builder) => {
      modify && builder.modify(modify);
      builder.whereExists(
        knex_config_default("product_color_sizes").whereRaw("product_color_fk = pc.product_color_id")
      );
    });
  }
};
var productColors_model_default = ProductColorsModel;

// src/service/productColors.service.ts
import { productColorSchema } from "clothing-store-shared/schema";
var ProductColorsService = class extends service_utils_default {
  static async update(productColors) {
    const data = zodParse_helper_default(productColorSchema.update.array().min(1))(productColors);
    const res = await this.writeOperationsHandler(
      data,
      (e) => productColors_model_default.update(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "el color", action: "actualizar" });
      }
    );
    res("product_colors_update");
  }
  static async delete(productColors) {
    const data = zodParse_helper_default(productColorSchema.delete.array().min(1))(productColors);
    const res = await this.writeOperationsHandler(
      data,
      (e) => productColors_model_default.delete(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "el color", action: "eliminar" });
      }
    );
    res("product_colors_delete");
  }
  static async insert(productColors) {
    const data = zodParse_helper_default(productColorSchema.insert.array().min(1))(productColors);
    const res = await this.writeOperationsHandler(data, (e) => productColors_model_default.insert(e));
    res("product_colors_insert");
  }
};
var productColors_service_default = ProductColorsService;

// src/controller/productColors.controller.ts
var ProductColorsController = class {
  static async setProductColors(req, res, next) {
    try {
      await productColors_service_default.insert(req.body);
      res.json({
        message: "Colores de los productos agregados correctamente."
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
      await productColors_service_default.update(req.body);
      res.json({
        message: "Colores de los productos modificados correctamente."
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
      await productColors_service_default.delete(req.body);
      res.json({
        message: "Colores de los productos eliminados correctamente."
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
var productColorsRouter = express6.Router();
productColorsRouter.post("/", productColors_controller_default.setProductColors);
productColorsRouter.delete("/", productColors_controller_default.removeProductColors);
productColorsRouter.patch("/", productColors_controller_default.modifyProductColors);
var productColors_router_default = productColorsRouter;

// src/router/ProductColorSizes.router.ts
import express7 from "express";

// src/service/productColorSizes.service.ts
import { productColorSizeSchema } from "clothing-store-shared/schema";

// src/model/productColorSizes.model.ts
var ProductColorSizesModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("product_color_sizes as pcs").where(props);
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
  }
  static selectJoinSize(props, modify) {
    return this.select(props, (builder) => {
      modify && builder.modify(modify);
      builder.leftJoin("sizes as s", "s.size_id", "pcs.size_fk");
    });
  }
  static async updatetByProductColor({ product_color_fk, ...props }) {
    try {
      return await knex_config_default("product_color_sizes").where({ product_color_fk }).update(props);
    } catch (error) {
      throw this.generateError(error);
    }
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
var productColorSizes_model_default = ProductColorSizesModel;

// src/service/productColorSizes.service.ts
var ProductColorSizesService = class extends service_utils_default {
  static async insert(sizes) {
    const data = zodParse_helper_default(productColorSizeSchema.insert.array().min(1))(sizes);
    const res = await this.writeOperationsHandler(data, (e) => productColorSizes_model_default.insert(e));
    res("product_color_sizes_insert");
  }
  static async update(sizes) {
    const data = zodParse_helper_default(productColorSizeSchema.update.array().min(1))(sizes);
    const res = await this.writeOperationsHandler(
      data,
      (e) => productColorSizes_model_default.update(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "el tama\xF1o", action: "actualizar" });
      }
    );
    res("product_color_sizes_update");
  }
  static async updateByProductColor(productColors) {
    const data = zodParse_helper_default(productColorSizeSchema.updateByProductColor.array().min(1))(productColors);
    const res = await this.writeOperationsHandler(
      data,
      (e) => productColorSizes_model_default.updatetByProductColor(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "el tama\xF1o", action: "actualizar" });
      }
    );
    res("product_color_sizes_update_by");
  }
  static async delete(sizes) {
    const data = zodParse_helper_default(productColorSizeSchema.delete.array().min(1))(sizes);
    const res = await this.writeOperationsHandler(
      data,
      (e) => productColorSizes_model_default.delete(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "el tama\xF1o", action: "eliminar" });
      }
    );
    res("product_color_sizes_delete");
  }
};
var productColorSizes_service_default = ProductColorSizesService;

// src/controller/productColorSizes.controller.ts
var ProductColorSizesController = class {
  static async setProductColorSizes(req, res, next) {
    try {
      await productColorSizes_service_default.insert(req.body);
      res.json({
        message: "Tama\xF1os de los colores agregados exitosamente."
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async updateByProductColor(req, res, next) {
    try {
      await productColorSizes_service_default.updateByProductColor(req.body);
      res.json({
        message: "Tama\xF1os de los colores modificado  exitosamente."
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
      await productColorSizes_service_default.update(req.body);
      res.json({
        message: "Tama\xF1os de los colores modificado  exitosamente."
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
      await productColorSizes_service_default.delete(req.body);
      res.json({
        message: "Tama\xF1os de los colores eliminados exitosamente."
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
var productColorSizesRouter = express7.Router();
productColorSizesRouter.post("/", productColorSizes_controller_default.setProductColorSizes);
productColorSizesRouter.delete("/", productColorSizes_controller_default.removeProductColorSizes);
productColorSizesRouter.patch("/", productColorSizes_controller_default.modifyProductColorSizes);
productColorSizesRouter.patch("/updateByProductColor", productColorSizes_controller_default.updateByProductColor);
var ProductColorSizes_router_default = productColorSizesRouter;

// src/router/products.router.ts
import express8 from "express";

// src/model/products.model.ts
var ProductsModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("products as p").where(props);
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
  static async updateByCategory({ category_fk, ...props }) {
    try {
      return await knex_config_default("products").where({ category_fk }).update(props);
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

// src/service/products.service.ts
import { productSchema } from "clothing-store-shared/schema";
var ProductsService = class extends service_utils_default {
  static async getByCategory(category_fk) {
    const products = await products_model_default.select({ category_fk });
    if (products.length === 0) throw new errorHandler_utilts_default({
      message: "No se encontraron productos",
      status: 404,
      code: "products_not_found"
    });
    return products;
  }
  static async updateByCategory(products) {
    const data = zodParse_helper_default(productSchema.updateByCategory.array().min(1))(products);
    const res = await this.writeOperationsHandler(
      data,
      (e) => products_model_default.updateByCategory(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "el producto", action: "actualizar" });
      }
    );
    res("products_update_by");
  }
  static async update(products) {
    const data = zodParse_helper_default(productSchema.update.array().min(1))(products);
    const res = await this.writeOperationsHandler(data, (e) => products_model_default.update(e), (e) => {
      if (!e) throw this.genericMessage({ text: "el producto", action: "actualizar" });
    });
    res("products_update");
  }
  static async insert(products) {
    const data = zodParse_helper_default(productSchema.insert.array().min(1))(products);
    const res = await this.writeOperationsHandler(data, (e) => products_model_default.insert(e));
    res("products_insert");
  }
  static async delete(products) {
    const data = zodParse_helper_default(productSchema.delete.array().min(1))(products);
    const res = await this.writeOperationsHandler(
      data,
      (e) => products_model_default.delete(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "el producto", action: "eliminar" });
      }
    );
    res("products_delete");
  }
};
var products_service_default = ProductsService;

// src/controller/products.controller.ts
var ProductsController = class {
  static async getByCategory(req, res, next) {
    try {
      const { category_id = "" } = req.params;
      const data = await products_service_default.getByCategory(category_id);
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
  static async updateByCategory(req, res, next) {
    try {
      await products_service_default.updateByCategory(req.body);
      res.json({
        message: "Productos modificados correctamente."
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
      await products_service_default.insert(req.body);
      res.json({
        message: "Productos agregados correctamente."
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
      await products_service_default.update(req.body);
      res.json({
        message: "Productos modificados correctamente."
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
      await products_service_default.delete(req.body);
      res.json({
        message: "Productos eliminados correctamente."
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
var productsRouter = express8.Router();
productsRouter.get("/category/:category_id", products_controller_default.getByCategory);
productsRouter.post("/", isAdmin_middleware_default, products_controller_default.addProducts);
productsRouter.patch("/", isAdmin_middleware_default, products_controller_default.modifyProducts);
productsRouter.delete("/", isAdmin_middleware_default, products_controller_default.removeProducts);
productsRouter.patch("/updateByCategory", isAdmin_middleware_default, products_controller_default.updateByCategory);
var products_router_default = productsRouter;

// src/router/productsRecomendations.router.ts
import express9 from "express";

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
    if (res.length === 0) throw new errorHandler_utilts_default({
      message: "No se encontraron categorias para recomendar.",
      status: 404,
      code: "products_recomendations_not_found"
    });
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
var productRecomendationsRouter = express9.Router();
productRecomendationsRouter.get("/random", productsRecomendations_controller_default.getRandomProductRecomendation);
var productsRecomendations_router_default = productRecomendationsRouter;

// src/router/productsView.router.ts
import express10 from "express";

// src/service/productFullview.service.ts
var ProductFullViewService = class {
  static async getProduct(product_id) {
    const [product] = await products_model_default.selectExistsColors({ product_id, status: true });
    if (!product) throw new errorHandler_utilts_default({
      message: "Product no encontrado.",
      code: "product_not_found"
    });
    return product;
  }
  static async getProductColors(product_fk) {
    const productColorModel = await productColors_model_default.selectExistsSizes({ product_fk });
    if (productColorModel.length === 0) throw new errorHandler_utilts_default({
      message: "No se encontro ningun color asociado al producto",
      code: "product_colors_not_found"
    });
    return productColorModel;
  }
  static async getProductColorSize(product_color_fk) {
    const color_sizes = await productColorSizes_model_default.selectJoinSize({ product_color_fk });
    return [color_sizes];
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
    }).where("p.status", true);
    brand_id && query.where("pb.brand_id", brand_id);
    category_id && query.where("pt.category_id", category_id);
    search && query.whereILike("p.product", `%${search}%`);
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
        status: 404,
        code: "product_not_found"
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
var productsViewRouter = express10.Router();
productsViewRouter.get("/preview", productsView_controller_default.getProductsPreview);
productsViewRouter.get("/preview/:brand_id", productsView_controller_default.getProductsPreview);
productsViewRouter.get("/preview/:brand_id/:category_id", productsView_controller_default.getProductsPreview);
productsViewRouter.get("/fullview/:product_id", productsView_controller_default.getProductFullView);
var productsView_router_default = productsViewRouter;

// src/router/sizes.router.ts
import express11 from "express";

// src/model/sizes.model.ts
var SizesModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("sizes").where(props);
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

// src/service/sizes.service.ts
import { sizeSchema } from "clothing-store-shared/schema";
var SizeService = class extends service_utils_default {
  static async get() {
    const sizes = await sizes_model_default.select();
    if (sizes.length === 0) {
      throw new errorHandler_utilts_default({
        message: "No se encontraron tama\xF1os",
        status: 404,
        code: "size_not_found"
      });
    }
    return sizes;
  }
  static async update(sizes) {
    const data = zodParse_helper_default(sizeSchema.update.array())(sizes);
    const res = await this.writeOperationsHandler(
      data,
      (e) => sizes_model_default.update(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "el tama\xF1o", action: "actualizar" });
      }
    );
    res("sizes_update");
  }
  static async insert(sizes) {
    const data = zodParse_helper_default(sizeSchema.insert.array())(sizes);
    const res = await this.writeOperationsHandler(data, (e) => sizes_model_default.insert(e));
    res("sizes_insert");
  }
  static async delete(sizes) {
    const data = zodParse_helper_default(sizeSchema.delete.array())(sizes);
    const res = await this.writeOperationsHandler(
      data,
      (e) => sizes_model_default.delete(e),
      (e) => {
        if (!e) throw this.genericMessage({ text: "el tama\xF1o", action: "eliminar" });
      }
    );
    res("sizes_delete");
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
      await sizes_service_default.insert(req.body);
      res.json({
        message: "Tama\xF1os agregados correctamente."
      });
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
      await sizes_service_default.update(req.body);
      res.json({
        message: "Tama\xF1os modificados correctamente."
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
      await sizes_service_default.delete(req.body.sizes);
      res.json({
        message: "Tama\xF1os eliminados correctamente."
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
var sizes_controller_default = SizeController;

// src/router/sizes.router.ts
var sizesRouter = express11.Router();
sizesRouter.get("/", sizes_controller_default.getSizes);
sizesRouter.post("/", isAdmin_middleware_default, sizes_controller_default.addSizes);
sizesRouter.patch("/", isAdmin_middleware_default, sizes_controller_default.modifySizes);
sizesRouter.delete("/", isAdmin_middleware_default, sizes_controller_default.removeSizes);
var sizes_router_default = sizesRouter;

// src/router/userAccount.router.ts
import express12 from "express";

// src/controller/userAccount.controller.ts
import { userSchema as userSchema4 } from "clothing-store-shared/schema";

// src/constant/tokenSettings.constant.ts
var tokenSettings = {
  email_confirm: { maxTokens: 20, timeUnit: "day", timeValue: 1 },
  //1 DIA
  // email_update: { maxTokens: 10, timeUnit: "hour", timeValue: 3 }, // 1 HORAS
  password_reset_by_email: { maxTokens: 20, timeUnit: "hour", timeValue: 3 }
  // 3 HORAS
};
var tokenSettings_constant_default = tokenSettings;

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

// src/service/email/sendPasswordReset.email.ts
var sendPasswordReset = async ({ to, token }) => {
  const url = `${env_constant_default.FROTEND_DOMAIN}/token?token=${token}&token_request=password_reset_by_email&email=${to}`;
  return await nodemailer_config_default.sendMail({
    from: "Olga Hat's <olgahats@noreply.com>",
    to,
    subject: "Cambio de contrase\xF1a",
    html: `
        <p>Recibimos una solicitud para cambiar tu contrase\xF1a. Si fuiste t\xFA, por favor haz clic en el siguiente enlace para proceder con el cambio:</p>
        <a href="${url}">Cambiar mi contrase\xF1a</a>
        <p><strong>Este enlace expira en 3 horas.</strong></p>
        `
  });
};
var sendPasswordReset_email_default = sendPasswordReset;

// src/service/email/sendEmailConfirm.email.ts
var sendEmailConfirm = async ({ to, token }) => {
  const url = `${env_constant_default.FROTEND_DOMAIN}/token?token=${token}&token_request=email_confirm`;
  return await nodemailer_config_default.sendMail({
    from: "Olga Hat's <olgahats@noreply.com>",
    to,
    subject: "Verificaci\xF3n de correo electr\xF3nico",
    html: `
            <p>Por favor, haz clic en el siguiente enlace para confirmar el correo electronico.</p>
            <a href="${url}">Confirmar correo electronico.</a>
            <p><strong>Este enlace expira en 24 horas.</strong></p>
        `
  });
};
var sendEmailConfirm_email_default = sendEmailConfirm;

// src/service/email/index.ts
var emailService = {
  sendEmailConfirm: sendEmailConfirm_email_default,
  sendPasswordReset: sendPasswordReset_email_default
};
var email_default = emailService;

// src/service/userAccount.service.ts
import { userSchema as userSchema2 } from "clothing-store-shared/schema";

// src/service/userRegister.service.ts
import bcrypt from "bcrypt";
import { userSchema } from "clothing-store-shared/schema";
var UserRegisterService = class {
  static async completeRegister(user_id) {
    const data = zodParse_helper_default(userSchema.update)({ user_id, email_confirmed: true });
    const updateAffects = await users_model_default.updateUnconfirmedEmail(data);
    if (!updateAffects) {
      throw new errorHandler_utilts_default({
        message: "El email ya se encuentra confirmado.",
        status: 409,
        code: "email_already_confirmed"
      });
    }
  }
  static async createPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  static async registerAccount(user) {
    const data = zodParse_helper_default(userSchema.insert)(user);
    const hash = await this.createPassword(data.password);
    const [rawHeaders] = await users_model_default.insertByLimitIP({
      ...data,
      password: hash
    }, storeConfig.maxAccountPerIp);
    const { insertId, affectedRows } = rawHeaders;
    if (affectedRows == 0) throw new errorHandler_utilts_default({
      message: `Superaste el limite de ${storeConfig.maxAccountPerIp} cuentas por IP.`,
      code: "limit_account_per_ip",
      status: 429
    });
    return userSchema.formatUser.parse({
      ...data,
      user_id: insertId
    });
  }
};
var userRegister_service_default = UserRegisterService;

// src/service/userAccount.service.ts
var UserAccountService = class {
  static async updateInfo(update) {
    const { password, phone, fullname, user_id } = zodParse_helper_default(userSchema2.updateInfo)(update);
    const selectedInfo = {
      password: password && await userRegister_service_default.createPassword(password),
      phone,
      fullname,
      user_id
    };
    return await users_model_default.update(selectedInfo);
  }
  static async getUserInfo(user_id) {
    const [res] = await users_model_default.select({ user_id });
    if (!res) throw new errorHandler_utilts_default({
      status: 404,
      message: "No se encontro ningun usuario.",
      code: "user_not_found"
    });
    return zodParse_helper_default(userSchema2.formatUser)(res);
  }
};
var userAccount_service_default = UserAccountService;

// src/service/userAuth.service.ts
import bcrypt2 from "bcrypt";
import { userSchema as userSchema3 } from "clothing-store-shared/schema";
var UserAuthService = class {
  static async findUserByEmail(email = "") {
    const [user] = await users_model_default.select({ email });
    if (!user) throw new errorHandler_utilts_default({
      message: "El correo electr\xF3nico ingresado no est\xE1 registrado en nuestro sistema.",
      code: "email_not_found",
      status: 422
    });
    return user;
  }
  static async verifyPassword(password, hash) {
    const compare = await bcrypt2.compare(password, hash);
    if (!compare) throw new errorHandler_utilts_default({
      message: "La contrase\xF1a ingresada es incorrecta.",
      code: "wrong_password",
      status: 422
    });
  }
  static async authenticar({ email, password }) {
    const user = await this.findUserByEmail(email);
    await this.verifyPassword(password, user.password);
    return zodParse_helper_default(userSchema3.formatUser)(user);
  }
};
var userAuth_service_default = UserAuthService;

// src/service/userToken.service.ts
import crypto2 from "crypto";

// src/model/userTokens.model.ts
var UserTokensModel = class extends model_utils_default {
  static async select(props = {}, modify) {
    try {
      const query = knex_config_default("user_tokens as ut").where(props);
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
  static async update({ token, ...userToken }, modify) {
    try {
      const query = knex_config_default("user_tokens").update(userToken).where("token", token);
      modify && query.modify(modify);
      return await query;
    } catch (error) {
      throw this.generateError(error);
    }
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

// src/service/userToken.service.ts
import { userTokenSchema } from "clothing-store-shared/schema";
var UserTokenService = class {
  static createTokenDate({ timeUnit, timeValue }) {
    const date = /* @__PURE__ */ new Date();
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
    const data = zodParse_helper_default(userTokenSchema.insert)({
      ...props,
      token,
      expired_at: this.createTokenDate(tokenDate)
    });
    const [ResultSetHeader] = await userTokens_model_default.insertWithTokenLimit(data, maxTokens);
    if (ResultSetHeader.affectedRows == 0) {
      throw new errorHandler_utilts_default({
        status: 429,
        message: `Se ha excedido el l\xEDmite de ${maxTokens} solicitudes de generaci\xF3n de tokens para este usuario.`,
        code: "limit_tokens_by_ip"
      });
    }
    return data.token;
  }
  static async findActiveToken({ token, request }) {
    const requestValidated = zodParse_helper_default(userTokenSchema.requestTokenSchema)(request);
    const [user] = await userTokens_model_default.selectActiveToken({ token, request: requestValidated }, (builder) => builder.select("user_fk"));
    if (!user) {
      throw new errorHandler_utilts_default({
        status: 404,
        message: `El token que est\xE1s intentando utilizar ha expirado o no existe.`,
        code: "token_not_found"
      });
    }
    return user;
  }
  static async markTokenAsUsed(token) {
    return await userTokens_model_default.update({ used: true, token });
  }
  static async useToken(data) {
    const userToken = await this.findActiveToken(data);
    await this.markTokenAsUsed(data.token);
    return userToken.user_fk;
  }
  static async cleanExpiredTokens({ cleaning_hour, cleaning_minute }) {
    if (cleaning_hour > 23 || cleaning_hour < 0 || cleaning_minute > 60 || cleaning_minute < 0) {
      console.log("The expired token cleanup process failed to initialize due to incorrect time range data.");
      return;
    }
    const current_date = /* @__PURE__ */ new Date();
    const expected_date = /* @__PURE__ */ new Date();
    expected_date.setUTCHours(cleaning_hour);
    expected_date.setUTCMinutes(cleaning_minute);
    if (current_date.getTime() >= expected_date.getTime()) {
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

// src/controller/userAccount.controller.ts
var UserAccountController = class {
  static async updateInfoAuth(req, res, next) {
    try {
      const password = req.body.password || "";
      const { email } = getSessionData_helper_default("user_info", req.session);
      await userAuth_service_default.authenticar({ email, password });
      const edit_authorization = {
        expired_at: Date.now() + 60 * 60 * 1e3,
        //1 Hora,
        isAuthorized: true
      };
      req.session.edit_authorization = edit_authorization;
      res.json({
        message: "Contrase\xF1a verificada con \xE9xito. Tienes una hora para actualizar tu informaci\xF3n antes de que caduque la autorizaci\xF3n.",
        data: edit_authorization
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async sendPasswordReset(req, res, next) {
    try {
      const { user_id, email } = await userAuth_service_default.findUserByEmail(req.body.email);
      const token = await userToken_service_default.createToken(
        {
          ip: req.ip ?? "",
          request: "password_reset_by_email",
          user_fk: user_id
        },
        tokenSettings_constant_default.password_reset_by_email
      );
      await email_default.sendPasswordReset({
        to: email,
        token
      });
      res.json({
        message: "Solicitud para reestablecer la contrase\xF1a enviada, revisa tu bandeja de entrada."
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async passwordReset(req, res, next) {
    try {
      const token = req.params.token;
      const { user_fk } = await userToken_service_default.findActiveToken({ request: "password_reset_by_email", token });
      await userAccount_service_default.updateInfo({
        user_id: user_fk,
        password: req.body.password
      });
      await userToken_service_default.markTokenAsUsed(token);
      res.json({
        message: "Contrase\xF1a restablecida correctamente."
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async updateInfo(req, res, next) {
    try {
      const user = getSessionData_helper_default("user_info", req.session);
      await userAccount_service_default.updateInfo({
        ...req.body,
        user_id: user.user_id
      });
      const userParse = zodParse_helper_default(userSchema4.formatUser)({ ...user, ...req.body, create_at: new Date(user.create_at || "") });
      req.session.user_info = userParse;
      res.json({
        message: "Informaci\xF3n actualizada correctamente.",
        data: userParse
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async getLoginUserInfo(req, res, next) {
    try {
      const { user_id } = getSessionData_helper_default("user_info", req.session);
      const edit_authorization = req.session.edit_authorization;
      const user_info = await userAccount_service_default.getUserInfo(user_id);
      res.json({
        data: {
          edit_authorization,
          user_info
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
var userAccount_controller_default = UserAccountController;

// src/rate-limiter/token.rate-limiter.ts
import { rateLimit as rateLimit2 } from "express-rate-limit";
var tokenRateLimiter = rateLimit2({
  windowMs: 1 * 60 * 1e3,
  limit: 20,
  handler: rateLimitHandler_utilts_default
});
var token_rate_limiter_default = tokenRateLimiter;

// src/middleware/isAuthorizedToUpdateInfo.middleware.ts
var isAuthorizedToUpdateInfo = (req, res, next) => {
  const edit_authorization = req.session.edit_authorization;
  if (!edit_authorization || Date.now() > edit_authorization.expired_at || !edit_authorization.isAuthorized) new errorHandler_utilts_default({
    code: "not_edit_authorized",
    message: "No estas autorizado para editar la informacion de la cuenta.",
    status: 401
  }).response(res);
  else {
    next();
  }
};
var isAuthorizedToUpdateInfo_middleware_default = isAuthorizedToUpdateInfo;

// src/router/userAccount.router.ts
var userAccountRouter = express12.Router();
userAccountRouter.post("/reset/password", token_rate_limiter_default, userAccount_controller_default.sendPasswordReset);
userAccountRouter.post("/reset/password/:token", userAccount_controller_default.passwordReset);
userAccountRouter.post("/update/info/auth", isCompleteUser_middleware_default, userAccount_controller_default.updateInfoAuth);
userAccountRouter.post("/update/info", [isCompleteUser_middleware_default, isAuthorizedToUpdateInfo_middleware_default], userAccount_controller_default.updateInfo);
userAccountRouter.get("/", isUser_middleware_default, userAccount_controller_default.getLoginUserInfo);
var userAccount_router_default = userAccountRouter;

// src/router/userRegister.router.ts
import express13 from "express";

// src/controller/userRegister.controller.ts
var handlerRegisterToken = async ({ ip, email, user_fk }) => {
  const token = await userToken_service_default.createToken({
    ip,
    request: "email_confirm",
    user_fk
  }, tokenSettings_constant_default.email_confirm);
  await email_default.sendEmailConfirm({ to: email, token });
};
var UserRegisterController = class {
  static async register(req, res, next) {
    try {
      const account = await userRegister_service_default.registerAccount({
        ...req.body,
        ip: req.ip
      });
      req.session.user_info = account;
      await handlerRegisterToken({
        email: account.email,
        user_fk: account.user_id,
        ip: req.ip
      });
      res.json({
        message: "Cuenta creada con \xE9xito. Te hemos enviado un correo para confirmar tu correo electronico.",
        data: account
      });
    } catch (error) {
      if (errorHandler_utilts_default.isInstanceOf(error)) {
        error.response(res);
      } else {
        next();
      }
    }
  }
  static async sendRegisterToken(req, res, next) {
    try {
      const { user_id, email } = getSessionData_helper_default("user_info", req.session);
      await handlerRegisterToken({
        ip: req.ip,
        email,
        user_fk: user_id
      });
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
  static async confirmRegistration(req, res, next) {
    try {
      const { token } = req.params;
      const userID = await userToken_service_default.useToken({ request: "email_confirm", token });
      await userRegister_service_default.completeRegister(userID);
      if (req.session.user_info) {
        req.session.user_info.email_confirmed = true;
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
};
var userRegister_controller_default = UserRegisterController;

// src/middleware/isNotCompleteUser.middleware.ts
var response = (res) => {
  new errorHandler_utilts_default({
    message: "El email ya est\xE1 confirmado, no puedes continuar con esta operacion.",
    code: "email_already_confirmed",
    status: 401
  }).response(res);
};
var isNotCompleteUser = async (req, res, next) => {
  const user = req.session.user_info;
  if (!user) return isUser_middleware_default(req, res, next);
  if (user.email_confirmed) return response(res);
  const [u] = await users_model_default.select({ user_id: user.user_id }, (builder) => builder.select("email_confirmed"));
  const { email_confirmed } = u;
  if (!email_confirmed) {
    next();
  } else {
    user.email_confirmed = true;
    response(res);
  }
};
var isNotCompleteUser_middleware_default = isNotCompleteUser;

// src/router/userRegister.router.ts
var userRegisterRouter = express13.Router();
userRegisterRouter.post("/", userRegister_controller_default.register);
userRegisterRouter.get("/confirmation/:token", userRegister_controller_default.confirmRegistration);
userRegisterRouter.get("/send/token", token_rate_limiter_default, isNotCompleteUser_middleware_default, userRegister_controller_default.sendRegisterToken);
var userRegister_router_default = userRegisterRouter;

// src/router/users.router.ts
import express14 from "express";

// src/controller/users.controller.ts
var UsersController = class {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userAuth_service_default.authenticar({ email, password });
      req.session.user_info = user;
      res.json({
        data: user,
        message: "\xA1Inicio de sesi\xF3n exitoso! Bienvenido de nuevo."
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
          message: "\xA1Cierre de sesi\xF3n exitoso! Hasta pronto."
        });
      }
    });
  }
};
var users_controller_default = UsersController;

// src/router/users.router.ts
var usersRouter = express14.Router();
usersRouter.post("/login", users_controller_default.login);
usersRouter.get("/logout", users_controller_default.logout);
var users_router_default = usersRouter;

// src/index.ts
var port = env_constant_default.BACKEND_PORT;
var app = express15();
app.use(express15.json());
app.use(session_config_default);
app.use(cors_config_default);
app.use(default_rate_limiter_default);
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
app.use("/users/account", userAccount_router_default);
app.use("/mercadopago", isCompleteUser_middleware_default, mercadoPago_router_default);
app.use("/orders", isCompleteUser_middleware_default, order_router_default);
app.use(errorGlobal_middleware_default);
userToken_service_default.cleanExpiredTokens({ cleaning_hour: 15, cleaning_minute: 0 });
app.listen(port, () => console.log("SERVER START"));
