import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faGlobe,
  faLanguage,
  faPlus,
  faList,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { CountriesLanguagesService, CountryLanguageItem } from '../../services/countries-languages.service';
import { HttpClientModule } from '@angular/common/http';

interface ContentCard {
  title: string;
  count: number;
  route: string;
  type: string;
}

@Component({
  selector: 'app-countries-languages',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, HttpClientModule],
  templateUrl: './countries-languages.html',
  styleUrls: ['./countries-languages.css']
})
export class CountriesLanguages implements OnInit {
  // Icons
  faPlus = faPlus;
  faList = faList;
  faInfoCircle = faInfoCircle;
  isLoading = true;
  error: string | null = null;
  
  // Content type icons
  private iconMap: { [key: string]: any } = {
    'countries': faGlobe,
    'languages': faLanguage
  };

  contentCards: ContentCard[] = [
    { title: 'Countries', count: 0, route: 'countries', type: 'countries' },
    { title: 'Languages', count: 0, route: 'languages', type: 'languages' }
  ];

  constructor(private countriesLanguagesService: CountriesLanguagesService) {}

  ngOnInit() {
    this.loadContentCounts();
  }

  private loadContentCounts() {
    this.isLoading = true;
    let completedRequests = 0;
    const totalRequests = this.contentCards.length;

    this.contentCards.forEach((card, index) => {
      const serviceMethod = card.type === 'countries' ? 
        this.countriesLanguagesService.getCountries() : 
        this.countriesLanguagesService.getLanguages();
      
      serviceMethod.subscribe({
        next: (items: CountryLanguageItem[]) => {
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