import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faEdit, 
  faInfoCircle, 
  faVenusMars, 
  faSearch, 
  faGraduationCap, 
  faDumbbell, 
  faPlaceOfWorship, 
  faSmoking, 
  faWineGlass, 
  faHeart,
  faGlobe,
  faLanguage,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { ContentService, ContentItem } from '../../services/content.service';
import { HttpClientModule } from '@angular/common/http';

interface ContentCard {
  title: string;
  count: number;
  route: string;
  type: string;
}

@Component({
  selector: 'app-manage-content',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, HttpClientModule],
  templateUrl: './manage-content.html',
  styleUrls: ['./manage-content.css']
})
export class ManageContent implements OnInit {
  // Icons
  faEdit = faEdit;
  faInfoCircle = faInfoCircle;
  isLoading = true;
  error: string | null = null;
  
  // Content type icons
  private iconMap: { [key: string]: any } = {
    'sexual-orientation': faVenusMars,
    'looking-for': faSearch,
    'education': faGraduationCap,
    'workout': faDumbbell,
    'religion': faPlaceOfWorship,
    'smoking': faSmoking,
    'drinking': faWineGlass,
    'interests': faHeart,
    'nationalities': faGlobe,
    'native-languages': faLanguage,
    'current-situations': faMapMarkerAlt
  };

  contentCards: ContentCard[] = [
    { title: 'Sexual Orientation', count: 0, route: 'sexual-orientation', type: 'sexual-orientation' },
    { title: 'Looking For', count: 0, route: 'looking-for', type: 'looking-for' },
    { title: 'Education', count: 0, route: 'education', type: 'education' },
    { title: 'Workout', count: 0, route: 'workout', type: 'workout' },
    { title: 'Religion', count: 0, route: 'religion', type: 'religion' },
    { title: 'Smoking', count: 0, route: 'smoking', type: 'smoking' },
    { title: 'Drinking', count: 0, route: 'drinking', type: 'drinking' },
    { title: 'Interests', count: 0, route: 'interests', type: 'interests' },
    { title: 'Nationalities', count: 0, route: 'nationalities', type: 'nationalities' },
    { title: 'Native Languages', count: 0, route: 'native-languages', type: 'native-languages' },
    { title: 'Current Situations', count: 0, route: 'current-situations', type: 'current-situations' }
  ];

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.loadContentCounts();
  }

  private loadContentCounts() {
    this.isLoading = true;
    let completedRequests = 0;
    const totalRequests = this.contentCards.length;

    this.contentCards.forEach((card, index) => {
      this.contentService.getItems(card.type).subscribe({
        next: (items: ContentItem[]) => {
          this.contentCards[index].count = items.length;
          completedRequests++;
          this.checkAllRequestsCompleted(completedRequests, totalRequests);
        },
        error: (error) => {
          console.error(`Error loading ${card.title}:`, error);
          this.contentCards[index].count = 0;
          this.error = `Failed to load ${card.title} count`;
          completedRequests++;
          this.checkAllRequestsCompleted(completedRequests, totalRequests);
        }
      });
    });
  }

  private checkAllRequestsCompleted(completed: number, total: number) {
    if (completed === total) {
      this.isLoading = false;
    }
  }

  getIconForContent(type: string) {
    return this.iconMap[type] || faInfoCircle;
  }
}
