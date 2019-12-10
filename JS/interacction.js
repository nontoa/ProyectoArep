String.prototype.hashCode = function () {
  var hash = 0,
    i, chr
  if (this.length === 0) return hash
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

function contadorCarrito () {
  var usuario = Cookies.get('mmail')
  axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + usuario)
    .then(function (response) {
      var articulosEnCarrito
      articulosEnCarrito = response.data.carrito.length
      $('#contadorCarrito').attr('data-count', articulosEnCarrito)
    })
}

function irChat () {
  window.location.assign('indexChat.html')
}

function addUser () {
  var cedulaI = $('#cedula').val()
  var nombreI = $('#name').val()
  var apellidoI = $('#lastName').val()
  var emailI = $('#mail').val()
  var passwordI = $('#pass').val().hashCode()
  axios.get('http://localhost:8081/funcionario/' + emailI)
    .then(function (response) {
      user = response.data
      if (user.length == 0) { 
        axios.post('http://localhost:8081/funcionario/create-funcionario', {
          cedula: cedulaI,
          nombre: nombreI,
          apellido: apellidoI,          
          email: emailI,
          password: passwordI
        })
          .then(function (response) {            
            window.location.assign('Loggin.html')
          })
          .catch(function (error) {
            console.log(error + ' No se logro hacer post')
          })
      }
      else {
        alert('Ese usuario ya existe, ingrese otro')
      }
    })
    .catch(function (error) {
      console.log(error + 'No se trajo el usuario')
    })
      
}

function veriLog (response, passlogin, emailLog) {
  var datas = response.data  
  var pass = datas.password
  if (pass == passlogin) {
    window.location.assign('Home.html')
    Cookies.set('name', datas.nombre)
    Cookies.set('mmail', datas.email)
  } else {
    $('#pass_inco').append('<div class="alert alert-warning alert-dismissible fade show" role="alert">' + '<strong>Incorrect Password</strong> You should verify your password.' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' + '<span aria-hidden="true">&times;</span>' + '</button>' + '</div>')
  }
}

function desNotify () {
  var correo = Cookies.get('mmail')
  axios.put('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/' + correo + '/desNotify')
    .then(function (response) {
      console.log(' Se hizo put y se actualizo')
    })
    .catch(function (error) {
      console.log(error + ' No se logro hacer put')
    })
}

function notify () {
  axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + Cookies.get('mmail'))
    .then(function (response) {
      var notifyPendiente = response.data.notPendientes
      if (notifyPendiente) {
        $('#notIcon').css('color', '#cf0b0b')
        $('#notText').css('color', '#cf0b0b')
      }
    })
    .catch(function (error) {
      console.log(error + 'No se hizo get del usuario')
    })
}

function addFile (ID, name_file) {
  var ident = ID.id
  var nameF = $('#filename' + ident).val()
  var price = $('#price' + ident).val()
  var typeF = $('#type_file' + ident).val()
  var description = $('#description_file' + ident).val()
  var file = name_file
  var emailU = Cookies.get('mmail')
  axios.post('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/archivo', {
    nombre: nameF,
    precio: price,
    tipoArchivo: typeF,
    descripcion: description,
    path: file
  })
    .then(function (response) {
      console.log(' Se hizo post y se añadio el archivo')
      var intro = name_file.replace(/ /g, '')
      var intro = intro.replace('.', '')
      var intro = intro.replace(')', '')
      var intro = intro.replace('(', '')
      var intro = intro.replace(/[.*+?^${}()|[\]\\]/g, '')
      $('#' + intro).empty()
      $('#' + intro).remove()
      app.publishNotify()
    })
    .catch(function (error) {
      console.log(error + ' No se logro hacer post')      
    })

  axios.put('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/' + emailU + '/anadirArchivoAVender?nombre=' + nameF)
    .then(function (response) {
      console.log(response + ' Se hizo put y se actualizo')
    })
    .catch(function (error) {
      console.log(error + ' No se logro hacer put')
    })
}

