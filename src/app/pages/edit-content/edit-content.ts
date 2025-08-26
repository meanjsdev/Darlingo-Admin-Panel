import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faArrowLeft, 
  faEdit, 
  faTrash, 
  faPlus, 
  faSave,
  faSpinner,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { ContentService, ContentItem } from '../../services/content.service';

@Component({
  selector: 'app-edit-content',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './edit-content.html',
  styleUrls: ['./edit-content.css']
})
export class EditContentComponent implements OnInit {
  // Icons
  faArrowLeft = faArrowLeft;
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  faSave = faSave;
  faSpinner = faSpinner;
  faExclamationTriangle = faExclamationTriangle;

  // Component state
  contentType: string = '';
  displayName: string = '';
  contentForm: FormGroup;
  isEditing: boolean = false;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  error: string | null = null;
  currentItem: ContentItem | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private contentService: ContentService
  ) {
    this.contentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.contentType = params['type'] || '';
      this.displayName = this.contentService.getContentTypeDisplayName(this.contentType);
      
      const itemId = params['id'];
      if (itemId) {
        this.loadItem(itemId);
        this.isEditing = true;
      } else {
        this.isEditing = false;
        this.resetForm();
      }
    });
  }

  private loadItem(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.contentService.getItem(this.contentType, id).subscribe({
      next: (item) => {
        this.currentItem = item;
        this.contentForm.patchValue({
          name: item.name
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading item:', error);
        this.error = 'Failed to load item. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.contentForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formValue = this.contentForm.value;
    const itemData: Partial<ContentItem> = {
      name: formValue.name
    };

    const request = this.isEditing && this.currentItem?.id
      ? this.contentService.updateItem(this.contentType, this.currentItem.id, itemData as ContentItem)
      : this.contentService.addItem(this.contentType, itemData as ContentItem);

    request.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/content', this.contentType]);
      },
      error: (error) => {
        console.error('Error saving item:', error);
        this.error = `Failed to ${this.isEditing ? 'update' : 'create'} item. Please try again.`;
        this.isSubmitting = false;
      }
    });
  }

  onDelete(): void {
    if (!this.currentItem?.id) {
      return;
    }

    if (confirm(`Are you sure you want to delete "${this.currentItem.name}"?`)) {
      this.isSubmitting = true;
      this.error = null;

      this.contentService.deleteItem(this.contentType, this.currentItem.id).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/content', this.contentType]);
        },
        error: (error) => {
          console.error('Error deleting item:', error);
          this.error = 'Failed to delete item. Please try again.';
          this.isSubmitting = false;
        }
      });
    }
  }

  resetForm(): void {
    this.contentForm.reset({
      name: ''
    });
  }

  goBack(): void {
    this.router.navigate(['/content', this.contentType]);
  }

  // All methods are now implemented above
}