import { NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

import { Dsi, DsiConfig, DsiFormGroup, DsiFormGroupFactory } from '../../../src';

const instances: {[id: string]: DsiFormGroup<any, any>} = {};

export function AppDsiFormGroupFactory(
	dsi: Dsi<any, any>,
	formBuilder: FormBuilder,
	ngZone: NgZone
): DsiFormGroupFactory {
	return (id: Observable<string>, config: DsiConfig): DsiFormGroup<any, any> => {
		if (!instances[config.id])
			instances[config.id] = new DsiFormGroup(config, dsi, formBuilder, id, ngZone);
		return instances[config.id];
	};
}
