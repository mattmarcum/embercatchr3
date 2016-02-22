import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  model() {
    return this.store.findAll('podcast');
  },
  afterModel(podcasts) {
    if(!podcasts.get('length')){
      let records = [
        { link: 'https://emberweekend.com/feed.xml'},
        { link: 'http://ember.land/?format=rss'},
        { link: 'https://simplecast.com/podcasts/1600/rss'},
        { link: 'https://simplecast.com/podcasts/96/rss'},
        { link: 'http://feeds.feedwrench.com/JavaScriptJabber.rss'}
      ];

      podcasts = records.map(record => this.get('store').createRecord('podcast', record));
      podcasts.invoke('update');
    }
    return podcasts
  }
});
