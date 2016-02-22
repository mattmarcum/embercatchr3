import Ember from 'ember';

export default Ember.Component.extend({
  audioPlayer: Ember.inject.service(),

  classNames: [],
  currentPod: Ember.computed.alias('audioPlayer.currentPod'),

  title: Ember.computed('currentPod.title', function(){
    return this.get('currentPod.title') || 'No Podcast is Loaded';
  }),

  src: Ember.computed.alias('currentPod.audioUrl'),

  playOnChange: Ember.observer('currentPod', function(){
    let currentPod = this.get('currentPod');
    if(currentPod){
      Ember.run.next(this, function() {
        this.$('audio')[0].play();
      })
    }
  }),

  actions: {
    play() {
      this.$('audio')[0].play();
    },
    pause() {
      this.$('audio')[0].pause();
    }
  }
});
