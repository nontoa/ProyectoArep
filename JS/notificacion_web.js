var app = (function () {
    var cnt = 0
    class Notification {
      constructor (who, compose) {
        this.who = who
        this.compose = compose
      }
    }
  
    var stompClient = null
    var addNotification = function (not) {
      axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + Cookies.get('mmail'))
        .then(function (response) {
          var lista = response.data.notificaciones
          var namec = lista[lista.length - 1].de
          swal({ title: '¡Wow New File!', icon: 'info',          
            buttons: {
              catch: {
                text: 'Go now!',
                value: 'catch'
              },
              success : {
                text: 'Ok',
                value: 'catch3'
              }
            },
          text: namec + ' uploaded a new file!', type: 'success' }).then((value) => {          
            switch (value) {
              case 'catch':              
                goNow(namec)
                break
            }
          })
        })
        .catch(function (error) {
          console.log(error + 'No se hizo get')
        })
    }
  
    function goNow(namec){
      window.location.assign('PerfilUser.html')
      axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + namec)
      .then(function (response) {
        $('#NameU').find('b').empty()
        $('#NameU').find('b').append(response.data.nombre + "'s Profile")
        $('#NameU').find('b').append()
        llenarTablaPerfil(response)
      })
      .catch(function (error) {
        console.log(error + 'No existe el usuario con ese email')
      })
    }
  
    var connectAndSubscribe = function (id) {
      console.info('Connecting to WS...')
      var socket = new SockJS('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/stompendpoint')
      stompClient = Stomp.over(socket)
      var npoint
      stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame)
        stompClient.subscribe('/topic/newNotification.' + id, function (eventbody) {
          npoint = JSON.parse(eventbody.body)
          addNotification(npoint)
        })
      })
    }
  
    return {
      conection: function (id) {
        connectAndSubscribe(id)
      },
      init: function () {
        let myId = Cookies.get('mmail')
        app.conection(myId + '$')
        app.conectionAll()
      },
      conectionAll: function () {
        axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + Cookies.get('mmail'))          
          .then(function (response) {
            var lista = response.data.following
            for (var i = 0; i < lista.length; i++) {
              axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + lista[i])
                .then(function (response2) {
                  user = response2.data
                  var s = user.email
                  console.log('Se conecto CON---------------' + s)
                  app.conection(s)
                })
            }
          })
          .catch(function (error) {
            console.log(error + 'No se hizo get')
          })
      },
  
      publishNotify: function () {
        let myId = Cookies.get('mmail')
        var not = new Notification(Cookies.get('mmail'), 'Nuevo Archivo Creado')
        console.log('SE SUBSCRIBE A ' + myId)
        stompClient.send('/topic/newNotification.' + myId, {}, JSON.stringify(not))
      },
  
      disconnect: function () {
        if (stompClient !== null) {
          stompClient.disconnect()
        }
        console.log('Disconnected')
      }
    }
  })()