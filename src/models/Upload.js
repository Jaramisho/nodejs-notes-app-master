import mongoose from 'mongoose'; //MI ESQUEMA PARA MI DATOS A GUARDAR EN LA DB

const HorarioSchema = new mongoose.Schema( //DEFINO LO QUE QUIERO GUARDAR EN LA BASE DE DATOS
  {
    dia: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    semestre: {
      type: String,
      require: true,
    },
    seccion: {
      type: String,
      require: true,
    },
    materia: {
      type: String,
      require: true,
    },
    profesor: {
      type: String,
      require: true,
    },
    aula: {
      type: String,
      require: true,
    },
    inicio: {
      type: String,
      require: true,
    },
    fin: {
      type: String,
      required: true,
    },
    observacion: {
      //ESTO LO PUEDO BORRAR
      type: String,
      required: true,
    },
    user: {
      //ASOCIA DE HORARIO CON USUARIO EN NOTAS
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, //AÑADE PROPIEDADES PARA SU ACTUALIZACION Y CREACION
  }
);

export default mongoose.model('Horario', HorarioSchema);
