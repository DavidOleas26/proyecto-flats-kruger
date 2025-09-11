import express from 'express'
import { FavoritesFlatsController } from '../controllers/favoriteFlats.controller.js';
// middlewares
import authenticationMiddleware from '../middlewares/authentication.middleware.js'

const favoriteFlatsRouter = express.Router()
favoriteFlatsRouter.use(authenticationMiddleware);

// endpoints Favorite flats (get all favorite, addFavorite, deleteFavorite)
favoriteFlatsRouter.get('/', FavoritesFlatsController.getAllFavoriteFlats)
favoriteFlatsRouter.post('/:flatId', FavoritesFlatsController.addFavoriteFlat)
favoriteFlatsRouter.delete('/:flatId', FavoritesFlatsController.removeFavoriteFlat)

export default favoriteFlatsRouter