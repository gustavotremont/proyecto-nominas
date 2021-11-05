// const fs = require('fs'); // Módulo file stystem para crear ficheros
// const http = require('http'); // Módulo http para crear servidores
// const url = require('url'); // Módulo url
const express = require('express');
const expressClient = express();

const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017/';

const mydb = 'proyectoNomina';
const collection = 'empleados';

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

expressClient.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

expressClient.get('/signuprrhh', (req, res) => {
    res.sendFile(__dirname + '/signuprrhh.html');
});

expressClient.get('/showdata', (req, res) => {
    res.sendFile(__dirname + '/show.html');
});

expressClient.post('/showdata', urlencodedParser, (req, res) => {
    const dni = req.body.dni;
    const pass = req.body.pass;

    mongoClient.connect(url, async (err, db) => {
        if (err) throw err;
        var dbo = db.db(mydb);
        var query = { dni: dni, contraseña: pass };

        const userToFind = await dbo
            .collection(collection)
            .find(query)
            .toArray();

        const template = `
            <div class="user__data">
                <p name="dni">DNI: ${userToFind[0].dni}</p>
                <p>NOMBRE: ${userToFind[0].nombre} ${userToFind[0].apellidos}</p>
                <form method="POST" action="/showpayroll" class="validate">
                    <label for="month">Ingresa el mes en números</label>
                    <input type="number" name="month" id="month" min="1" max="12" required />
                    <label for="year">Ingresa el año en números</label>
                    <input type="number" name="year" id="year" required />
                    <input type="submit" value="Buscar"/>
                    <input type="text" value="${userToFind[0].dni}" name="dniPay" style="display: none"/>
                </form>
    
                <form method="POST" action="/showalldates" class="validate">
                    <input type="text" value="${userToFind[0].dni}" name="dniAll" style="display: none"/>
                    <input type="submit" value="Ver todas las fechas"/>
                </form>
            <div>`;

        db.close();
        res.send(template);
    });
});

// Show all dates
expressClient.post('/showalldates', urlencodedParser, (req, res) => {
    const dni = req.body.dniAll;

    mongoClient.connect(url, async (err, db) => {
        if (err) throw err;
        var dbo = db.db(mydb);
        var query = { dni: dni };

        const userToFind = await dbo
            .collection(collection)
            .find(query)
            .toArray();

        let template = '<h2>NOMINAS</h2>';

        template += userToFind[0].nominas
            .map(element => {
                const month = element.fecha.getUTCDate(); //+ 1;
                const year = element.fecha.getUTCFullYear();
                const newDate = month + ' - ' + year;
                return `
            <div>
                <p>FECHA: ${newDate}</p>
                <p>SALARIO: ${element.salario}</p>
            <div>`;
            })
            .join('');

        db.close();
        res.send(template);
    });
});

// Show date by month
expressClient.post('/showpayroll', urlencodedParser, (req, res) => {
    const dni = req.body.dniPay;
    const month = req.body.month;
    const year = req.body.year;

    const newDate = new Date(`${year}-01-${month}`);

    mongoClient.connect(url, async (err, db) => {
        if (err) throw err;
        const dbo = db.db(mydb);
        const query = { dni: dni };

        const userToFind = await dbo
            .collection(collection)
            .find(query)
            .toArray();

        console.log(userToFind[0].nominas);
        console.log(newDate);
        const selectDate = userToFind[0].nominas.filter(element => {
            console.log(element.fecha);
            return element.fecha == newDate;
        });
        console.log(selectDate);
        let template = `<div>${selectDate}</div>`;

        db.close();
        // res.send(template);
    });
});

expressClient.listen(3000);
