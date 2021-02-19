import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { InlineSVGDirective } from 'ng-inline-svg';
import { NodeOptions } from '../../node-options';
import { getDummyCategory } from '../../shared/fixtures/category';
import { NodeComponent } from './node.component';

describe('NodeComponent', () => {
  let component: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          InlineSVGDirective,
          NodeComponent
        ],
        imports: [
          MatTooltipModule,
          RouterTestingModule.withRoutes([])
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeComponent);
    component = fixture.componentInstance;
    component.options = new NodeOptions({
      relationship: 'self',
      x: 0,
      y: 0,
      radius: 80,
      angle: 0,
      titleHeight: 40
    });
    component.category = getDummyCategory();
    component.numTotal = 1;
    component.state = 'nary';
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
