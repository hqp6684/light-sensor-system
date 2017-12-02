import { NgModule } from '@angular/core';
import { TemperatePipe } from './temperate/temperate';
import { OnOffPipe } from './on-off/on-off';
import { PullPeriodPipe } from './pull-period/pull-period';
@NgModule({
	declarations: [TemperatePipe,
    OnOffPipe,
    PullPeriodPipe],
	imports: [],
	exports: [TemperatePipe,
    OnOffPipe,
    PullPeriodPipe]
})
export class PipesModule {}
