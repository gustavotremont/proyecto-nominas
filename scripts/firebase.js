const express = require('express');
const expressClient = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = "mongodb://localhost:27017/";

expressClient.get('/', (req, res) => {
    res.sendFile(__dirname + '../index.html');
});

expressClient.post('/addUser', (req, res) => {
    
    const form = document.getElementById('formBody');
    const email = form.email.value;
    const password = form.pass.value;
    const dni = form.dni.value;
    const nombre = form.nombre.value;
    const apellidos = form.apellidos.value;
    const salario = form.salario.value;
    const irpf = form.irpf.value;
    const tipoUsuario = form.tipoUsuario.value;

        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            let dbo = db.db('proyectoNomina');
            const myobj = {
              "dni": dni,
              "nombre": nombre,
              "apellidos": apellidos,
              "salario": salario,
              "irpf": irpf,
              "email": email,
              "password": password,
              "tipoUsuario": tipoUsuario
            }
      
            dbo.collection('empleados').insertOne(myobj, (err, res) => {
                if (err) throw err;
                console.log("Documento insertado");
                db.close();
            });
        });
        
    });


expressClient.listen(3000)

// document.getElementById('signin').addEventListener('click', (e) => {
//     e.preventDefault()
//     const form = document.getElementById('formBody');
//     const email = form.email.value;
//     const password = form.pass.value;

//     signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//        console.log(userCredential.user.uid)
//     })
//     .catch((error) => {
//         alert(error);
//     });
// })

// document.getElementById('signout').addEventListener('click', (e) => {
//     e.preventDefault()
//     signOut(auth).then(() => {
//         alert('te delogeaste')
//       }).catch((error) => {
//         alert(error);
//       });
// })

// document.getElementById('showId').addEventListener('click', (e) => {
//     e.preventDefault()
//     const id = auth.currentUser.uid
//     console.log(id);
// })