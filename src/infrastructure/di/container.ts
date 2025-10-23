import { createContainer, InjectionMode } from 'awilix';
import { authModule } from './modules/auth.module';
import { adminModule } from './modules/admin.module';

const container = createContainer({ injectionMode: InjectionMode.CLASSIC });

container.register(authModule);
container.register(adminModule)

export default container;