function addFollowing () {
  var correo = $('#Email_following').val()
  var emailU = Cookies.get('mmail')
  axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + correo)
    .then(function (response) {
      user = response.data
      if (user.length != 0) {
        axios.put('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/' + emailU + '/anadirFollowing?email2=' + correo)
          .then(function (response) {
            addFollower(correo)
            llenarTablaFollowing()          
          })
          .catch(function (error) {
            console.log(error + ' No se logro hacer put')
          })
      }
    })
    .catch(function (error) {
      console.log(error + 'No se trajo following')
    })
  app2.init2(correo)
  setTimeout(() => {
    app2.publishNotify(correo)
  }, 2000)
}

function addFollower (correoS) {
  var correo = correoS
  var emailU = Cookies.get('mmail')
  axios.put('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/' + correo + '/anadirFollower?email2=' + emailU)    
    .then(function (response) {      
      llenarTablaFollowers()
    })
    .catch(function (error) {
      console.log(error + ' No se logro hacer put')
    })
}

function unFollowing (comp) {
  var C = comp.id
  var emailU = Cookies.get('mmail')
  axios.put('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/' + emailU + '/eliminarFollowing?email2=' + C)
    .then(function (response) {
      console.log(response + ' Se hizo put y se actualizo')
    })
    .catch(function (error) {
      console.log(error + ' No se logro hacer put')
    })
  axios.put('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/' + C + '/eliminarFollower?email2=' + emailU)
    .then(function (response) {
      llenarTablaFollowing()
    })
    .catch(function (error) {
      console.log(error + ' No se logro hacer put')
    })
}

function llenarTablaFollowing () {
  axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + Cookies.get('mmail'))
    .then(function (response) {
      var lista = response.data.following
      $('#table_following').find('tbody').empty()
      for (var i = 0; i < lista.length; i++) {
        var user
        axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + lista[i])
          .then(function (response) {
            user = response.data
            var s
            var a
            var b
            a = '<td> <center> <button id=' + user.email + ' type="button" class="btn btn-danger" onclick="unFollowing(this);return false" >Unfollow</button> </center> </td>'
            b = '<td> <center> <button id=' + user.email + 'type="button" class="btn btn-primary" onclick="irPerfilU(this);return false" >Go to profile</button> </center> </td>'
            s = '<tr> ' + '<td>' + user.nombre + '</td>' + '<td id=' + user.email + '>' + user.email + '</td>' + a + b + '</tr>'
            $('#table_following').find('tbody').append(s)
          })
          .catch(function (error) {
            console.log(error + 'No se trajo following')
          })
      }
      $('#table_following').find('tbody').append()
    })
    .catch(function (error) {
      console.log(error + 'No se hizo get')
    })
}

function llenarTablaFollowers () {
  axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + Cookies.get('mmail'))
    .then(function (response) {
      var lista = response.data.followers
      $('#table_follower').find('tbody').empty()
      for (var i = 0; i < lista.length; i++) {
        var user
        axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + lista[i])
          .then(function (response) {
            user = response.data
            var s
            var a
            a = '<td> <center> <button id=' + user.email + ' type="button" class="btn btn-primary" onclick="irPerfilU(this);return false" >Go to profile</button> </center> </td>'
            s = '<tr> ' + '<td>' + user.nombre + '</td>' + '<td>' + user.email + '</td>' + a + '</tr>'
            $('#table_follower').find('tbody').append(s)
          })
          .catch(function (error) {
            console.log(error + 'No se trajo follower')
          })
      }
      $('#table_follower').find('tbody').append()
    })
    .catch(function (error) {
      console.log(error + 'No se hizo get')
    })
}

