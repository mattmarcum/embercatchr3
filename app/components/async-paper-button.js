import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  animating: Ember.computed.alias('actionTask.isRunning'),

  actionTask: task(function * () {
    yield this.get('task').perform();
  }).drop(),

  click() {
    this.get('actionTask').perform();
  }
});
