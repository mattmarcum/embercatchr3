import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Controller.extend({
  getLatestPods: task(function * (){
    let podcasts = yield this.store.findAll('podcast')
    let updates = yield Ember.RSVP.all(podcasts.map( podcast => podcast.update() ));

    return updates;
  })
});
