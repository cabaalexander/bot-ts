import dotenv from 'dotenv';
import {type Bindings} from '../types';

dotenv.config({
  path: '.dev.vars',
});

export default process.env as Bindings;
