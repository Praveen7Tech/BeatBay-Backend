import dotenv from 'dotenv';
import http from "http"
import connectDB from './infrastructure/config/db';
import { connectRedis } from './infrastructure/config/redis';
import app from './interfaces/express/app';
import container from './infrastructure/di/container';
import userAuthRouterFactory from './interfaces/http/routes/auth/user.auth.routes';
import { loggerMiddleware } from './interfaces/middleware/logger/loggerMiddleware'; 
import { errorHandlerMiddleware } from './interfaces/middleware/error/errorHandler';
import adminAuthRouterFactory from './interfaces/http/routes/auth/admin.auth.routes'
import artistAuthRouterFactory from './interfaces/http/routes/auth/artist.auth.routes'
import userRouterFactory from './interfaces/http/routes/user/user.routes'
import logger from './infrastructure/utils/logger/logger';
import adminFeaturesRouterFactory from './interfaces/http/routes/admin/admin.features.routes'
import artistRouterFactory from './interfaces/http/routes/artist/artist.routes'
import { createSocketServer } from './infrastructure/config/socket';
import { PayoutCronJob } from './infrastructure/cron/payout.cron';
import { registerSocketHandlers } from './interfaces/socket/config/registerSocketHandler';
import { asValue } from 'awilix';

dotenv.config();

const PORT = process.env.PORT;

async function startServer() {
  try {
    await connectDB();
    await connectRedis();

    const httpServer = http.createServer(app)
    const io = createSocketServer(httpServer)

    container.register({
      io: asValue(io) 
    });


    registerSocketHandlers(io)
    
    app.use(loggerMiddleware);

    // Attach the auth router configured with DI after all the infrastructure connection is done
    const userAuthRouter = userAuthRouterFactory(container);
    const adminAuthRouter = adminAuthRouterFactory(container)
    const artistAuthRouter = artistAuthRouterFactory(container)

    const userRouter = userRouterFactory(container)
    const adminFeaturesRouter = adminFeaturesRouterFactory(container)
    const artistRouter = artistRouterFactory(container)
    
    app.use('/user', userAuthRouter);
    app.use('/admin', adminAuthRouter)
    app.use('/artist', artistAuthRouter)
    
    app.use('/user', userRouter)
    app.use('/admin', adminFeaturesRouter)
    app.use('/artist', artistRouter)
    //logger.log("Container resolved authController:", container.resolve('authController'))

    app.use(errorHandlerMiddleware)

    // resolve Notification worker
    container.resolve('notificationWorker');
    
    // monthly payout cron
    PayoutCronJob(container)

    httpServer.listen(PORT, () => {
      logger.info(`✅ Server running on http://localhost:${PORT}`)
    });
  } catch (error) {
    logger.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();
