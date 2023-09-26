import mongoose from 'mongoose'; //MI ESQUEMA PARA MI DATOS A GUARDAR EN LA DB

const NoteSchema = new mongoose.Schema( //DEFINO LO QUE QUIERO GUARDAR EN LA BASE DE DATOS
  {
    dia: {
      type: String,
      require: false,
    },
    title: {
      type: String,
      require: true,
    },
    semestre: {
      type: String,
      require: false,
    },
    seccion: {
      type: String,
      require: false,
    },
    materia: {
      type: String,
      require: false,
    },
    profesor: {
      type: String,
      require: false,
    },
    aula: {
      type: String,
      require: false,
    },
    inicio: {
      type: String,
      require: false,
    },
    fin: {
      type: String,
      required: false,
    },
    observacion: {
      //ESTO LO PUEDO BORRAR
      type: String,
      required: false,
    },
    user: {
      //ASOCIA DE HORARIO CON USUARIO EN NOTAS
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, //AÑADE PROPIEDADES PARA SU ACTUALIZACION Y CREACION
  }
);

export default mongoose.model('Note', NoteSchema);
