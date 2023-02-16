import 'dotenv/config';
import App from './app';
import BillController from './bills/bill.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
  [
    new BillController(),
  ],
);

app.listen();