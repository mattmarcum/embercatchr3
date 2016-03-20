import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Controller.extend({

  getLatestPods: task(function * (){
    yield this.store.findAll('podcast')
      .then(
        podcasts => Ember.RSVP.all(
          podcasts.map(
            podcast => podcast.update()
          )
        )
      );
  })
});
