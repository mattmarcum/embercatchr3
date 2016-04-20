fetch('http://localhost:4200/api/audio?url=https://audio.simplecast.com/28620.mp3').then(response => {
  var reader=response.body.getReader();
  var headers = response.headers;
  var contentLength = headers.get('content-length');
  var contentType = headers.get('content-type');
  var arrayBuffers = [];
  console.log('Length:', contentLength, 'Type:', contentType);
  var pump = function(reader){
    return reader.read().then(result => {
      if(result.done){
        console.log('done');
        return arrayBuffers;
      }
      var buffer = new Uint8Array(result.value.length);
      buffer.set(result.value);
      arrayBuffers.push(buffer);
      return pump(reader);
    });
  }
  return pump(reader);
}).then(arrayBuffers => {
  var length = arrayBuffers.reduce((prev,curr)=>{return prev += curr.length}, 0);
  var finalBuffer = new Uint8Array(length);
  var position = 0;
  arrayBuffers.forEach(entry=>{
    final.set(entry, position);
    position += entry.length;
  });
  var audioContext = new AudioContext();
  audioContext.decodeAudioData(final.buffer, function(audioBuffer){
    console.log(audioBuffer);
  });
});

/**
Goal - grab an mp3 frame - pass it to web audio decoder

grab xK of data over multiple reads

if not id3Decoded
  try/catch id3 decode

try/catch mp3FrameHeader decode
**/
var greader;
fetch('http://localhost:4200/api/audio?url=https://audio.simplecast.com/28620.mp3').then(response => {
  var reader=greader=response.body.getReader();
  var headers = response.headers;
  var contentLength = headers.get('content-length');
  var contentType = headers.get('content-type');
  var arrayBuffers = [];
  var bufferSize = 32*1024;
  var currentBuffer = new Uint8Array(bufferSize);
  var currentPos = 0;
  var remainder;

  console.log('Length:', contentLength, 'Type:', contentType);

  var pump = function(reader){
    return reader.read().then(result => {
      var resultLength = result.value.length;
      var bufferCapacity = bufferSize - currentPos;

      if(result.done){
        if(currentPos){
          //we had left over data
          ArrayBuffers.push(currentBuffer);
        }
        console.log('done');
        return arrayBuffers;
      }
      if(bufferCapacity < resultLength) {
        currentBuffer.set(result.value.slice(0, bufferCapacity));
        remainder = result.value.slice(bufferCapacity);
        arrayBuffers.push(currentBuffer);
        var dv = new DataView(currentBuffer.buffer, 0);
        debugger;
        currentBuffer = new Uint8Array(bufferSize);
      } else {
        if(remainder instanceof Uint8Array){
          currentBuffer.set(remainder, currentPos);
          delete remainder;
        }
        currentBuffer.set(result.value, currentPos);
        currentPos += resultLength;
      }
      return pump(reader);
    });
  }
  return pump(reader);
})

/**
Same thing but this time with one buffer, we slice off and send frames to decode audio
**/
var greader;
fetch('http://localhost:4200/api/audio?url=https://audio.simplecast.com/28620.mp3').then(response => {
  var reader=greader=response.body.getReader();
  var headers = response.headers;
  var contentLength = headers.get('content-length');
  var contentType = headers.get('content-type');
  var streamBuffer = new Uint8Array(contentLength);
  var currentPos = 0;
  var frameStart = 0;
  var frameEnd = 0;
  var i=0;

  console.log('Length:', contentLength, 'Type:', contentType);

  var pump = function(reader){
    return reader.read().then(result => {
      var resultLength;
      var bufferLength = 1024*1024;
      var dv;
      var frameInfo;
      var audioBuffer;

      if(result.done){
        console.log('done', streamBuffer);
        return streamBuffer;
      }
      resultLength = result.value.length;

      streamBuffer.set(result.value, currentPos);

      if((currentPos - frameStart) > bufferLength ){
        dv = new DataView(streamBuffer.slice(frameStart).buffer, 0);
        try {
          frameInfo = mp3Parser.readLastFrame(dv);
          if(frameInfo && frameInfo._section && frameInfo._section.nextFrameIndex){
            frameEnd = frameInfo._section.nextFrameIndex;
            audioBuffer = streamBuffer.slice(frameStart, frameEnd);
            console.log('created audio buffer', ++i);
            frameStart = frameEnd;
          }
        } catch(e) {}
      }
      currentPos += resultLength;

      return pump(reader);
    });
  }
  return pump(reader);
})


/**
Next - take one of these buffers and play it, then try swapping buffers.
Next - load the mp3 detection code into a webwork*/

var greader;
fetch('http://localhost:4200/api/audio?url=http://cast.rocks/hosting/4148/emberland-20.mp3').then(response => {
  var reader=greader=response.body.getReader();
  var headers = response.headers;
  var contentLength = headers.get('content-length');
  var contentType = headers.get('content-type');
  var streamBuffer = new Uint8Array(contentLength);
  var currentPos = 0;
  var frameStart = 0;
  var frameEnd = 0;
  var i=0;

  console.log('Length:', contentLength, 'Type:', contentType);

  var pump = function(reader){
    return reader.read().then(result => {
      var resultLength;
      var bufferLength = 1024*1024;
      var dv;
      var audioBuffer;

      if(result.done){
        console.log('done', streamBuffer);
        return streamBuffer;
      }
      resultLength = result.value.length;

      streamBuffer.set(result.value, currentPos);

      if((currentPos - frameStart) > bufferLength ){

        var offset = streamBuffer.lastIndexOf(255)

        if(streamBuffer[offset+1] >= 250) {
          frameEnd = offset;
          audioBuffer = streamBuffer.slice(frameStart, frameEnd);
          console.log('created audio buffer', ++i, frameStart, frameEnd);
          frameStart = frameEnd;
        }
      }
      currentPos += resultLength;

      return pump(reader);
    });
  }
  return pump(reader);
})
