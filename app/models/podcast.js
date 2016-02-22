import Model from 'ember-pouch/model';
import DS from 'ember-data';
import Ember from 'ember';
const {
  attr,
  hasMany,
  belongsTo
} = DS;

export default Model.extend({
  feed: Ember.inject.service(),

  title: attr('string'),
  link: attr('string'),
  description: attr('string'),
  image: attr('string'),
  lastUpdated: attr('date'),

  pods: hasMany('pod'),

  update() {
    return window.fetch(`/api/feed?url=${this.get('link')}`)
      .then(response => response.json())
      .then(podcast => this.updateAttrs(podcast))
      .then(podcast => this.updatePods(podcast))
      .then(() => this.save());
  },

  updateAttrs(podcast) {
    this.setProperties({
      title: podcast.title,
      link: podcast.link,
      description: podcast.description,
      image: podcast.image,
      lastUpdated: new Date()
    });

    return podcast;
  },

  updatePods(podcast) {
    let promises = podcast.entries
      .filter(pod => this.hasPod(pod))
      .map(pod => this.addPod(pod));

    return Ember.RSVP.all(promises);
  },

  hasPod(pod) {
    if(! pod.enclosure || !pod.enclosure.url){ return true; }
    return this.get('pods').filterBy('enclosure.url', pod.enclosure.url);
  },

  addPod(pod) {
    let podRecord = this.store.createRecord('pod', pod);
    this.get('pods').pushObject(podRecord);
    return podRecord.save();
  }
});
