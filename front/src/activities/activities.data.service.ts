import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ActivitiesService } from './activities.service';

@Injectable()
export class ActivitiesDataService {
	private data = {
		general: [],
		splits: {},
		segments: [],
	};

	private state = {
		isInited: false,
		isLoading: false,
	};

	init (): Observable<object> {
		this.state.isLoading = true;

		return this.activitiesService.getAllData()
			.pipe(
				map((response: object) => {
					this.state.isInited = true;
					this.state.isLoading = false;
					this.data.general = response['data'];

					return response;
				}),
				catchError((error) => {
					alert(error.error);
					this.state.isLoading = false;

					return throwError('Something gone wrong again.');
				})
			);
	}

	getData (path: string): any {
		let res = this.data;

		const keys = path.split('.');

		for (let i = 0, length = keys.length; i < length; i++) {
			const key = keys[i];

			res = res[key];

			if (typeof res === 'undefined') {
				break;
			}
		}

		return res;
	}

	getState (key?: string): object {
		return key ? this.state[key] : this.state;
	}

	getSplits (id: string): Observable<object> {
		this.state.isLoading = true;

		return this.activitiesService
			.getSplits(id)
			.pipe(
				map((response: object) => {
					this.state.isLoading = false;
					this.data.splits = response;

					return response;
				}),
				catchError((error) => {
					alert(error.error);
					this.state.isLoading = false;

					return throwError('Something gone wrong again.');
				})
			);
	}

	getSegments (id: string): Observable<object> {
		this.state.isLoading = true;

		return this.activitiesService
			.getSegments(id)
			.pipe(
				map((response: object) => {
					this.state.isLoading = false;
					this.data.segments = response as [];

					return response;
				}),
				catchError((error) => {
					alert(error.error);
					this.state.isLoading = false;

					return throwError('Something gone wrong again.');
				})
			);
	}

	constructor(private activitiesService: ActivitiesService) { }
}
