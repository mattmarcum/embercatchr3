import Ember from 'ember';

export default Ember.Controller.extend({
  sortedPods: Ember.computed('model.[]', function(){
    return this.get('model').sortBy('publishedDate').reverse().slice(0, 20);
  })
});
