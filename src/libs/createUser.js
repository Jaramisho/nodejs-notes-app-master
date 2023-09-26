import User from '../models/User.js';

export const createAdminUser = async () => {
  const userFound = await User.findOne({ email: 'admin@localhost' });

  if (userFound) return;

  const newUser = new User({
    name: 'admin',//ANTES ERA username
    email: 'admin@localhost',
    //RECCORDA AGREGAR EL NIVEIL Y EL NOMBRE
  });

  newUser.password = await newUser.encryptPassword('admin');

  const admin = await newUser.save();

  console.log('Admin user created', admin);
};
