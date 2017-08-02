import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { MongoObservable, ObservableCursor } from 'meteor-rxjs';

// Local
import { FindOptions } from './client';

if (!Meteor.isClient)
	throw new Meteor.Error('Meteor client only code being called from server');

export module FindFromPublication {

	export function find<D>(name: string, collection: MongoObservable.Collection<D>, selector: Mongo.Selector, options: FindOptions): ObservableCursor<D> {
		return collection.find(selector, options);
	}

}
