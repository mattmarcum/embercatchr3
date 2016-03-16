import Ember from 'ember';

export default Ember.Component.extend({
  animating: false,
  click() {
    this.set('animating', true);
    this.attrs.action().then(()=>this.set('animating', false));
  }
});
