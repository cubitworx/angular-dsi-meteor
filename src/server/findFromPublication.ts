import { Meteor } from 'meteor/meteor';
import * as _ from 'lodash';

if( !Meteor.isServer )
	throw new Meteor.Error('Meteor server only code being called from client');

export module FindFromPublication {

	export function publish(name: string, func: Function): void {

		if( !Meteor.isServer )
			throw new Meteor.Error('FindFromPublication.publish() can only be called from the server');

		Meteor.publish(name, function(...args: any[]) {
			let
				publishAs: string = args[3] ? ( args[3]['name'] ? args[3]['name'] : null ) : null,
				oldAdded: (collection: string, id: string, fields: Object) => void = _.bind(this.added, this),
				oldRemoved: (collection: string, id: string) => any = _.bind(this.removed, this);

			this.added = function(collection: string, id: string, fields: Object): void {
				oldAdded(publishAs || collection, id, fields);
			};

			this.removed = function(collection: string, id: string): any {
				oldRemoved( publishAs || collection, id );
			};

			return func.apply(this, arguments);
		});

	};

}
