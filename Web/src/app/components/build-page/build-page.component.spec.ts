import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildPageComponent } from './build-page.component';

describe('BuildPageComponent', () => {
  let component: BuildPageComponent;
  let fixture: ComponentFixture<BuildPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
