import Model from 'ember-pouch/model';
import DS from 'ember-data';
import Ember from 'ember';
import fetch from "ember-network/fetch";

const {
  attr,
  hasMany,
  belongsTo
} = DS;

export default Model.extend({

  title: attr('string'),
  link: attr('string'),
  description: attr('string'),
  image: attr('string'),
  lastUpdated: attr('date'),

  pods: hasMany('pod'),

  update() {
    return fetch(`/api/feed?url=${this.get('link')}`)
      .then(response => response.json())
      .then(podcast => this._updateAttrs(podcast))
      .then(podcast => this._updatePods(podcast))
      .then(() => this.save());
  },

  _updateAttrs(podcast) {
    this.setProperties({
      title: podcast.title,
      link: podcast.link,
      description: podcast.description,
      image: podcast.image,
      lastUpdated: new Date()
    });

    return podcast;
  },

  _updatePods(podcast) {
    let promises = podcast.entries
      .filter(pod => this._filterPod(pod))
      .map(pod => this._addPod(pod));

    return Ember.RSVP.all(promises);
  },

  _filterPod(pod) {
    if( typeof pod !== 'object' ||
      ! pod.enclosure ||
      ! pod.enclosure.url ||
      ! pod.publishedDate ||
      ! pod.title
    ){
      return false;
    }
    return !this.get('pods').filterBy('enclosure.url', pod.enclosure.url).length;
  },

  _addPod(pod) {
    pod.publishedDate = new Date(pod.publishedDate);
    let podRecord = this.store.createRecord('pod', pod);
    this.get('pods').pushObject(podRecord);
    return podRecord.save();
  }
});
