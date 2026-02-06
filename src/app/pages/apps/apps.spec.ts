import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppsListComponent } from './apps';

describe('AppsListComponent', () => {
  let component: AppsListComponent;
  let fixture: ComponentFixture<AppsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppsListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter apps by search query', () => {
    component.searchQuery.set('social');
    fixture.detectChanges();
    const filtered = component.filteredApps();
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(app =>
      app.name.toLowerCase().includes('social') ||
      app.description.toLowerCase().includes('social')
    )).toBeTrue();
  });

  it('should filter apps by category', () => {
    component.selectedCategory.set('Development');
    fixture.detectChanges();
    const filtered = component.filteredApps();
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(app => app.category === 'Development')).toBeTrue();
  });

  it('should return all apps when filters are empty', () => {
    component.searchQuery.set('');
    component.selectedCategory.set('');
    fixture.detectChanges();
    expect(component.filteredApps().length).toBe(component.apps.length);
  });
});
