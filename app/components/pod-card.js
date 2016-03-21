import Ember from 'ember';

export default Ember.Component.extend({
  audioPlayer: Ember.inject.service(),

  classNames: ['pod-card'],

  actions: {
    deleteAudio(pod) {
      pod.deleteAudio();
    },
    playPod(pod) {
      this.get('audioPlayer').loadAndPlay(pod);
    }
  }
});
