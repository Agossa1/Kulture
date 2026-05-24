import express, {Router} from 'express'
import PostgresDatabase from "../../../infra/database/postgres";
import {GeoModule} from "../geo.module";
import {logger} from "../../../shared/loggers/logger";
import {authMiddleware} from "../../../shared/middlewares/auth.middleware";
import {GetCountriesController} from '../controllers/getCountries.controller'
import redisService from "../../../config/redis/redis.service";


export const configureGeoRoute =  (db:PostgresDatabase)=> {
    const router = Router()
    const geoModule = new GeoModule(db, logger, redisService as any); // Correction de l'instanciation de GeoModule

    // Instanciation du contrôleur des pays
    const getCountriesController = new GetCountriesController((geoModule as any).geoService);

    router.use(authMiddleware)

    router.get('/get-all-countries', getCountriesController.getAllCountriesController.bind(getCountriesController));
    router.get('/get-all-regions', getCountriesController.getAllCountriesController.bind(getCountriesController));
    router.get('/get-all-cities', getCountriesController.getAllCountriesController.bind(getCountriesController));
    router.get('/get-all-districts', getCountriesController.getAllCountriesController.bind(getCountriesController));


    return router;
}