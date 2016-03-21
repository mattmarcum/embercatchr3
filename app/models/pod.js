import Model from 'ember-pouch/model';
import DS from 'ember-data';
import Ember from 'ember';
import fetch from "ember-network/fetch";

const {
  attr,
  belongsTo
} = DS;
import AttachmentSupport from '../mixins/attachment-support';

export default Model.extend(AttachmentSupport, {
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
  isDownloaded: attr('boolean'),
  position: attr('number'),

  avatar: Ember.computed.alias('podcast.image'),

  shortDescription: Ember.computed('description', function() {
    return this.get('description').replace(/(<([^>]+)>)/ig,"");
  }),

  audioFile: Ember.computed.alias('attachments.firstObject.data'),
  audioUrl: Ember.computed('audioFile', function() {
    let audioFile = this.get('audioFile');

    if (audioFile) {
      return URL.createObjectURL(audioFile);
    }

    return this.get('enclosure.url');
  }),

  audioType: Ember.computed.alias('attachments.firstObject.content-type'),

  isDownloading: false,


  download() {
    if(this.get('audioFile')){
      return Ember.RSVP.resolve();
    }

    this.set('isDownloading', true);
    return fetch(`/api/audio?url=${this.get('enclosure.url')}`)
    .then( response => response.blob() )
    .then( file => {
      let attachments = this.get('attachments') || this.set('attachments', Ember.A());

      attachments.addObject(Ember.Object.create({
        name: this.get('enclosure.url'),
        content_type: file.type,
        data: file
      }));

      this.setProperties({
        isDownloading: false,
        isDownloaded: true
      });

      return this.save();
    })
    .catch( () =>{
      this.set('isDownloading', false);
    });
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
