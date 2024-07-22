import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService; // Replace AuthService with your actual service if different

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, AuthService] // Provide your guard and service
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService); // Inject AuthService here
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true); // Mock isLoggedIn method

    const routeSnapshot = {} as ActivatedRouteSnapshot; // Mock ActivatedRouteSnapshot if needed
    const stateSnapshot = {} as RouterStateSnapshot; // Mock RouterStateSnapshot if needed

    const canActivate = guard.canActivate(routeSnapshot, stateSnapshot);

    expect(canActivate).toBe(true); // Adjust this based on your guard logic
  });

  it('should not allow activation if user is not logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false); // Mock isLoggedIn method

    const routeSnapshot = {} as ActivatedRouteSnapshot; // Mock ActivatedRouteSnapshot if needed
    const stateSnapshot = {} as RouterStateSnapshot; // Mock RouterStateSnapshot if needed

    const canActivate = guard.canActivate(routeSnapshot, stateSnapshot);

    expect(canActivate).toBe(false); // Adjust this based on your guard logic
  });
});
