import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    getLatestPods() {
      return this.store.findAll('podcast')
        .then(
          podcasts => Ember.RSVP.all(
            podcasts.map(
              podcast => podcast.update()
            )
          )
        );
    }
  }
});
