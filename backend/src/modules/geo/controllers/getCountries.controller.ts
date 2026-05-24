import {GetCountryService} from "../services/getCountries.service";
import {Request, NextFunction, Response} from "express";
import {queryCountriesSchema} from "../validations/getCountries.validation";


export class GetCountriesController {
    constructor(
        private readonly countriesServices: GetCountryService
    ) {}

    public async getAllCountriesController(req:Request, res:Response, next:NextFunction) {
        try {
            const filter = queryCountriesSchema.parse(req.query);
            const countries = await this.countriesServices.getAllCountries(filter.tolerance);

            return res.status(200).json({
                success: true,
                data: countries,
                meta:{
                    total: countries.length
                }
            });
        }catch (e){
            next(e)
        }
    }
}