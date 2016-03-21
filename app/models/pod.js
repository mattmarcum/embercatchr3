import Model from 'ember-pouch/model';
import DS from 'ember-data';
import Ember from 'ember';
import fetch from "ember-network/fetch";
import { task, all, timeout } from 'ember-concurrency';

const {
  attr,
  hasMany,
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

  download: task(function * (onChunkCallBack){
    if(this.get('isDownloaded')){
      let audioFile = yield this.get('audioFile').perform();
      return audioFile;
    }

    /**
    *We will use window.fetch in the browser to get the latests features
    **/
    let fetch = fetch;
    if(window && fetch in window){
      fetch = window.fetch;
    }

    let response = yield fetch(`/api/audio?url=${this.get('enclosure.url')}`);
    let progressResponse = response.clone();
    let responses = yield all([
      response.blob(),
      this.get('updateDownloadPercentage').perform(progressResponse, onChunkCallBack)
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

  updateDownloadPercentage: task(function * (response, onChunkCallBack) {

    try {
      let reader = response.body.getReader();
      if(reader) {
        let headers = response.headers;
        let contentLength = parseInt(headers.get('content-length'));
        let contentType = headers.get('content-type');
        let streamBuffer = new Uint8Array(contentLength);
        let currentPos = 0;
        // let bufferLength = 1024*1024;
        // let frameStart = 0;
        // let frameEnd;

        let result = yield reader.read();
        while(!result.done){
          streamBuffer.set(result.value, currentPos);
          currentPos += result.value.length;
          this.set('downloadPercentage', Math.ceil((currentPos / contentLength)*100) );

          // if(currentPos - frameStart > bufferLength){
          //   let offset = streamBuffer.lastIndexOf(255);
          //   if(streamBuffer[offset+1] >= 250) {
          //     frameEnd = offset - 1;
          //     onChunkCallBack(streamBuffer.slice(frameStart, frameEnd), contentType);
          //     frameStart = offset;
          //   }
          // }

          result = yield reader.read();
        }
      }
    } catch(e) {
      console.log('err:',e);
      let percent = 0;
      while(true) {
          //fake it till you make it
          this.set('downloadPercentage', Math.ceil(percent += 10) );

          yield timeout(500);

          if(percent === 100){
            return;
          }
      }
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
