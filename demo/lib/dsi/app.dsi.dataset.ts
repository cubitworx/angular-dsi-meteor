import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import { Dsi, DsiConfig, DsiDataset, DsiDatasetFactory } from '../../../src';

const instances: {[id: string]: DsiDataset<any, any>} = {};

export function AppDsiDatasetFactory(
	dsi: Dsi<any, any>,
	ngZone: NgZone
): DsiDatasetFactory {
	return (config: DsiConfig): DsiDataset<any, any> => {
		if (!instances[config.id])
			instances[config.id] = new DsiDataset(config, dsi, ngZone);
		return instances[config.id];
	};
}
