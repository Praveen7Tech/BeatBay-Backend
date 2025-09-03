// src/server.ts
import app from './app';
import logger from './infrastructure/utils/logger/logger';
import Sample from './routes/sample';

const PORT =  3000;

// console.log("console log")
// logger.warn("warning log")
// logger.info("info log")
// logger.debug("debug log")

//Sample()
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
