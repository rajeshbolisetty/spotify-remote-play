import express from 'express';
import setupCors from './middleware/cors';
import setupLogging from './middleware/logging';
import { errorHandler } from './middleware/errors';
import { getConfig } from './config';
import { getHealthStatus } from './controllers/health';
import { triggerPlayListOnDevice } from './controllers/trigger-playlist';
import bodyParser from 'body-parser';
const app = express();
const port = getConfig().server.port;
const apiRouter = express.Router();
const jsonParser = bodyParser.json({ strict: false, limit: '1mb' });

setupCors(app);
setupLogging(app);

app.use('/api', apiRouter);
apiRouter.get('/health', getHealthStatus);
apiRouter.post('/trigger-playlist', jsonParser, triggerPlayListOnDevice);
apiRouter.post('/pause-playback', jsonParser, triggerPlayListOnDevice);

// Error handling middleware
apiRouter.use(errorHandler);

app.listen(port, '0.0.0.0', () => console.log(`server listening on port ${port}!`));
