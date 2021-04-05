import dotenv from 'dotenv';
import { start } from './managers/socketServer.manager';

dotenv.config();

const port = parseInt(process.env.PORT) || 8080;

start(port);