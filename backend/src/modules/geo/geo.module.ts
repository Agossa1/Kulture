import {GetCountriesController} from "./controllers/getCountries.controller";
import {GetCountryService} from "./services/getCountries.service";
import {GeoRepositories} from "./repositories/geo.repositorie";
import PostgresDatabase from "../../infra/database/postgres";
import {redisService} from "../../config/redis/redis.service";
import type {Logger} from "winston";
import {GetCitiesService} from "./services/getCities.service";
import {GetCitiesController} from "./controllers/getCities.controller";
import {GetRegionsService} from "./services/getRegions.service";
import {GetRegionsController} from "./controllers/getRegions.controller";
import {GetDistrictsService} from "./services/getDistricts.service";
import {GetDistrictsController} from "./controllers/getDistricts.controller";


export class GeoModule {
    public readonly getCountriesController: GetCountriesController;
    public readonly geoCountryService: GetCountryService;
    public readonly getCitiesService: GetCitiesService;
    public readonly getCitiesController: GetCitiesController;

    private readonly getRegionsService: GetRegionsService;
    private readonly getRegionController: GetRegionsController;

    private readonly getDistrictsServices: GetDistrictsService;
    private readonly getDistrictsController: GetDistrictsController


    constructor(db: PostgresDatabase, logger: Logger, redis: typeof redisService) {
        // 1. Repository
        const geoRepository = new GeoRepositories(db, logger);

        // 2. Services
        this.geoCountryService = new GetCountryService(geoRepository, logger, redis);
        this.getRegionsService = new GetRegionsService(geoRepository, logger, redis);
        this.getCitiesService = new GetCitiesService(geoRepository, logger, redis);
        this.getDistrictsServices = new GetDistrictsService(geoRepository, logger, redis);


        // 3. Contrôleurs
        this.getCountriesController = new GetCountriesController(this.geoCountryService);
        this.getRegionController = new GetRegionsController(this.getRegionsService);
        this.getCitiesController = new GetCitiesController(this.getCitiesService);
        this.getDistrictsController = new GetDistrictsController(this.getDistrictsServices);


    }
}