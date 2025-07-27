import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionService, ApiResponse } from '../../services/subscription';
import { DialogService } from '../../services/dialog.service';
import { Subscription as SubscriptionModel } from '../../models/subscription.model';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subscription-form.html',
  styleUrls: ['./subscription-form.css']
})
export class SubscriptionForm implements OnInit {
  subscription: SubscriptionModel | null = null;
  subscriptionForm: FormGroup;
  isEditing = false;
  loading = false;
  error: string | null = null;
  featuresCount = 0;
  perksCount = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private subscriptionService: SubscriptionService,
    private dialogService: DialogService
  ) {
    this.subscriptionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      duration: [1, [Validators.required, Validators.min(1)]],
      features: [''],
      perks: [''],
      imageUrl: ['', Validators.required],
      popular: [false],
      isActive: [true]
    });
  }

  ngOnInit() {
    const subscriptionId = this.route.snapshot.paramMap.get('id');
    
    if (subscriptionId) {
      this.isEditing = true;
      this.loadSubscription(subscriptionId);
    }

    // Watch for changes to update the counts
    this.subscriptionForm.get('features')?.valueChanges.subscribe(() => {
      this.featuresCount = this.countNonEmptyLines(this.subscriptionForm.get('features')?.value || '');
    });

    this.subscriptionForm.get('perks')?.valueChanges.subscribe(() => {
      this.perksCount = this.countNonEmptyLines(this.subscriptionForm.get('perks')?.value || '');
    });
  }

  onFeaturesInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const features = textarea.value.split('\n').filter(line => line.trim() !== '');
    this.subscriptionForm.patchValue({ features: features.join('\n') });
    this.featuresCount = features.length;
  }

  private countNonEmptyLines(text: string): number {
    return text.split('\n').filter(line => line.trim() !== '').length;
  }

  onPerksInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  private loadSubscription(id: string) {
    this.loading = true;
    this.subscriptionService.getSubscription(id).subscribe({
      next: (response: ApiResponse<SubscriptionModel>) => {
        if (response.success && response.data) {
          this.subscription = response.data;
          this.subscriptionForm.patchValue({
            name: this.subscription.name,
            description: this.subscription.description,
            price: this.subscription.price,
            duration: this.subscription.duration,
            features: this.subscription.features?.join('\n') || '',
            perks: this.subscription.perks?.join('\n') || '',
            imageUrl: this.subscription.imageUrl || '',
            popular: this.subscription.popular || false,
            isActive: this.subscription.isActive !== undefined ? this.subscription.isActive : true
          });
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading subscription:', error);
        this.error = 'Failed to load subscription details';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.subscriptionForm.valid) {
      this.loading = true;
      const formValue = this.subscriptionForm.value;
      const subscriptionData = {
        name: formValue.name,
        description: formValue.description,
        price: formValue.price,
        duration: formValue.duration,
        features: formValue.features ? formValue.features.split('\n').filter((f: string) => f.trim() !== '') : [],
        perks: formValue.perks ? formValue.perks.split('\n').filter((p: string) => p.trim() !== '') : [],
        imageUrl: formValue.imageUrl,
        popular: formValue.popular || false,
        isActive: formValue.isActive !== undefined ? formValue.isActive : true
      };

      const subscription$ = this.isEditing && this.subscription?._id
        ? this.subscriptionService.updateSubscription(this.subscription._id, subscriptionData)
        : this.subscriptionService.createSubscription(subscriptionData);

      subscription$.subscribe({
        next: (response: ApiResponse<SubscriptionModel>) => {
          if (response.success) {
            this.router.navigate(['/subscriptions']);
          } else {
            this.error = 'Failed to save subscription';
            this.loading = false;
          }
        },
        error: (error: any) => {
          console.error('Error saving subscription:', error);
          this.error = 'An error occurred while saving the subscription';
          this.loading = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation messages
      Object.values(this.subscriptionForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  onCancel() {
    this.router.navigate(['/subscriptions']);
  }
}
