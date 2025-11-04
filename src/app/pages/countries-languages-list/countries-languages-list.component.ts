import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faSpinner,
  faExclamationTriangle,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { CountriesLanguagesService, CountryLanguageItem } from '../../services/countries-languages.service';

@Component({
  selector: 'app-countries-languages-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './countries-languages-list.component.html',
  styleUrls: ['./countries-languages-list.component.css']
})
export class CountriesLanguagesListComponent implements OnInit {
  // Icons
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faSpinner = faSpinner;
  faExclamationTriangle = faExclamationTriangle;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  // State
  contentType: string = '';
  displayName: string = '';
  allItems: CountryLanguageItem[] = [];
  items: CountryLanguageItem[] = [];
  isLoading = true;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private countriesLanguagesService: CountriesLanguagesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.contentType = params.get('type') || '';
      this.displayName = this.contentType === 'countries' ? 'Countries' : 'Languages';
      this.loadItems();
    });
  }

  loadItems() {
    this.isLoading = true;
    this.error = null;

    const serviceMethod = this.contentType === 'countries' ? 
      this.countriesLanguagesService.getCountries() : 
      this.countriesLanguagesService.getLanguages();

    serviceMethod.subscribe({
      next: (items) => {
        this.allItems = items;
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error(`Error loading ${this.contentType}:`, error);
        this.error = `Failed to load ${this.displayName} items`;
        this.isLoading = false;
      }
    });
  }

  onDelete(item: CountryLanguageItem) {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      const deleteMethod = this.contentType === 'countries' ? 
        this.countriesLanguagesService.deleteCountry(item.id || '') : 
        this.countriesLanguagesService.deleteLanguage(item.id || '');

      deleteMethod.subscribe({
        next: () => {
          this.allItems = this.allItems.filter(i => i.id !== item.id);
          this.updatePagination();
        },
        error: (error) => {
          console.error(`Error deleting ${this.contentType}:`, error);
          this.error = `Failed to delete ${this.displayName} item`;
        }
      });
    }
  }

  getItemRoute(item: CountryLanguageItem): string[] {
    return ['/countries-languages', this.contentType, 'edit', item.id || ''];
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.allItems.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.items = this.allItems.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  get paginationInfo() {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.allItems.length);
    return `${start}-${end} of ${this.allItems.length}`;
  }
}