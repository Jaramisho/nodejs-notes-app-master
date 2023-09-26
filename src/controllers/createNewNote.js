import Note from '../models/Note.js';


export const createNewNote = async (req, res) => {
  //GREA UN HORARIO
  const { title, observacion } = req.body;
  console.log('TITULO TIENE: ' + title); //AQUI JALA LOS lo que se quieres agregar de HORARIO
  const errors = [];
  if (!title) {
    errors.push({ text: 'Por favor escribe un Titulo.' });
  }
  if (!observacion) {
    errors.push({ text: 'Por favor escribe un Descripcion.' });
  }
  if (errors.length > 0)
    return res.render('notes/new-note', {
      errors,
      dia,
      title,
      observacion,
    });

  const newNote = new Note({ title, observacion });
  newNote.user = req.user.id; //ESTO ASOCIA LA "NOTA" ES DECIR EL HORARIO CON USUARIO
  await newNote.save();
  req.flash('success_msg', 'Materia Agregada satisfactoriamente');
  res.redirect('/notes');
};
