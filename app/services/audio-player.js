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
