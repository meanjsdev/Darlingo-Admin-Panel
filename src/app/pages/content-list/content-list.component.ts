import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faSpinner,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { ContentService, ContentItem } from '../../services/content.service';

@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.css']
})
export class ContentListComponent implements OnInit {
  // Icons
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faSpinner = faSpinner;
  faExclamationTriangle = faExclamationTriangle;

  // State
  contentType: string = '';
  displayName: string = '';
  items: ContentItem[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.contentType = params.get('type') || '';
      this.displayName = this.contentService.getContentTypeDisplayName(this.contentType);
      this.loadItems();
    });
  }

  loadItems() {
    this.isLoading = true;
    this.error = null;

    this.contentService.getItems(this.contentType).subscribe({
      next: (items) => {
        this.items = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(`Error loading ${this.contentType}:`, error);
        this.error = `Failed to load ${this.displayName} items`;
        this.isLoading = false;
      }
    });
  }

  onDelete(item: ContentItem) {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      this.contentService.deleteItem(this.contentType, item.id || '').subscribe({
        next: () => {
          // Remove the item from the local array
          this.items = this.items.filter(i => i.id !== item.id);
        },
        error: (error) => {
          console.error(`Error deleting ${this.contentType}:`, error);
          this.error = `Failed to delete ${this.displayName} item`;
        }
      });
    }
  }

  getItemRoute(item: ContentItem): string[] {
    return ['/content', this.contentType, 'edit', item.id || ''];
  }
}
