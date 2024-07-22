import { HttpClient, HttpClientModule } from '@angular/common/http';
import { afterNextRender, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../../../models/contact.model';
import { AsyncPipe, CommonModule, getLocaleId } from '@angular/common';
import { Validators, FormControl, FormGroup, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, AsyncPipe, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent{

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private router: Router
  ) {}

  contactForm = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl<string>('', Validators.required), // Name field is required
    email: new FormControl<string | null>('',
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')), // Email field requires valid email format
    phone: new FormControl<string>('',
      Validators.pattern('[0-9]{10}')), // Phone field requires exactly 10 digits
    favorite: new FormControl<boolean>(false)
  });

  contacts$: Observable<Contact[]> = this.getContacts();
  username: string | null = null;

  onFormSubmit() {
    if (this.contactForm.valid) {
      const contactRequest = {
        id: this.contactForm.value.id,
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        phone: this.contactForm.value.phone,
        favorite: this.contactForm.value.favorite,
        userId: this.authService.getUserId()
      };
      
      if (contactRequest.id) {
        // Update existing contact
        this.http.put(`https://localhost:7087/api/Contacts/${contactRequest.id}`, contactRequest)
          .subscribe({
            next: (value) => {
              console.log(value);
              this.contacts$ = this.getContacts();
              this.contactForm.reset();
            }
          });
      } else {
        // Add new contact
        this.http.post('https://localhost:7087/api/Contacts', contactRequest)
          .subscribe({
            next: (value) => {
              console.log(value);
              this.contacts$ = this.getContacts();
              this.contactForm.reset();
            }
          });
      }
    } else {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.contactForm);
    }
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    console.log('Username:', this.username);
    
    // You can remove the getUserInfo() call if you don't need other user information
    // this.authService.getUserInfo().subscribe({...});
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onDelete(id: string) {
    this.http.delete(`https://localhost:7087/api/Contacts/${id}`)
      .subscribe({
        next: (value) => {
          alert('Item Deleted');
          this.contacts$ = this.getContacts();
        }
      });
  }

  onEdit(contact: Contact) {
    this.contactForm.patchValue({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      favorite: contact.favorite
    });
  }

  private getContacts(): Observable<Contact[]> {
    const userId = this.authService.getUserId();
    console.log(userId+" this is user Id")
    return this.http.get<Contact[]>(`https://localhost:7087/userData?userId=${userId}`);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
