import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContent } from './edit-content';

describe('EditContent', () => {
  let component: EditContent;
  let fixture: ComponentFixture<EditContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
