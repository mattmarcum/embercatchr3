import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  hasMany,
  belongsTo
} = DS;

export default Model.extend({
  pod: belongsTo('pod'),
  position: attr('number'),
  date: attr('date')
});
