import Ember from 'ember';

export default Ember.Service.extend({
  currentPod: null,

  play(pod){
      this.set('currentPod', pod);
  }
});
