

const video = document.getElementById('video'); 

function startCamera() {
  navigator.getUserMedia = ( //Esta variable buscará obtener acceso a la cámara, dependiendo del navegador
    navigator.getUserMedia || 
    navigator.webkitGetUserMedia ||
    navigator.mozGetUser ||
    navigator.msGetUser);

    navigator.getUserMedia({video:{}}, 
      stream => video.srcObject = stream,
      err => console.log(err)

      )
    
}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'), //Librería para detección de rostros pequeños
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'), //Librería para seguimiento de ojos, nariz y boca
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'), //Librería para reconocimiento facial
  faceapi.nets.faceExpressionNet.loadFromUri('/models') //Librería para reconocimiento facial
  ]).then(startCamera); //Inicializa la función de la cámara, basado en las promesas de la API de reconocimiento facial

video.addEventListener('play', ()=> { //Creación del canvas

  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = {width:video.width, height:video.height};
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async()=> { //Intervalo de tiempo para la detección

    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks() //Esta variable guarda las detecciones en un array
    const resizedDetections = faceapi.resizeResults(detections, displaySize); //Redimensiona el tamaño del canvas
    canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height) //Filtra los canvas residuales
    faceapi.draw.drawDetections(canvas, resizedDetections) //Dibuja los canvas (cuadrados) en pantalla
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections) //Dibuja los canvas (puntos faciales) en pantalla
    console.log(detections); //Muestra en la consola las detecciones en tiempo real

  },500
  )
})