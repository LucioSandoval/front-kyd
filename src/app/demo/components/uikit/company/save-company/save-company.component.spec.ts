import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveCompanyComponent } from './save-company.component';

describe('SaveCompanyComponent', () => {
  let component: SaveCompanyComponent;
  let fixture: ComponentFixture<SaveCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveCompanyComponent]
    });
    fixture = TestBed.createComponent(SaveCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
