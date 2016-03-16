fetch("http://localhost:4200/api/audio?url=https://audio.simplecast.com/28620.mp3").then(
  response=>{
    console.log('total length:',response.headers.get('Content-Length'));
    var reader = response.body.getReader();
    console.log('length:',0);
    return pump(reader);
  })
  .catch(
  err=>{console.log(err)});

function  pump(reader){
  return reader.read().then(result => {
    if(result.done){
      console.log('done');
      return;
    }
    console.log('length:',result.value.byteLength);
    return pump(reader);
  })
}

https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioDestinationNode



var audio = a=new Audio();
audio.src="http://localhost:4200/api/audio?url=https://audio.simplecast.com/28620.mp3";

var chunks = [];
var ac = new AudioContext();
var source = ac.createMediaElementSource(audio)
var dest = ac.createMediaStreamDestination();
var mediaRecorder = new MediaRecorder(dest.stream);
source.connect(dest);
dest.connect(ac.destination);

mediaRecorder.ondataavailable = function(evt) {
  // push each chunk (blobs) in an array
  chunks.push(evt.data);
};

mediaRecorder.onstop = function(evt) {
  // Make blob out of our blobs, and open it.
  var blob = new Blob(chunks);
  console.log('blobl url:',URL.createObjectURL(blob));
};

mediaRecorder.start();
