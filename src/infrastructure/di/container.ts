import { createContainer, InjectionMode } from 'awilix';
import { authModule } from './modules/auth.module';
import { adminModule } from './modules/admin.module';
import { artistModule } from './modules/artist.module';
import { userModule } from './modules/user.module';

const container = createContainer({ injectionMode: InjectionMode.CLASSIC });

container.register(authModule);
container.register(adminModule)
container.register(artistModule)
container.register(userModule)

export default container;
