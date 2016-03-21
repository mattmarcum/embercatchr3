import Model from 'ember-pouch/model';
import DS from 'ember-data';
import Ember from 'ember';
import fetch from "ember-network/fetch";
import { task, all, timeout } from 'ember-concurrency';

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

  audioFile: task(function * (){
    let attachment = this.get('attachments.firstObject');

    if(!attachment){
      yield this.get('download').perform();
    } else if (attachment.stub){
      yield this.retrieveAttachments();
    }

    return this.get('attachments.firstObject.data');
  }),

  audioUrl: task(function * () {
    let audioFile = yield this.get('download').perform();
    return URL.createObjectURL(audioFile);
  }),

  audioType: Ember.computed.alias('attachments.firstObject.content-type'),

  isDownloading: Ember.computed.alias('download.isRunning'),

  downloadPercentage: 0,
  downloadMode: 'determinate',

  download: task(function * (){
    if(this.get('isDownloaded')){
      let audioFile = yield this.get('audioFile').perform();
      return audioFile;
    }

    /**
    *We will use window.fetch in the browser to try and get the latest features
    **/
    let fetch = fetch;
    if(window && fetch in window){
      fetch = window.fetch;
    }

    let response = yield fetch(`/api/audio?url=${this.get('enclosure.url')}`);
    let progressResponse = response.clone();
    let responses = yield all([
      response.blob(),
      this.get('updateDownloadPercentage').perform(progressResponse)
    ]);

    let file = responses[0];
    let attachments = this.get('attachments') || this.set('attachments', Ember.A());

    attachments.addObject(Ember.Object.create({
      name: this.get('enclosure.url'),
      content_type: file.type,
      data: file
    }))

    this.set('isDownloaded', true);
    yield this.save();
    return this.get('audioFile').perform();
  }).drop(),

  updateDownloadPercentage: task(function * (response) {
    try {
      let reader = response.body.getReader();
      if(reader) {
        let headers = response.headers;
        let contentLength = parseInt(headers.get('content-length'));
        let currentPos = 0;

        let result = yield reader.read();
        while(!result.done){
          currentPos += result.value.length;
          this.set('downloadPercentage', Math.ceil((currentPos / contentLength)*100) );
          result = yield reader.read();
        }
      }
    } catch(e) {
      console.log('err:',e);
      this.set('downloadMode', 'indeterminate');
    }
  }),

  deleteAudio() {
    this.setProperties({
      attachments: Ember.A(),
      isDownloaded: false,
    });
    this.save();
  }

});
