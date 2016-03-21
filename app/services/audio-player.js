import Ember from 'ember';

export default Ember.Service.extend({
  currentPod: null,

  audioEl: null,

  createAudioElement: Ember.on('init', function(){
    let audioEl = document.createElement('audio');
    audioEl.id = 'audio-player';
    this.set('audioEl', audioEl);
    document.body.appendChild(audioEl);
  }),

  src: Ember.computed.alias('currentPod.audioUrl'),

  loadAndPlay(pod){
    this.set('currentPod', pod);
    pod.get('audioUrl')
      .perform()
      .then(url => {
        let audioEl = this.get('audioEl');
        audioEl.src = url;
        audioEl.play();
      });
  },

  play(pod){
    this.get('audioEl').play();
  },
  pause() {
    this.get('audioEl').pause();
  }
});


// import Ember from 'ember';
//
// export default Ember.Service.extend({
//   currentPod: null,
//
//   audioEl: null,
//
//   mediaSource: null,
//   sourceBuffer: null,
//   chunkBuffer: null,
//
//   createAudioElement: Ember.on('init', function(){
//     let audioEl = document.createElement('audio');
//     audioEl.id = 'audio-player';
//     this.set('audioEl', audioEl);
//     document.body.appendChild(audioEl);
//   }),
//
//   src: Ember.computed.alias('currentPod.audioUrl'),
//
//   loadAndPlay(pod){
//     this.set('currentPod', pod);
//     let mediaSource = new MediaSource();
//     this.set('mediaSource', mediaSource);
//     this.set('sourceBuffer', null);
//     let url = URL.createObjectURL(mediaSource);
//     this.get('audioEl').src = url;
//
//     mediaSource.addEventListener('sourceopen', ()=>{
//       pod.get('audioUrl').perform(Ember.run.bind(this,this.playOrEnqueue))
//     });
//
//     mediaSource.addEventListener('addsourcebuffer', ()=>{
//       this.play();
//     });
//
//   },
//
//   playOrEnqueue(chunk, mimeType) {
//     let sourceBuffer = this.get('sourceBuffer');
//     let chunkBuffer = this.get('chunkBuffer');
//     if(!sourceBuffer) {
//       sourceBuffer = this.get('mediaSource').addSourceBuffer(mimeType);
//       this.set('sourceBuffer', sourceBuffer);
//       this.set('chunkBuffer', Ember.A());
//       sourceBuffer.addEventListener('updateend', ()=>{
//         let chunkBuffer = this.get('chunkBuffer');
//         if(chunkBuffer.length) {
//           try {
//             sourceBuffer.appendBuffer(chunkBuffer.shift());
//           } catch(e) {
//
//           }
//         }
//       });
//       sourceBuffer.appendBuffer(chunk);
//     } else {
//       chunkBuffer.push(chunk);
//     }
//
//     console.log('got chunk', chunk.length);
//   },
//
//   play(pod){
//     this.get('audioEl').play();
//   },
//   pause() {
//     this.get('audioEl').pause();
//   }
// });
