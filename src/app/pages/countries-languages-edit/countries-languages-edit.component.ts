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
import { CountriesLanguagesService, CountryLanguageItem } from '../../services/countries-languages.service';

@Component({
  selector: 'app-countries-languages-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './countries-languages-edit.component.html',
  styleUrls: ['./countries-languages-edit.component.css']
})
export class CountriesLanguagesEditComponent implements OnInit {
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
  currentItem: CountryLanguageItem | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private countriesLanguagesService: CountriesLanguagesService
  ) {
    this.contentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.contentType = params['type'] || '';
      this.displayName = this.contentType === 'countries' ? 'Countries' : 'Languages';
      
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

    const serviceMethod = this.contentType === 'countries' ? 
      this.countriesLanguagesService.getCountry(id) : 
      this.countriesLanguagesService.getLanguage(id);

    serviceMethod.subscribe({
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
    const itemData: Partial<CountryLanguageItem> = {
      name: formValue.name
    };

    let request;
    if (this.isEditing && this.currentItem?.id) {
      request = this.contentType === 'countries' ? 
        this.countriesLanguagesService.updateCountry(this.currentItem.id, itemData as CountryLanguageItem) :
        this.countriesLanguagesService.updateLanguage(this.currentItem.id, itemData as CountryLanguageItem);
    } else {
      request = this.contentType === 'countries' ? 
        this.countriesLanguagesService.addCountry(itemData as CountryLanguageItem) :
        this.countriesLanguagesService.addLanguage(itemData as CountryLanguageItem);
    }

    request.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/countries-languages', this.contentType]);
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

      const deleteMethod = this.contentType === 'countries' ? 
        this.countriesLanguagesService.deleteCountry(this.currentItem.id) :
        this.countriesLanguagesService.deleteLanguage(this.currentItem.id);

      deleteMethod.subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/countries-languages', this.contentType]);
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
    this.router.navigate(['/countries-languages', this.contentType]);
  }
}