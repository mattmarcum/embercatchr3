import Ember from 'ember';

const { get } = Ember;

export default Ember.Route.extend({
  actions: {
    transitionToPod(pod) {
      this.transitionTo('podcast.pod', get(pod, 'podcast'), pod)
    },
    transitionToPodcast(podcast) {
      this.transitionTo('podcast', podcast);
    }
  }
});
