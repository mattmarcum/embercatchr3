import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  hasMany,
  belongsTo
} = DS;

export default Model.extend({
  podcast: belongsTo('podcast'),
  
  link: attr('string'),
  title: attr('string'),
  description: attr('string'),
  publishedDate: attr('date'),
  author: attr('string'),
  content: attr('string'),
  enclosure: attr(),
  image: attr('string'),

  hasListened: attr('boolean'),
  position: attr('number'),
  audioFile: attr('attachement'),

  download() {
    window.fetch(`/api/audio?url=${this.get('enclosure.url')}`)
    .then( response => response.blob() )
    .then( file => {
      let audioFile = this.get('audioFile') || this.set('audioFile', Ember.A());

      audioFile.addObject(Ember.Object.create({
        'name': this.get('enclosure.url'),
        'content-type': file.type,
        'data': file
      }))

      return this.save();
    })
  }
});
