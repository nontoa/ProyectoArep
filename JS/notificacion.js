var app = (function () {
  var is_DRAW = false
  class Point {
    constructor (x, y) {
      this.x = x
      this.y = y
    }
  }

  var stompClient = null

  var addPointToCanvas = function (point) {
    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI)
    ctx.stroke()
  }

  var addPolygonToCanvas = function (lista) {
    var c2 = canvas.getContext('2d')
    c2.fillStyle = '#FF4136'
    c2.beginPath()
    c2.moveTo(lista[0].x, lista[0].y)
    for (var i = 1; i < lista.length; i++) {
      c2.lineTo(lista[i].x, lista[i].y)
    }
    c2.closePath()
    c2.fill()
  }

  var getMousePosition = function (evt) {
    canvas = document.getElementById('canvas')
    var rect = canvas.getBoundingClientRect()
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
  }
  var connectAndSubscribe = function (id) {
    console.info('Connecting to WS...')
    var socket = new SockJS('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/stompendpoint')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, function (frame) {
      stompClient.subscribe('/topic/newpoint.' + id, function (eventbody) {
        var npoint = JSON.parse(eventbody.body)        
        addPointToCanvas(npoint)
      })
      stompClient.subscribe('/topic/newpolygon.' + id, function (eventbody) {
        var nlista = JSON.parse(eventbody.body)        
        for (var i = 0; i < nlista.length; i++) {
          for (var j = i + 1; j < nlista.length - 1; j++) {
            if (nlista[j].x > nlista[j + 1].x) {
              temp = nlista[j]
              nlista[j] = nlista[j + 1]
              nlista[j + 1] = temp
            }
          }
        }
        addPolygonToCanvas(nlista)
        // }

      })
    })
  }

  return {
    init: function () {
      var can = document.getElementById('canvas')
      app.disconnect()
      id = $('#numero').val()
      connectAndSubscribe(id)
      can.addEventListener('click', function (evt) {
        var coord = getMousePosition(evt)
        let px = coord.x
        let py = coord.y
        var point = new Point(px, py)

        app.publishPoint(px, py, id)
      })

    },

    publishPoint: function (px, py, id) {
      var pt = new Point(px, py)
      stompClient.send('/app/newpoint.' + id, {}, JSON.stringify(pt))
      stompClient.send('/topic/newpoint.' + id, {}, JSON.stringify(pt))
    },

    disconnect: function () {
      if (stompClient !== null) {
        stompClient.disconnect()
      }
      console.log('Disconnected')
    }
  }
})()
