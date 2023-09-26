import Note from '../models/Note.js';
import Horarios from '../models/Upload.js';


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

export const renderNoteForm = async (req, res) => {
  //REALIZA LA BUSQUEDA EN LA BASE DE DATOS
  const dataFound = await Horarios.find({ semestre:'1', seccion:'1' }).lean();
  if (dataFound) {
    //console.log(dataFound);
  } else {
    console.log('NO ENCONTRO NADA');
  }
  res.render('notes/new-note', { dataFound });
}; //RENDERISA LA VISTA

export const renderNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .lean();
  res.render('notes/all-notes', { notes });
};

export const renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  if (note.user != req.user.id) {
    req.flash('error_msg', 'No se encuentra Autorizado');
    return res.redirect('/notes');
  }
  res.render('notes/edit-note', { note });
};

export const updateNote = async (req, res) => {
  const { title, observacion } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, observacion });
  req.flash('success_msg', 'Materia Actualizada');
  res.redirect('/notes');
};

export const deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Materia Eliminada Satisfactoriamente');
  res.redirect('/notes');
};
