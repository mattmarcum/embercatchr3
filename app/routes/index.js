import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('podcast').then(podcasts => {
      let promise = Ember.RSVP.resolve('application:model');

      if (!podcasts.get('length')) {
        let records = [
          { link: 'https://emberweekend.com/feed.xml'},
          { link: 'http://ember.land/?format=rss'},
          { link: 'https://simplecast.com/podcasts/1600/rss'},
          { link: 'https://simplecast.com/podcasts/96/rss'},
          { link: 'http://feeds.feedwrench.com/JavaScriptJabber.rss'}
        ];

        podcasts = records.map(record => this.get('store').createRecord('podcast', record));
        promise = promise
        .then(() => Ember.RSVP.all(podcasts.invoke('save')))
        .then(()=> this.controllerFor('application').get('getLatestPods').perform())
      }

      return promise
        .then(() => this.store.findAll('pod'));
    });
  },

  setupController() {
    this._super(...arguments);
    this.controllerFor('application').get('getLatestPods').perform();
  }
});
