import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start logged out', () => {
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should log in', () => {
    service.login('testuser');
    expect(service.isLoggedIn()).toBeTrue();
    expect(service.currentUser()).toBe('testuser');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should log out', () => {
    service.login('testuser');
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });
});
