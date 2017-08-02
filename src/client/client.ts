import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { MongoObservable } from 'meteor-rxjs';
import * as _ from 'lodash';

export interface FindOptions {
	sort?: Mongo.SortSpecifier;
	skip?: number;
	limit?: number;
	fields?: Mongo.FieldSpecifier;
	reactive?: boolean;
	transform?: Function;
}

interface MongoCollection extends MongoObservable.Collection<any> {
	_name: string
}

export interface MeteorResource {
	collection: MongoCollection;
	publication: string;
}

export interface PublicationOptions {
	count?: boolean;
	lookup?: boolean;
	publishAs?: string;
}
