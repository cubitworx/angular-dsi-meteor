import { Injectable } from '@angular/core';
import { DsiApi, DsiDriver } from '@cubitworx/angular-dsi';
import { Mongo } from 'meteor/mongo';
import { MeteorObservable, MongoObservable } from 'meteor-rxjs';
import { NotificationsService } from 'angular2-notifications';
import { Observable, Subject } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

// Local
import { FindOptions, MeteorResource, PublicationOptions } from './client';
import { FindFromPublication } from './findFromPublication';

@Injectable()
export abstract class DsiMeteorDriver<D> implements DsiDriver<D> {

	public create(resource: MeteorResource, doc: D): Observable<string> {
		return MeteorObservable.call<string>('dsi.create.' + resource.collection._name, {doc: doc})
			.zone()
			.publishReplay()
			.refCount();
	}

	public delete(resource: MeteorResource, id: string): Observable<number> {
		return MeteorObservable.call<number>('dsi.delete.' + resource.collection._name, {id: id})
			.zone()
			.publishReplay()
			.refCount();
	}

	public read(resource: MeteorResource, request?: DsiApi.Request): Observable<DsiApi.Response> {
		let response,
			clientFindSelector: Mongo.Selector = request.filter || {},
			clientFindOptions: FindOptions = {},
			serverFindSelector: Mongo.Selector = request.filter || {},
			serverFindOptions: FindOptions = {
				limit: request.pagination.size,
				skip: (request.pagination.page - 1) * request.pagination.size
			},
			publicationOptions: PublicationOptions = { count: true, lookup: true };

		response = FindFromPublication.find(resource.publication, resource.collection, clientFindSelector, clientFindOptions)
			.map((data: D[]) => <DsiApi.Response>{data: data});

		MeteorObservable.subscribe(resource.publication, serverFindSelector, serverFindOptions, publicationOptions);

		return response
			.zone()
			.publishReplay()
			.refCount();
	}

	public readOne(resource: MeteorResource, request?: DsiApi.RequestOne): Observable<DsiApi.Response> {
		let response,
			clientFindSelector: Mongo.Selector = { _id: request.id },
			clientFindOptions: FindOptions = {},
			serverFindSelector: Mongo.Selector = { _id: request.id },
			serverFindOptions: FindOptions = {},
			publicationOptions: PublicationOptions = { lookup: true };

		response = resource.collection.find(clientFindSelector, clientFindOptions)
			.map((data: D[]) => {
				return data[0] || {};
			});

		MeteorObservable.subscribe(resource.publication, serverFindSelector, serverFindOptions, publicationOptions);

		return response
			.zone()
			.publishReplay()
			.refCount();
	}

	public update(resource: MeteorResource, id: string, doc: D): Observable<number> {
		return MeteorObservable.call<number>('dsi.update.' + resource.collection._name, {id: id, doc: doc})
			.zone()
			.publishReplay()
			.refCount();
	}

}
