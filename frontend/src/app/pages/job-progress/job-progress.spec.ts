import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobProgress } from './job-progress';

describe('JobProgress', () => {
  let component: JobProgress;
  let fixture: ComponentFixture<JobProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobProgress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobProgress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
