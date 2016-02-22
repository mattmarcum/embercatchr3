import Ember from 'ember';

export default Ember.Component.extend({
  audioPlayer: Ember.inject.service(),

  classNames: ['pod-card'],

  actions: {
    downloadAudio(pod) {
      pod.download();
    },
    deleteAudio(pod) {
      pod.deleteAudio();
    },
    playPod(pod) {
      pod.download().then(()=>{
        this.get('audioPlayer').play(pod);
      });
    }
  }
});
