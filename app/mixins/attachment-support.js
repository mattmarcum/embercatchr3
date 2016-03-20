import Ember from 'ember';
import DS from 'ember-data';
const { attr } = DS;

export default Ember.Mixin.create({
  attachments: attr('attachment'),

  retrieveAttachement(name) {
    let constructor = this.constructor;
    let adapter = this.store.adapterFor(constructor.modelName);

    return adapter.db.rel.getAttachment(adapter.getRecordTypeName(this.constructor), this.get('id'), name)
      .then(data => {
        this.get('attachments').findBy('name', name).setProperties({
          data,
          stub: false
        });
        return data;
      });
  },

  retrieveAttachments: Ember.on('didLoad', function() {
    let attachments = this.get('attachments');

    if (Ember.isNone(attachments)){ return; }

    attachments.forEach(attachment => {
      this.retrieveAttachement(attachment.name);
    });
  })
});
