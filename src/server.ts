import dotenv from 'dotenv';
import connectDB from './infrastructure/config/db';
import { connectRedis } from './infrastructure/config/redis';
import app from './interfaces/express/app';
import container from './infrastructure/di/container';
import authRouterFactory from './interfaces/http/routes/auth.routes';
import { loggerMiddleware } from './interfaces/middleware/loggerMiddleware';
import { errorHandlerMiddleware } from './interfaces/middleware/errorHandler';

dotenv.config();

const PORT = process.env.PORT;

async function startServer() {
  try {
    await connectDB();
    await connectRedis();

    // Attach the auth router configured with DI after all the infrastructure connection is done
    const authRouter = authRouterFactory(container);
    app.use(loggerMiddleware);
    app.use('/user', authRouter);
    //console.log("Container resolved authController:", container.resolve('authController'))

    app.use(errorHandlerMiddleware)

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();
