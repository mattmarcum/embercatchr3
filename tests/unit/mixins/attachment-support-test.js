import Ember from 'ember';
import AttachmentSupportMixin from 'embercatchr3/mixins/attachment-support';
import { module, test } from 'qunit';

module('Unit | Mixin | attachment support');

// Replace this with your real tests.
test('it works', function(assert) {
  let AttachmentSupportObject = Ember.Object.extend(AttachmentSupportMixin);
  let subject = AttachmentSupportObject.create();
  assert.ok(subject);
});
