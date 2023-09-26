import { config } from 'dotenv';
config();

export const PORT = process.env.PORT || 4000; //SI NO ENCUENTA EL PORT EN .env USA EL 4000
export const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/horariosdb'; //SI NO ENCUENTA EL MONGODB_URI EN .env USA EL 4000
