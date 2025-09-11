import { validateFlatQuerySchema } from "../schemas/flat.schema.js";

export class FlatsMiddleware {

    static validateQueryMiddleware = (req, res, next) => {
    const { error, value } = validateFlatQuerySchema.validate(req.query, {convert: true});
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (value.minPrice && value.maxPrice && value.minPrice > value.maxPrice) {
      return res.status(400).json({ error: "minPrice cannot be greater than maxPrice" });
    }
    if (value.minArea && value.maxArea && value.minArea > value.maxArea) {
      return res.status(400).json({ error: "minArea cannot be greater than maxArea" });
    }
    next();
  }

  static buildQueryMiddleware = (req, res, next) => {
    try {
      const {
        city,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
        sortBy = "createdAt",
        order = "desc",
        page = 1,
        limit = 10
      } = req.query;

      const query = { deletedAt: null }

      if (city) {
        query.city = { $regex: city, $options: "i" }; // búsqueda parcial y sin importar mayúsculas
      }

      if (minPrice || maxPrice) {
        query.rentPrice = {};
        if (minPrice) query.rentPrice.$gte = Number(minPrice);
        if (maxPrice) query.rentPrice.$lte = Number(maxPrice);
      }

      if (minArea || maxArea) {
        query.areaSize = {};
        if (minArea) query.areaSize.$gte = Number(minArea);
        if (maxArea) query.areaSize.$lte = Number(maxArea);
      }

      const pageNumber = Number(page)
      const pageLimit = Number(limit)
      const skip = (pageNumber - 1) * pageLimit
      const sortField = sortBy || "createdAt"
      const sortOrder = order === "asc" ? 1 : -1

      req.queryParams = {
        query,
        pagination: {
          skip,
          limit: pageLimit,
          page: pageNumber
        },
        sort: {
          [sortField]: sortOrder
        }
      }
      next()

    } catch (error) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }
  }
}
