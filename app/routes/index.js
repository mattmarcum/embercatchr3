import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service(),
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
        .then(() => Ember.RSVP.all(podcasts.invoke('save')));
      }

      return promise
        .then(() => this.store.findAll('pod'))
        .then(pods => pods.sortBy('publishedDate').reverse().slice(0, 20))

    });
  }
});
