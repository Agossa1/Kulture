import type { Logger } from 'winston';
import PostgresDatabase from '../../infra/database/postgres';
import { AddressRepository } from './repositories/address.repository';
import { CreateAddressService } from './services/create.address.service';
import { GetAddressService } from './services/get.address.service';
import { ListAddressesService } from './services/list.addresses.service';
import { UpdateAddressService } from './services/update.address.service';
import { DeleteAddressService } from './services/delete.address.service';
import { CreateAddressController } from './controllers/create.address.controller';
import { GetAddressController } from './controllers/get.address.controller';
import { ListAddressesController } from './controllers/list.addresses.controller';
import { UpdateAddressController } from './controllers/update.address.controller';
import { DeleteAddressController } from './controllers/delete.address.controller';

export class AddressesModule {
    public createController: CreateAddressController;
    public getController: GetAddressController;
    public listController: ListAddressesController;
    public updateController: UpdateAddressController;
    public deleteController: DeleteAddressController;

    constructor(db: PostgresDatabase, logger: Logger) {
        const repository = new AddressRepository(db, logger);
        
        const createService = new CreateAddressService(repository);
        const getService = new GetAddressService(repository);
        const listService = new ListAddressesService(repository);
        const updateService = new UpdateAddressService(repository);
        const deleteService = new DeleteAddressService(repository);

        this.createController = new CreateAddressController(createService);
        this.getController = new GetAddressController(getService);
        this.listController = new ListAddressesController(listService);
        this.updateController = new UpdateAddressController(updateService);
        this.deleteController = new DeleteAddressController(deleteService);
    }
}
