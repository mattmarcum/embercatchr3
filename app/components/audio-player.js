import Ember from 'ember';

export default Ember.Component.extend({
  audioPlayer: Ember.inject.service(),

  classNames: [],
  currentPod: Ember.computed.alias('audioPlayer.currentPod'),

  title: Ember.computed('currentPod.title', function(){
    return this.get('currentPod.title') || 'No Podcast is Loaded';
  }),

  actions: {
    play() {
      this.get('audioPlayer').play();
    },
    pause() {
      this.get('audioPlayer').pause();
    }
  }
});
