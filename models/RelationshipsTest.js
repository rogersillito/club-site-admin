var _ = require('underscore');
var keystone = require('keystone');
var Types = keystone.Field.Types;
	  // countries = require('countries').countries;

var countries = [{
	name: 'Australia',
	cities: ['Melbourne', 'Sydney', 'Canberra']
}, {
	name: 'España',
	cities: ['Madrid', 'Barcelona', 'Sevilla']
}, {
	name: 'Italia',
	cities: ['Roma', 'Venecia', 'Turin']
}];


new keystone.List('City').add({
  name: String,
  country: { type: Types.Select, options: _.pluck(countries, 'name') }
}).register();

new keystone.List('Person').add({
  name: String,
  country: { type: Types.Select, options: _.pluck(countries, 'name') },
  city: { type: Types.Relationship, ref: 'City', filters: { country: ':country' } }
}).register();
