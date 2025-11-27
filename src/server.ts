import dotenv from 'dotenv';
import connectDB from './infrastructure/config/db';
import { connectRedis } from './infrastructure/config/redis';
import app from './interfaces/express/app';
import container from './infrastructure/di/container';
import authRouterFactory from './interfaces/http/routes/auth.routes';
import { loggerMiddleware } from './interfaces/middleware/loggerMiddleware';
import { errorHandlerMiddleware } from './interfaces/middleware/errorHandler';
import adminAuthRouterFactory from './interfaces/http/routes/admin/admin.auth.routes'
import artistAuthRouterFactory from './interfaces/http/routes/artist/artist.auth.routes';
import userRouterFactory from './interfaces/http/routes/user/user.routes'
import logger from './infrastructure/utils/logger/logger';
import adminFeaturesRouterFactory from './interfaces/http/routes/admin/admin.features.routes'

dotenv.config();

const PORT = process.env.PORT;

async function startServer() {
  try {
    await connectDB();
    await connectRedis();
    
    app.use(loggerMiddleware);

    // Attach the auth router configured with DI after all the infrastructure connection is done
    const authRouter = authRouterFactory(container);
    const adminAuthRouter = adminAuthRouterFactory(container)
    const artistAuthRouter = artistAuthRouterFactory(container)
    const userRouter = userRouterFactory(container)
    const adminFeaturesRouter = adminFeaturesRouterFactory(container)
    
    app.use('/user', authRouter);
    app.use('/admin', adminAuthRouter)
    app.use('/artist', artistAuthRouter)
    app.use('/user', userRouter)
    app.use('/admin', adminFeaturesRouter)
    //logger.log("Container resolved authController:", container.resolve('authController'))

    app.use(errorHandlerMiddleware)

    app.listen(PORT, () => {
      logger.info(`✅ Server running on http://localhost:${PORT}`)
    });
  } catch (error) {
    logger.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();