function logearse () {
  var correo_login = $('#email-in').val()
  var pass_login = $('#pass-in').val().hashCode()
  axios.get('http://localhost:8081/funcionario/' + correo_login)
    .then(function (response) {
      if (response.data == 0) {
        $('#user_inco').append('<div class="alert alert-danger alert-dismissible fade show" role="alert">' + '<strong>The user does not exist!!</strong> You should verify your user.' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' + '<span aria-hidden="true">&times;</span>' + '</button>' + '</div>')
      } else {
        veriLog(response, pass_login, correo_login)
      }
    })
    .catch(function (error) {
      console.log('No existe el usuario con ese correo')
    })
}

function llenarTabla (response) {
  var lista = response.data.articulosAVender
  $('#table_file').find('tbody').empty()
  for (var i = 0; i < lista.length; i++) {
    var file
    axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/archivos?' + 'nombre=' + lista[i])
      .then(function (response) {
        file = response.data        
        var s
        var ruta = 'https://s3.us-east-2.amazonaws.com/uploadshop/' + file.path
        s = '<tr> ' + '<td>' + file.nombre + '</td>' +
          '<td>' + file.precio + '</td>' +
          '<td>' + file.tipoArchivo + '</td>' +
          '<td>' + file.descripcion + '</td>' +
          '<td>' + '<a href=' + ruta.replace(/ /g, '+') + '>' + file.path + '</a>' + '</td>' + '</tr>'
        $('#table_file').find('tbody').append(s)
      })
      .catch(function (error) {
        console.log(error + 'No se trajo archivo')
      })
  }
  $('#table_file').find('tbody').append()
}

function llenarTabla2 (response) {
  var lista = response.data.articulosComprados
  $('#table_file2').find('tbody').empty()
  for (var i = 0; i < lista.length; i++) {
    var file
    axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/archivos?' + 'nombre=' + lista[i])
      .then(function (response) {
        file = response.data        
        var s        
        var ruta = 'https://s3.us-east-2.amazonaws.com/uploadshop/' + file.path
        s = '<tr> ' + '<td>' + file.nombre + '</td>' +
          '<td>' + file.tipoArchivo + '</td>' +
          '<td>' + file.descripcion + '</td>' +          
          '<td>' + '<a href=' + ruta.replace(/ /g, '+') + '>' + file.path + '</a>' + '</td>' + '</tr>'
        $('#table_file2').find('tbody').append(s)
      })
      .catch(function (error) {
        console.log(error + 'No se trajo archivo')
      })
  }
  $('#table_file2').find('tbody').append()
}

function irPerfilU (cmp) {
  Cookies.set('c', cmp.id)
  window.location.assign('PerfilUser.html')
}

function goToProfile () {
  var e = Cookies.get('c')
  axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + e.replace('type="button"', ''))
    .then(function (response) {
      $('#NameU').find('b').empty()
      $('#NameU').find('b').append(response.data.nombre + "'s Profile")
      $('#NameU').find('b').append()
      llenarTablaPerfil(response)
    })
    .catch(function (error) {
      console.log('No existe el usuario con ese email')
    })
}

function pagos(){  
  axios.get('http://localhost:8081/estudiante/all-estudiantes')
    .then(function (response) {      
      llenarTablaPagos(response)
    })
    .catch(function (error) {
      console.log('No existe el estudiante')
    })
}

function llenarTablaPagos(response){
  var info = response.data;
  $('#table_pagos').find('tbody').empty()
  a = ' <center> <button type="button" class="btn btn-success" >Generar Recibo</button> </center>'
  for (var i = 0; i < info.length ; i++){
    s = '<tr> ' + '<td>' + info[i].nombre + " "+ info[i].apellido + '</td>' +          
          '<td>' + info[i].carne + '</td>' +
          '<td>' + info[i].carrera + '</td>' +
          '<td>' + a+ '</td>' + '</tr>'
    $('#table_pagos').find('tbody').append(s)    
  }
  $('#table_pagos').find('tbody').append()
}

function SearchEstudiante(){
  var carne = $('#Carne_Est').val()
  axios.get('http://localhost:8081/estudiante/'+carne)
    .then(function (response) {      
      llenarTablaEstudiante(response)
    })
    .catch(function (error) {
      console.log('No existe el estudiante')
    })

}

