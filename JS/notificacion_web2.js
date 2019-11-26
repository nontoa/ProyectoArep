var app2 = (function () {
  var cnt = 0
  class Notification {
    constructor (who, compose) {
      this.who = who
      this.compose = compose
    }
  }

  var stompClient = null
  var addNotification = function () {
    axios.get('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/usuarios?' + 'email=' + Cookies.get('mmail'))
      .then(function (response) {
        var lista = response.data.notificaciones        
        swal({ title: '¡Hey, New Follower!', icon: 'info', text:' Check your followers!', type: 'success' }).then(function(){          
          location.reload();
        })
      })
      .catch(function (error) {
        console.log(error + 'No se hizo get')
      })
  }


  var connectAndSubscribe = function (id) {
    console.info('Connecting to WS...')
    var socket = new SockJS('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/followers')    
    stompClient = Stomp.over(socket)
    var npoint    
    stompClient.connect({}, function (frame) {
      stompClient.subscribe('/topic/newNotification2.' + id, function (eventbody) {        
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
      app2.conection(myId + '$')
    },  
    
    init2: function (correo) {
      app2.conection(correo)
    },  

    publishNotify: function (correo) {
      let myId = correo
      var not = new Notification(Cookies.get('mmail'), 'Nuevo Seguidor')
      console.log('SE SUBSCRIBE A ' + myId)
      stompClient.send('/topic/newNotification2.' + myId +"$", {}, JSON.stringify(not))
    },

    disconnect: function () {
      if (stompClient !== null) {
        stompClient.disconnect()
      }
      console.log('Disconnected')
    }
  }
})()