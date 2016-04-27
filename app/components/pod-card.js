import Ember from 'ember';

let podCard = Ember.Component.extend({
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

podCard.reopenClass({
  positionalParams: ['pod', 'description']
});


export default podCard;