function llenarTablaEstudiante (response) {
  var info = response.data;
  $('#table_personal').find('tbody').empty()
  s = '<tr> ' + '<td>' + info.nombre + '</td>' +
          '<td>' + info.apellido + '</td>' +
          '<td>' + info.cedula + '</td>' +
          '<td>' + info.direccion + '</td>' +
          '<td>' + info.telefono + '</td>' + '</tr>'
  $('#table_personal').find('tbody').append(s)
  $('#table_personal').find('tbody').append()

  $('#table_academica').find('tbody').empty()
  a = '<tr> ' + '<td>' + info.carne + '</td>' +
          '<td>' + info.semestre + '</td>' +
          '<td>' + info.programa + '</td>' +
          '<td>' + info.carrera + '</td>' +
          '<td>' + info.materias + '</td>' +
          '<td>' + info.procesoa + '</td>' + '</tr>'
  $('#table_academica').find('tbody').append(a)
  $('#table_academica').find('tbody').append()
}

function llenarTablaPerfil (response) {
  var lista = response.data.articulosAVender
  $('#table_perfil').find('tbody').empty()
  var a
  a = ' <center> <button id=' + response.data.email + ' type="button" class="btn btn-primary" onclick="" >Add to cart</button> </center>'
  for (var i = 0; i < lista.length; i++) {
    var file
    axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/archivos?' + 'nombre=' + lista[i])
      .then(function (response) {
        file = response.data
        var jesus = file.nombre
        var s        
        var ruta = 'https://s3.us-east-2.amazonaws.com/uploadshop/' + file.nombre
        var a
        a = ' <center> <button id="' + file.nombre + '" type="button" class="btn btn-primary" onclick="addToCarrito(this);return false" >Add to cart</button> </center>'
        s = '<tr> ' + '<td>' + file.nombre + '</td>' +
          '<td>' + file.precio + '</td>' +
          '<td>' + file.tipoArchivo + '</td>' +
          '<td>' + file.descripcion + '</td>' +
          '<td>' + a + '</td>' + '</tr>'
        $('#table_perfil').find('tbody').append(s)
      })
      .catch(function (error) {
        console.log(error + 'No se trajo archivo')
      })
  }
  $('#table_file').find('tbody').append()
}

function addToCarrito (response) {
  var usuario = Cookies.get('mmail')
  var archivo = response.id  
  axios.put('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/' + usuario + '/anadirACarrito?archivo=' + archivo)
    .then(function () {
      contadorCarrito()
    })
}

function deleteFromCarrito (response) {
  var usuario = Cookies.get('mmail')
  var archivo = response.id  
  axios.put('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/' + usuario + '/eliminarDeCarrito?archivo=' + archivo).then(function () {
    llenarCarrito()
    contadorCarrito()
  })
}

function llenarCarrito () {
  axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + Cookies.get('mmail'))
    .then(function (response) {
      llenarTablaCarrito(response)
    })
    .catch(function (error) {
      console.log(error + 'No se hizo get')
    })
}

function llenarTablaCarrito (response) {
  var lista = response.data.carrito  
  $('#table_carrito').find('tbody').empty()
  var total = 0
  for (var i = 0; i < lista.length; i++) {
    var file
    file = lista[i]
    total += file.precio
    var s
    s = '<tr> ' + '<td>' + file.nombre + '</td>' +
      '<td>' + file.precio + '</td>' +
      '<td>' + file.tipoArchivo + '</td>' +
      '<td>' + file.descripcion + '</td>' +
      '<td>' + ' <center> <button id="' + file.nombre + '" type="button" class="btn btn-primary" onclick="deleteFromCarrito(this);return false" >Remove</button> </center>' + '</td>'
    $('#table_carrito').find('tbody').append(s)
    $('#table_carrito').find('tbody').append()
  }
  $('#total').empty()
  $('#total').append('Total: ' + currencyFormat(total))
}

