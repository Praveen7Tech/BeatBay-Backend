import { createContainer, InjectionMode } from 'awilix';
import { authModule } from './modules/auth.module';
import { adminModule } from './modules/admin.module';
import { artistModule } from './modules/artist.module';

const container = createContainer({ injectionMode: InjectionMode.CLASSIC });

container.register(authModule);
container.register(adminModule)
container.register(artistModule)

export default container;
