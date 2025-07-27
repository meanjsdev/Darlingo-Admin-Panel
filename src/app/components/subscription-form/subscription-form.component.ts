import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription as SubscriptionModel } from '../../models/subscription.model';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="subscriptionForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name *</label>
        <input
          type="text"
          id="name"
          formControlName="name"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          [class.border-red-300]="subscriptionForm.get('name')?.invalid && subscriptionForm.get('name')?.touched"
          required
        >
        <div *ngIf="subscriptionForm.get('name')?.invalid && subscriptionForm.get('name')?.touched" class="mt-1 text-sm text-red-600">
          Name is required
        </div>
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          formControlName="description"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700">Price *</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              formControlName="price"
              min="0"
              step="0.01"
              class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              [class.border-red-300]="subscriptionForm.get('price')?.invalid && subscriptionForm.get('price')?.touched"
              required
            >
          </div>
          <div *ngIf="subscriptionForm.get('price')?.invalid && subscriptionForm.get('price')?.touched" class="mt-1 text-sm text-red-600">
            Valid price is required
          </div>
        </div>

        <div>
          <label for="duration" class="block text-sm font-medium text-gray-700">Duration (months) *</label>
          <input
            type="number"
            id="duration"
            formControlName="duration"
            min="1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            [class.border-red-300]="subscriptionForm.get('duration')?.invalid && subscriptionForm.get('duration')?.touched"
            required
          >
          <div *ngIf="subscriptionForm.get('duration')?.invalid && subscriptionForm.get('duration')?.touched" class="mt-1 text-sm text-red-600">
            Duration must be at least 1 month
          </div>
        </div>
      </div>

      <div>
        <label for="features" class="block text-sm font-medium text-gray-700">Features (one per line)</label>
        <textarea
          id="features"
          formControlName="features"
          rows="4"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Feature 1&#10;Feature 2&#10;..."
        ></textarea>
      </div>

      <div>
        <label for="perks" class="block text-sm font-medium text-gray-700">Perks (one per line)</label>
        <textarea
          id="perks"
          formControlName="perks"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Perk 1&#10;Perk 2&#10;..."
        ></textarea>
      </div>

      <div>
        <label for="imageUrl" class="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          id="imageUrl"
          formControlName="imageUrl"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="https://example.com/image.jpg"
        >
      </div>

      <div class="flex items-center">
        <input
          id="popular"
          type="checkbox"
          formControlName="popular"
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        >
        <label for="popular" class="ml-2 block text-sm text-gray-700">
          Mark as popular
        </label>
      </div>

      <div class="flex items-center">
        <input
          id="isActive"
          type="checkbox"
          formControlName="isActive"
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        >
        <label for="isActive" class="ml-2 block text-sm text-gray-700">
          Active
        </label>
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          (click)="cancel.emit()"
          class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          [disabled]="subscriptionForm.invalid"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ subscription ? 'Update' : 'Create' }} Subscription
        </button>
      </div>
    </form>
  `,
  styles: []
})
export class SubscriptionFormComponent {
  @Input() subscription: SubscriptionModel | null = null;
  @Output() save = new EventEmitter<Omit<SubscriptionModel, '_id' | 'id' | 'createdAt' | 'updatedAt'>>();
  @Output() cancel = new EventEmitter<void>();

  subscriptionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.subscriptionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      duration: [1, [Validators.required, Validators.min(1)]],
      features: [''],
      perks: [''],
      imageUrl: [''],
      popular: [false],
      isActive: [true]
    });
  }

  ngOnInit() {
    if (this.subscription) {
      const { _id, id, createdAt, updatedAt, features, perks, ...formData } = this.subscription;
      this.subscriptionForm.patchValue({
        ...formData,
        features: features ? features.join('\n') : '',
        perks: perks ? perks.join('\n') : ''
      });
    }
  }

  onSubmit() {
    if (this.subscriptionForm.valid) {
      const formValue = this.subscriptionForm.value;
      const subscriptionData: Omit<SubscriptionModel, '_id' | 'id' | 'createdAt' | 'updatedAt'> = {
        name: formValue.name,
        description: formValue.description || '',
        price: Number(formValue.price) || 0,
        duration: Number(formValue.duration) || 1,
        features: formValue.features ? formValue.features.split('\n').filter((f: string) => f.trim() !== '') : [],
        perks: formValue.perks ? formValue.perks.split('\n').filter((p: string) => p.trim() !== '') : [],
        imageUrl: formValue.imageUrl || '',
        popular: !!formValue.popular,
        isActive: !!formValue.isActive
      };
      this.save.emit(subscriptionData);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
