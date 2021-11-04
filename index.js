const express = require('express');
const expressClient = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = "mongodb://localhost:27017/";

// //ver el salario bruto de una persona por dni
// MongoClient.connect(url, (err, db) => {
//     if (err) throw err;
//     var dbo = db.db('proyectoNomina');
//     var query = { "dni": "09853571A" };

//     dbo.collection('empleados').find(query).toArray(function(err, result) {
//       if (err) throw err;
//       const usuario = result[0];
//       const salario = usuario.salario;
//       const irpf = usuario.irpf;
//       const nomina = parseFloat(salario - (salario * (irpf/100)))
//       console.log(`Nombre empleado: ${usuario.nombre} \nDNI: ${usuario.dni} \nSalario Bruto: ${salario}$ \nIRPF: ${irpf}% \nNomina mensual: ${nomina}`);
//       db.close();
//     });
// });

//usuario busca su nomina por dni y contraseña
MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    var dbo = db.db('proyectoNomina');
    var query = { "dni": "09853571A", "password": "123456789" };

    dbo.collection('empleados').find(query).toArray(function(err, result) {
      if (err) throw err;
      const usuario = result[0];
      const salario = usuario.salario;
      const irpf = usuario.irpf;
      const nomina = parseFloat(salario - (salario * (irpf/100)))
      console.log(`Nombre empleado: ${usuario.nombre} \nDNI: ${usuario.dni} \nSalario Bruto: ${salario}$ \nIRPF: ${irpf}% \nNomina mensual: ${nomina}`);
      db.close();
    });
});

//