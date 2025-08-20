import morgan from 'morgan';
import { Express } from 'express';

export default (app: Express) => {
  app.use(morgan('short'));
};
