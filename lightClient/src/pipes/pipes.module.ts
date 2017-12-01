import { NgModule } from '@angular/core';
import { TemperatePipe } from './temperate/temperate';
import { OnOffPipe } from './on-off/on-off';
@NgModule({
	declarations: [TemperatePipe,
    OnOffPipe],
	imports: [],
	exports: [TemperatePipe,
    OnOffPipe]
})
export class PipesModule {}