function currencyFormat (num) {
  return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function llenarTablaChat () {
  axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + Cookies.get('mmail'))
    .then(function (response) {
      var lista = response.data.followers
      $('#table_chat').find('tbody').empty()
      for (var i = 0; i < lista.length; i++) {
        var user
        axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + lista[i])
          .then(function (response) {
            user = response.data
            var s
            var a
            a = '<td> <center> <button type="button" class="btn btn-primary" onclick="irChat()">Go to chat</button> </center> </td>'
            s = '<tr> ' + '<td>' + user.nombre + '</td>' + '<td>' + user.apellido + '</td>' + '<td>' + user.email + '</td>' + a + '</tr>'
            $('#table_chat').find('tbody').append(s)
          })
          .catch(function (error) {
            console.log(error + 'No se trajo follower')
          })
      }
      $('#table_chat').find('tbody').append()
    })
    .catch(function (error) {
      console.log(error + 'No se hizo get')
    })
}

function llenarTablaNotificacion () {
  axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + Cookies.get('mmail'))
    .then(function (response) {
      var lista = response.data.notificaciones
      $('#table_notifications').find('tbody').empty()
      for (var i = 0; i < lista.length; i++) {
        var s
        s = '<tr> ' + '<td>' + lista[i].de + '</td>' + '<td>' + lista[i].mensaje + '</td>' + '<td>' + lista[i].archivo + '</td>' + '<td>' + lista[i].fecha + '</td>' + '</tr>'
        $('#table_notifications').find('tbody').append(s)
      }
      $('#table_notifications').find('tbody').append()
    })
    .catch(function (error) {
      console.log(error + 'No se hizo get')
    })
}

function activeChat () {
  axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + Cookies.get('mmail'))
    .then(function (response) {
      llenarTablaChat()
    })
    .catch(function (error) {
      console.log(error + 'No se hizo get en chats')
    })
}

function activeNotification () {
  axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + Cookies.get('mmail'))
    .then(function (response) {
      llenarTablaNotificacion()
    })
    .catch(function (error) {
      console.log(error + 'No se hizo get en chats')
    })
}

function getUser () {
  axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + Cookies.get('mmail'))
    .then(function (response) {      
      llenarTabla(response)
      llenarTablaFollowing()
      llenarTablaFollowers()
    })
    .catch(function (error) {
      console.log(error + 'No se hizo get')
    })
}

function getUserShop () {
  axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + Cookies.get('mmail'))
    .then(function (response) {
      llenarTabla2(response)
    })
    .catch(function (error) {
      console.log(error + 'No se hizo get')
    })
}

function devolverChat () {
  window.location.assign('Chat.html')
}

function archivosDoc (type) {
  axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/datos')
    .then(function (response) {
      var lista = response.data.usuarios
      $('#table_docs').find('tbody').empty()
      for (var i = 0; i < lista.length; i++) {
        axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + lista[i])
          .then(function (response) {
            var l = response.data.articulosAVender
            var author
            author = '<td>' + response.data.nombre + '</td>'
            for (var j = 0; j < l.length; j++) {
              axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/archivos?' + 'nombre=' + l[j])
                .then(function (response) {
                  var a = response.data
                  if (a.tipoArchivo == type) {
                    var s
                    var m
                    var pathS3 = a.path.split('\\')
                    var cambio = pathS3[2]
                    var ruta = 'https://s3.us-east-2.amazonaws.com/uploadshop/' + cambio
                    m = '<td> <center> <button id="' + a.nombre + '" type="button" class="btn btn-primary" onclick="addToCarrito(this);return false" >Add to cart</button> </center> </td>'
                    s = '<tr> ' + '<td>' + a.nombre + '</td>' + author + '<td>' + a.precio + '</td>' + m + '</tr>'
                    $('#table_docs').find('tbody').append(s)
                  }
                })
                .catch(function (error) {
                  console.log(error + 'No se trajo archivo')
                })
            }
            $('#table_docs').find('tbody').append()
          })
          .catch(function (error) {
            console.log(error + 'No se hizo get')
          })
      }
    })
    .catch(function (error) {
      console.log(error + 'No se hizo get en docs')
    })
}

function comprar () {
  var u = Cookies.get('mmail')
  axios.put('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/' + u + '/comprarCarrito')
    .then(function (response) {
      window.location.assign('purchases.html')
    })
    .catch(function (error) {
      console.log(error + ' No se logro hacer put')
    })
}
