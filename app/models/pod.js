import Model from 'ember-pouch/model';
import DS from 'ember-data';
import Ember from 'ember';
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

  avatar: Ember.computed('image', 'podcast.image', function() {
    return this.get('image') || this.get('podcast.image');
  }),

  shortDescription: Ember.computed('description', function() {
    return this.get('description').replace(/(<([^>]+)>)/ig,"");
  }),

  hasListened: attr('boolean'),
  isDownloaded: attr('boolean'),
  position: attr('number'),
  attachments: attr('attachment'),

  audioFile: Ember.computed.alias('attachments.firstObject.data'),
  audioUrl: Ember.computed('audioFile', function() {
    let audioFile = this.get('audioFile');
    if(audioFile){
      return URL.createObjectURL(audioFile);
    }
    return false;
  }),

  audioType: Ember.computed.alias('attachments.firstObject.content-type'),

  isDownloading: false,


  download() {
    if(this.get('audioFile')){
      return Ember.RSVP.resolve();
    }

    this.set('isDownloading', true);
    return window.fetch(`/api/audio?url=${this.get('enclosure.url')}`)
    .then( response => response.blob() )
    .then( file => {
      let attachements = this.get('attachments') || this.set('attachments', Ember.A());

      attachements.addObject(Ember.Object.create({
        'name': this.get('enclosure.url'),
        'content-type': file.type,
        'data': file
      }))

      this.set('isDownloading', false)
      this.set('isDownloaded', true);
      return this.save();
    })
    .catch( () =>{
      this.set('isDownloading', false)
    })
  },
  deleteAudio() {
    if(!this.get('audioFile')){
      return;
    }
    this.setProperties({
      attachments: Ember.A(),
      isDownloaded: false,
    });
    this.save();
  }
});
