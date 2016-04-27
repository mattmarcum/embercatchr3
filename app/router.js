import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('podcast', { path: '/podcasts/:podcast_id' }, function() {
    this.route('pod', { path: '/pods/:pod_id' });
  });
});

export default Router;
