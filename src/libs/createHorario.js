import Upload from '../models/Upload.js';
import js from 'fs';
let json = js.readFileSync('./JsonHorario.json'); //ARREGLAR ESTO ESTA BUSCANDO DESDE LA RAIS
const horario = JSON.parse(json);

const dia = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
const especiales = [10, 12, 14, 16, 17, 18, 19];
const horas = [
  '7:00 a 7:50',
  '7:50 a 8:40',
  '8:45 a 9:35',
  '9:35 a 10:25',
  '10:30 a 11:20',
  '11:20 a 12:10',
  '12:10 a 01:00',
  '1:10 a 02:00',
  '2:00 a 2:50',
  '2:55 a 3:45',
  '3:45 a 4:35',
];

//FUNCIONES
function juntarTodo(u1, u2, u3, u4) {
  //VALIDACIONS POR LOS ESPACIOS LADILLAS
  var todo = '';
  if (u1 != '') {
    todo = todo + u1;
  }
  if (u2 != '') {
    todo = todo + ' ' + u2;
  }
  if (u3 != '') {
    todo = todo + ' ' + u3;
  }
  if (u4 != '') {
    todo = todo + ' ' + u4;
  }
  //console.log('JUNTO TODO: ' + todo);
  return todo;
}
function nivel(i) {
  var semestre;
  if (i >= 1 && i <= 8) {
    semestre = 1;
  } else {
    if (i >= 9 && i <= 19) {
      semestre = 2;
    }
  }
  return semestre;
}
function calculaSeccion(i) {
  var restar;
  if (i >= 1 && i <= 8) {
    seccion = i;
  } else {
    if (i >= 9 && i <= 19) {
      seccion = i - 8;
      if (especiales.indexOf(i) > -1) {
        if (especiales.indexOf(i) == 18) {
          //CASOS MUY PARTICULARES
          seccion = seccion / 2 + 1;
        }
        if (especiales.indexOf(i) <= 19) {
          //CASOS MUY PARTICULARES
          seccion = Math.ceil(seccion / 2) + 1; //REDONDEA HACIA ARRIBA
        } else {
          seccion = Math.ceil(seccion / 2); //REDONDEA HACIA ARRIBA
        }
        // especiales = [10,12,14,16,17,18,19];
        // ESPERADOS      1, 2. 3, 4, 5, 6, 7
      } else {
        restar = 0;
        for (var s = 0; s < especiales.length; s++) {
          if (especiales[s] <= i) {
            restar++;
          }
        }
        seccion = seccion - restar;
      }
    }
  }
  return seccion;
}
function extraerHora(hora, i) {
  for (var h = 0; h < horas.length; h++) {
    //FOR PARA SUMAR LAS 3 HORAS
    if (horas[h] == hora) {
      if (i == 3) return horas[h + 2];
      else return horas[h + 3];
    }
  }
}
function extraerMateria(data, semestre, seccion, horainicio, horafin, dia) {
  var texto;
  var resto;
  if (data.includes('Prof.')) {
    texto = data.split(' Prof. ');
    materia = texto[0];
    if (texto[1].includes('A-')) {
      resto = texto[1].split(' A-');
      prof = resto[0];
      aula = resto[1];
    } else {
      if (texto[1].includes('A ')) {
        resto = texto[1].split(' A ');
        prof = resto[0];
        aula = resto[1];
      } else {
        if (texto[1].includes('Villa Asia')) {
          resto = texto[1].split(' Villa Asia ');
          prof = resto[0];
          aula = resto[1];
        }
      }
    }
  } else {
    texto = data.split(' Por Asignar ');
    materia = texto[0];
    prof = 'Por Asignar';
    aula = texto[1];
  }
  return {
    dia: dia,
    semestre: semestre,
    seccion: seccion,
    materia: materia,
    profesor: prof,
    aula: aula,
    inicio: horainicio,
    fin: horafin,
  };
}
//VARIABLES
let semestre = '';
let seccion = '';
let horainicio = '';
let horafin = '';
let materia = '';
let prof = '';
let aula = '';

