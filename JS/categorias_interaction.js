function addFileVideo () {
  axios.post('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/archivo', {
    nombre: nombreIV,
    precio: precioIV,
    tipoArchivo: tipoArchivoIV,
    descripcion: DescripcionIV
  })
    .then(function (response) {
      console.log(response + 'Se hizo post y se añadio el archivo')
    })
    .catch(function (error) {
      console.log(error + 'No se logro hacer post')
    })
}

function addFileDocument () {
  axios.post('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/archivo', {
    nombre: nombreIV,
    precio: precioIV,
    tipoArchivo: tipoArchivoIV,
    descripcion: DescripcionIV
  })
    .then(function (response) {
      console.log(response + 'Se hizo post y se añadio el archivo')
    })
    .catch(function (error) {
      console.log(error + 'No se logro hacer post')
    })
}

function addFileMusic () {
  axios.post('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/archivo', {
    nombre: nombreIV,
    precio: precioIV,
    tipoArchivo: tipoArchivoIV,
    descripcion: DescripcionIV
  })
    .then(function (response) {
      console.log(response + 'Se hizo post y se añadio el archivo')
    })
    .catch(function (error) {
      console.log(error + 'No se logro hacer post')
    })
}

function addFileBook () {
  axios.post('http://ec2-18-222-218-46.us-east-2.compute.amazonaws.com:81/dynamoDb/archivo', {
    nombre: nombreIV,
    precio: precioIV,
    tipoArchivo: tipoArchivoIV,
    descripcion: DescripcionIV
  })
    .then(function (response) {
      console.log(response + 'Se hizo post y se añadio el archivo')
    })
    .catch(function (error) {
      console.log(error + 'No se logro hacer post')
    })
}
