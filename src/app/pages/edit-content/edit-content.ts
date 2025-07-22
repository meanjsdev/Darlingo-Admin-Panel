import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

interface ContentItem {
  id: number;
  name: string;
}

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

  // Component state
  contentType: string = '';
  contentForm: FormGroup;
  contentItems: ContentItem[] = [];
  isEditing: boolean = false;
  currentItemId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.contentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.contentType = params['type'] || 'Content';
      // In a real app, you would fetch the content items from a service
      this.loadContentItems();
    });
  }

  loadContentItems(): void {
    // Mock data - replace with actual API call
    this.contentItems = [
      { id: 1, name: 'Photography' },
      { id: 2, name: 'Shopping' },
      { id: 3, name: 'Video Games' },
      { id: 4, name: 'Music' },
      { id: 5, name: 'Traveling' }
    ];
  }

  onSubmit(): void {
    if (this.contentForm.invalid) return;

    const newItem: ContentItem = {
      id: this.isEditing && this.currentItemId ? this.currentItemId : Date.now(),
      name: this.contentForm.value.name
    };

    if (this.isEditing && this.currentItemId) {
      // Update existing item
      const index = this.contentItems.findIndex(item => item.id === this.currentItemId);
      if (index !== -1) {
        this.contentItems[index] = newItem;
      }
    } else {
      // Add new item
      this.contentItems = [newItem, ...this.contentItems];
    }

    this.resetForm();
  }

  onEdit(item: ContentItem): void {
    this.isEditing = true;
    this.currentItemId = item.id;
    this.contentForm.patchValue({
      name: item.name
    });
  }

  onDelete(item: ContentItem): void {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      this.contentItems = this.contentItems.filter(i => i.id !== item.id);
    }
  }

  resetForm(): void {
    this.contentForm.reset();
    this.isEditing = false;
    this.currentItemId = null;
  }

  goBack(): void {
    this.router.navigate(['/manage-content']);
  }
}