export const uploadHorario = async () => {
  const horarioFound = await Upload.findOne({ dia: 'LUNES' }); //BUSCA AL MENOS 1 LUNES
  if (horarioFound) return;
  // CODIGO DEL SPLIT
  for (var i = 1; i <= 19; i++) {
    // HORARIO LUNES
    for (var j = 0; j < horario[0]['Table ' + i].length; j++) {
      var data = horario[0]['Table ' + i][j].LUNES;
      if (data != '') {
        horainicio = horario[0]['Table ' + i][j].HORA;
        var data1 = horario[0]['Table ' + i][j].LUNES;
        var data2 = horario[0]['Table ' + i][j + 1].LUNES;
        var data3 = horario[0]['Table ' + i][j + 2].LUNES;
        var data4 = '';
        horafin;
        if (especiales.indexOf(i) > -1) {
          data4 = horario[0]['Table ' + i][j + 3].LUNES;
          horafin = extraerHora(horainicio, 4);
          j = j + 3;
        } else {
          horafin = extraerHora(horainicio, 3);
          j = j + 2;
        }
        semestre = nivel(i);
        seccion = calculaSeccion(i);
        var todo = juntarTodo(data1, data2, data3, data4);
        var lunes = extraerMateria(
          todo,
          semestre,
          seccion,
          horainicio,
          horafin,
          'LUNES'
        );
        const newHorario = new Upload({
          dia: lunes.dia,
          semestre: lunes.semestre,
          seccion: lunes.seccion,
          materia: lunes.materia,
          profesor: lunes.profesor,
          aula: lunes.aula,
          inicio: lunes.inicio,
          fin: lunes.fin,
          description: 'LO CARGO BIEN',
        });
        //CARGA EL HORARIO INICIAL
        const horarioLunes = await newHorario.save();
      }
    }
  }
  for (var i = 1; i <= 19; i++) {
    // HORARIO MARTES
    for (var j = 0; j < horario[0]['Table ' + i].length; j++) {
      var data = horario[0]['Table ' + i][j].MARTES;
      if (data != '') {
        horainicio = horario[0]['Table ' + i][j].HORA;
        var data1 = horario[0]['Table ' + i][j].MARTES;
        var data2 = horario[0]['Table ' + i][j + 1].MARTES;
        var data3 = horario[0]['Table ' + i][j + 2].MARTES;
        var data4 = '';
        horafin;
        if (especiales.indexOf(i) > -1) {
          data4 = horario[0]['Table ' + i][j + 3].MARTES;
          horafin = extraerHora(horainicio, 4);
          j = j + 3;
        } else {
          horafin = extraerHora(horainicio, 3);
          j = j + 2;
        }
        semestre = nivel(i);
        seccion = calculaSeccion(i);
        var todo = juntarTodo(data1, data2, data3, data4);
        var martes = extraerMateria(
          todo,
          semestre,
          seccion,
          horainicio,
          horafin,
          'MARTES'
        );
        const newHorario = new Upload({
          dia: martes.dia,
          semestre: martes.semestre,
          seccion: martes.seccion,
          materia: martes.materia,
          profesor: martes.profesor,
          aula: martes.aula,
          inicio: martes.inicio,
          fin: martes.fin,
          description: 'LO CARGO BIEN',
        });
        const horarioMartes = await newHorario.save();
      }
    }
  }
  for (var i = 1; i <= 19; i++) {
    // HORARIO MIERCOLES
    for (var j = 0; j < horario[0]['Table ' + i].length; j++) {
      var data = horario[0]['Table ' + i][j].MIERCOLES;
      if (data != '') {
        horainicio = horario[0]['Table ' + i][j].HORA;
        var data1 = horario[0]['Table ' + i][j].MIERCOLES;
        var data2 = horario[0]['Table ' + i][j + 1].MIERCOLES;
        var data3 = horario[0]['Table ' + i][j + 2].MIERCOLES;
        var data4 = '';
        horafin;
        if (especiales.indexOf(i) > -1) {
          data4 = horario[0]['Table ' + i][j + 3].MIERCOLES;
          horafin = extraerHora(horainicio, 4);
          j = j + 3;
        } else {
          horafin = extraerHora(horainicio, 3);
          j = j + 2;
        }
        semestre = nivel(i);
        seccion = calculaSeccion(i);
        var todo = juntarTodo(data1, data2, data3, data4);
        var miercoles = extraerMateria(
          todo,
          semestre,
          seccion,
          horainicio,
          horafin,
          'MIERCOLES'
        );
        const newHorario = new Upload({
          dia: miercoles.dia,
          semestre: miercoles.semestre,
          seccion: miercoles.seccion,
          materia: miercoles.materia,
          profesor: miercoles.profesor,
          aula: miercoles.aula,
          inicio: miercoles.inicio,
          fin: miercoles.fin,
          description: 'LO CARGO BIEN',
        });
        const horarioMiercoles = await newHorario.save();
      }
    }
  }
  for (var i = 1; i <= 19; i++) {
    // HORARIO JUEVES
    for (var j = 0; j < horario[0]['Table ' + i].length; j++) {
      var data = horario[0]['Table ' + i][j].JUEVES;
      if (data != '') {
        horainicio = horario[0]['Table ' + i][j].HORA;
        var data1 = horario[0]['Table ' + i][j].JUEVES;
        var data2 = horario[0]['Table ' + i][j + 1].JUEVES;
        var data3 = horario[0]['Table ' + i][j + 2].JUEVES;
        var data4 = '';
        horafin;
        if (especiales.indexOf(i) > -1) {
          data4 = horario[0]['Table ' + i][j + 3].JUEVES;
          horafin = extraerHora(horainicio, 4);
          j = j + 3;
        } else {
          horafin = extraerHora(horainicio, 3);
          j = j + 2;
        }
        semestre = nivel(i);
        seccion = calculaSeccion(i);
        var todo = juntarTodo(data1, data2, data3, data4);
        var jueves = extraerMateria(
          todo,
          semestre,
          seccion,
          horainicio,
          horafin,
          'JUEVES'
        );
        const newHorario = new Upload({
          dia: jueves.dia,
          semestre: jueves.semestre,
          seccion: jueves.seccion,
          materia: jueves.materia,
          profesor: jueves.profesor,
          aula: jueves.aula,
          inicio: jueves.inicio,
          fin: jueves.fin,
          description: 'LO CARGO BIEN',
        });
        const horarioJueves = await newHorario.save();
      }
    }
  }
  for (var i = 1; i <= 19; i++) {
    // HORARIO VIERNES
    for (var j = 0; j < horario[0]['Table ' + i].length; j++) {
      var data = horario[0]['Table ' + i][j].VIERNES;
      if (data != '') {
        horainicio = horario[0]['Table ' + i][j].HORA;
        var data1 = horario[0]['Table ' + i][j].VIERNES;
        var data2 = horario[0]['Table ' + i][j + 1].VIERNES;
        var data3 = horario[0]['Table ' + i][j + 2].VIERNES;
        var data4 = '';
        horafin;
        if (especiales.indexOf(i) > -1) {
          data4 = horario[0]['Table ' + i][j + 3].VIERNES;
          horafin = extraerHora(horainicio, 4);
          j = j + 3;
        } else {
          horafin = extraerHora(horainicio, 3);
          j = j + 2;
        }
        semestre = nivel(i);
        seccion = calculaSeccion(i);
        var todo = juntarTodo(data1, data2, data3, data4);
        var viernes = extraerMateria(
          todo,
          semestre,
          seccion,
          horainicio,
          horafin,
          'VIERNES'
        );
        const newHorario = new Upload({
          dia: viernes.dia,
          semestre: viernes.semestre,
          seccion: viernes.seccion,
          materia: viernes.materia,
          profesor: viernes.profesor,
          aula: viernes.aula,
          inicio: viernes.inicio,
          fin: viernes.fin,
          description: 'LO CARGO BIEN',
        });
        const horarioViernes = await newHorario.save();
      }
    }
  }

  console.log('Horario Inicial Fue creado');
};
