import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import { GeoJSONSourceComponent } from 'ngx-mapbox-gl';

@Component({
  selector: 'my-app',
  template: `
  <mgl-map
    [style]="'mapbox://styles/mapbox/streets-v9'"
    [zoom]="[9]"
    [center]="[-74.50, 40]"
  ></mgl-map>
  `,
  styles: [
    `
    mgl-map {
      height: 100vh;
      width: 100vw;
    }
  `,
  ],
})
export class AppComponent {
  earthquakes: GeoJSON.FeatureCollection;
  selectedCluster: { geometry: GeoJSON.Point; properties: any };

  async ngOnInit() {
    const earthquakes: GeoJSON.FeatureCollection = <any>(
      await import('./earthquakes.geo.json')
    );
    setInterval(() => {
      if (earthquakes.features.length) {
        earthquakes.features.pop();
      }
      this.earthquakes = { ...earthquakes };
    }, 500);
  }

  selectCluster(event: MouseEvent, feature: any) {
    event.stopPropagation(); // This is needed, otherwise the popup will close immediately
    // Change the ref, to trigger mgl-popup onChanges (when the user click on the same cluster)
    this.selectedCluster = {
      geometry: feature.geometry,
      properties: feature.properties,
    };
  }
}
