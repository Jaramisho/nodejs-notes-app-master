import app from './app.js'; // CON ESTO LLAMO A MI SERVIDOR DESDE APP
import { createAdminUser } from './libs/createUser.js'; // FUNCION PARA CREAR USUARIO ADMINISTRADOR
import { uploadHorario } from './libs/createHorario.js'; // FUNCION PARA CREAR HORARIO SI NO EXISTE
import './database.js'; // LLAMA A LA BASE DE DATOS

async function main() {
  //SE ENCARGA DE ARRANCAR EL SERVIDOR
  await createAdminUser();
  await uploadHorario();
  app.listen(app.get('port'));

  console.log('Server on port', app.get('port'));
  console.log('Environment:', process.env.NODE_ENV);
}

main();
