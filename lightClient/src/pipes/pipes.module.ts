import { NgModule } from '@angular/core';
import { TemperatePipe } from './temperate/temperate';
@NgModule({
	declarations: [TemperatePipe],
	imports: [],
	exports: [TemperatePipe]
})
export class PipesModule {}
