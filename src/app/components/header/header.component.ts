import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from '../../pages/reset-password/reset-password.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ResetPasswordComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isDropdownOpen = false;
  showResetPasswordModal = false;
  userData: any = {
    name: 'Admin User',
    email: 'admin@example.com'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    // Load user data from your authentication service
    // this.userData = this.authService.getCurrentUser();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isDropdownOpen = false;
    }
  }

  openResetPassword() {
    this.isDropdownOpen = false;
    this.showResetPasswordModal = true;
  }

  onResetPasswordClose() {
    this.showResetPasswordModal = false;
  }

  logout() {
    this.isDropdownOpen = false;
    
    // Call your authentication service logout method
    // Example:
    // this.authService.logout().subscribe({
    //   next: () => {
    //     // Clear any stored tokens or user data
    //     localStorage.removeItem('auth_token');
    //     // Navigate to login page
    //     this.router.navigate(['/login']);
    //   },
    //   error: (error) => {
    //     console.error('Logout failed:', error);
    //     // Still navigate to login even if there's an error
    //     this.router.navigate(['/login']);
    //   }
    // });

    // For now, just navigate to login
    this.router.navigate(['/login']);
  }
}
