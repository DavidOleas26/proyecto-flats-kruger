import { validateUserQuerySchema } from "../schemas/user.schema.js"

export class UserMiddleware {
  
  static validateQueryMiddleware = (req, res, next) => {
    const { error, value } = validateUserQuerySchema.validate(req.query, {convert: true});
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (value.minAge && value.maxAge && value.minAge > value.maxAge) {
      return res.status(400).json({ error: "minAge cannot be greater than maxAge" });
    }

    if (value.minFlats && value.maxFlats && value.minFlats > value.maxFlats) {
      return res.status(400).json({ error: "minFlats cannot be greater than maxFlats" });
    }

    next();
  }

  static buildQueryMiddleware = (req, res, next) => {
    try {
      const {
        role,
        minAge,
        maxAge,
        minFlats,
        maxFlats,
        sortBy = "createdAt",
        order = "asc",
        page = 1,
        limit = 10
      } = req.query
  
      const query = { deletedAt: null }
  
      if ( role ) {
        query.role = role
      }
  
      if ( minAge || maxAge ) {
        const today = new Date()
        query.birthdate = {}
  
        if ( minAge ) {
          const minBirthdate = new Date(today);
          minBirthdate.setFullYear(today.getFullYear() - minAge)
          query.birthdate.$lte = minBirthdate
        }
        if ( maxAge ) {
          const maxBirthdate = new Date(today);
          maxBirthdate.setFullYear(today.getFullYear() - maxAge)
          query.birthdate.$gte = maxBirthdate
        }
      }
      
      if ( minFlats || maxFlats ) {
        query.flatsCounter = {};
        if (minFlats) query.flatsCounter.$gte = Number(minFlats)
        if (maxFlats) query.flatsCounter.$lte = Number(maxFlats)
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

