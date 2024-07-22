import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ContactComponent } from './components/contact/contact.component'; // Assuming you have a separate component for contacts
import { authGuard } from './guards/auth.guard';
import { SignupComponent } from './components/signup/signup.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'contacts', component: ContactComponent, canActivate: [authGuard] },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: 'login' }
];
