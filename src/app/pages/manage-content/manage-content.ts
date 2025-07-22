import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faEdit, 
  faInfoCircle, 
  faHeart,
  faPrayingHands, 
  faGraduationCap, 
  faVenusMars
} from '@fortawesome/free-solid-svg-icons';

interface ContentCard {
  title: string;
  count: number;
  route: string;
}

@Component({
  selector: 'app-manage-content',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './manage-content.html',
  styleUrls: ['./manage-content.css']
})
export class ManageContent {
  // Icons
  faEdit = faEdit;
  faInfoCircle = faInfoCircle;
  
  // Content type icons
  private iconMap: { [key: string]: any } = {
    'Hobbies': faHeart,
    'Religions': faPrayingHands,
    'Educations': faGraduationCap,
    'Sexual Orientations': faVenusMars
  };

  contentCards: ContentCard[] = [
    { title: 'Hobbies', count: 13, route: 'Hobbies' },
    { title: 'Religions', count: 9, route: 'Religions' },
    { title: 'Educations', count: 6, route: 'Educations' },
    { title: 'Sexual Orientations', count: 8, route: 'Sexual Orientations' }
  ];

  getIconForContent(title: string) {
    return this.iconMap[title] || faInfoCircle;
  }
}
