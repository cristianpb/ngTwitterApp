import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsvgComponent } from './mapsvg.component';

describe('MapsvgComponent', () => {
  let component: MapsvgComponent;
  let fixture: ComponentFixture<MapsvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapsvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
