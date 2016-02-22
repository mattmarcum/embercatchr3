import Ember from 'ember';

export default Ember.Component.extend({
  audioPlayer: Ember.inject.service(),

  classNames: ['pod-card'],

  actions: {
    downloadPod(pod) {
      pod.download();
    },
    playPod(pod) {
      pod.download().then(()=>{
        this.get('audioPlayer').play(pod);
      });
    }
  }
});
