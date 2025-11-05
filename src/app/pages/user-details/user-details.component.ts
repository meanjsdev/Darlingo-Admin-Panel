import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faArrowLeft, 
  faEdit, 
  faUser,
  faEnvelope,
  faPhone,
  faGlobe,
  faLanguage,
  faCalendar,
  faToggleOn,
  faToggleOff
} from '@fortawesome/free-solid-svg-icons';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  // Icons
  faArrowLeft = faArrowLeft;
  faEdit = faEdit;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faGlobe = faGlobe;
  faLanguage = faLanguage;
  faCalendar = faCalendar;
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff;

  // Services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);

  // State
  user = signal<User | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedImage: string | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.loadUser(userId);
      }
    });
  }

  private loadUser(userId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getUserById(userId).subscribe({
      next: (response: any) => {
        if (response?.success && response?.data?.user) {
          this.user.set(response.data.user);
        } else {
          this.error.set('User not found');
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.error.set('Failed to load user details');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  editUser(): void {
    const currentUser = this.user();
    if (currentUser?._id) {
      this.router.navigate(['/users', currentUser._id, 'edit']);
    }
  }

  getUserNationality(): string {
    const userData = this.user() as any;
    return userData?.nationality || 'N/A';
  }

  getUserNativeLanguage(): string {
    const userData = this.user() as any;
    return userData?.nativeLanguage || 'N/A';
  }

  getUserAge(): string {
    const userData = this.user() as any;
    return userData?.age ? userData.age.toString() : 'N/A';
  }

  getUserHeight(): string {
    const userData = this.user() as any;
    return userData?.height ? `${userData.height} cm` : 'N/A';
  }

  getUserAddress(): string {
    const userData = this.user() as any;
    return userData?.address || 'N/A';
  }

  getUserEducation(): string {
    const userData = this.user() as any;
    return userData?.education || 'N/A';
  }

  getUserWorkout(): string {
    const userData = this.user() as any;
    return userData?.workOut || 'N/A';
  }

  getUserReligion(): string {
    const userData = this.user() as any;
    return userData?.religion || 'N/A';
  }

  getUserSmoking(): string {
    const userData = this.user() as any;
    return userData?.smoking || 'N/A';
  }

  getUserDrinking(): string {
    const userData = this.user() as any;
    return userData?.drinking || 'N/A';
  }

  getUserSexualOrientation(): string {
    const userData = this.user() as any;
    return userData?.sexualOrientation || 'N/A';
  }

  getUserLookingFor(): string {
    const userData = this.user() as any;
    return userData?.lookingFor || 'N/A';
  }

  getPreferredLanguage(): string {
    const userData = this.user() as any;
    return userData?.preferredLanguage || 'N/A';
  }

  getUserInterests(): string {
    const userData = this.user() as any;
    return userData?.interests?.join(', ') || 'N/A';
  }

  getUserAboutMe(): string {
    const userData = this.user() as any;
    return userData?.aboutMe || 'N/A';
  }

  getUserProfilePic(): string {
    const userData = this.user() as any;
    return userData?.profilePic || userData?.profilePicture || '';
  }

  getUserGalleryImages(): string[] {
    const userData = this.user() as any;
    return userData?.gallery?.images || [];
  }

  getUserGalleryVideos(): string[] {
    const userData = this.user() as any;
    return userData?.gallery?.videos || [];
  }

  hasGalleryContent(): boolean {
    return this.getUserGalleryImages().length > 0 || this.getUserGalleryVideos().length > 0;
  }

  openImageModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  closeImageModal(): void {
    this.selectedImage = null;
  }
}