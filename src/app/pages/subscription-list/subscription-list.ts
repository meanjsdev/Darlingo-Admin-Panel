import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubscriptionService, ApiResponse } from '../../services/subscription.service';
import { DialogService } from '../../services/dialog.service';
import { Subscription as SubscriptionModel } from '../../models/subscription.model';
import { SubscriptionForm } from '../subscription-form/subscription-form';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subscription-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    SubscriptionForm,
    // DialogComponent
  ],
  templateUrl: './subscription-list.html',
  styleUrls: ['./subscription-list.css']
})
export default class SubscriptionList implements OnInit {
  subscriptions: SubscriptionModel[] = [];
  loading = true;
  error: string | null = null;
  showDeleteDialog = false;
  subscriptionToDelete: string | null = null;
  showForm = false;
  selectedSubscription: SubscriptionModel | null = null;

  constructor(
    private subscriptionService: SubscriptionService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.loading = true;
    this.subscriptionService.getSubscriptions().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Map the API response to match our subscription model
          this.subscriptions = response.data.map(sub => ({
            ...sub,
            // Ensure we have all required fields with proper fallbacks
            features: sub.features || [],
            perks: sub.perks || [],
            imageUrl: sub.imageUrl || '',
            popular: sub.popular || false,
            isActive: sub.isActive !== undefined ? sub.isActive : true,
            createdAt: sub.createdAt || new Date().toISOString(),
            updatedAt: sub.updatedAt || new Date().toISOString()
          }));
        } else {
          console.error('Failed to load subscriptions:', response);
          this.error = 'Failed to load subscriptions. Please try again.';
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading subscriptions:', error);
        this.loading = false;
      }
    });
  }

  onEdit(subscription: SubscriptionModel) {
    this.selectedSubscription = { ...subscription };
    this.showForm = true;
  }

  onDelete(subscription: SubscriptionModel) {
    // this.dialogService.showDialog({
    //   title: 'Delete Subscription',
    //   message: `Are you sure you want to delete "${subscription.name}"?`,
    //   confirmText: 'Delete',
    //   cancelText: 'Cancel'
    // }).subscribe(confirmed => {
    //   if (confirmed) {
        this.subscriptionService.deleteSubscription(subscription._id || '').subscribe({
          next: (response) => {
            if (response.success) {
              this.loadSubscriptions();
            } else {
              console.error('Failed to delete subscription:', response);
            }
          },
          error: (error: any) => {
            console.error('Error deleting subscription:', error);
          }
        });
      // }
    // });
  }

  onToggleStatus(subscription: SubscriptionModel) {
    if (!subscription._id) return;
    
    const newStatus = !subscription.isActive;
    
    this.subscriptionService.toggleSubscriptionStatus(subscription._id, newStatus)
      .subscribe({
        next: (response) => {
          if (response.success) {
            subscription.isActive = newStatus;
          } else {
            console.error('Failed to toggle subscription status:', response);
          }
        },
        error: (error: any) => {
          console.error('Error toggling subscription status:', error);
        }
      });
  }

  onSaveSubscription(subscriptionData: Omit<SubscriptionModel, '_id' | 'id' | 'createdAt' | 'updatedAt'>) {
    // Ensure required fields have default values
    const subscription: Omit<SubscriptionModel, '_id' | 'id' | 'createdAt' | 'updatedAt'> = {
      name: subscriptionData.name,
      storeId: subscriptionData.storeId,
      description: subscriptionData.description || '',
      price: subscriptionData.price || 0,
      duration: subscriptionData.duration || 1,
      features: Array.isArray(subscriptionData.features) ? subscriptionData.features : [],
      perks: Array.isArray(subscriptionData.perks) ? subscriptionData.perks : [],
      imageUrl: subscriptionData.imageUrl || '',
      popular: subscriptionData.popular || false,
      isActive: subscriptionData.isActive !== undefined ? subscriptionData.isActive : true
    };

    const subscription$ = this.selectedSubscription
      ? this.subscriptionService.updateSubscription(this.selectedSubscription._id || '', subscription)
      : this.subscriptionService.createSubscription(subscription);

    subscription$.subscribe({
      next: (response: ApiResponse<SubscriptionModel>) => {
        if (response.success) {
          this.loadSubscriptions();
          this.closeForm();
        } else {
          console.error('Subscription operation failed:', response);
          // TODO: Show error to user
        }
      },
      error: (error: any) => {
        console.error('Error performing subscription operation:', error);
        // TODO: Show error to user
      }
    });
  }

  closeForm() {
    this.showForm = false;
    this.selectedSubscription = null;
  }

  testClick() {
    console.log('Button clicked!');
    alert('Button was clicked!');
  }

  onAddNew() {
    console.log('onAddNew called');
    this.selectedSubscription = null;
    this.showForm = true;
    console.log('showForm set to:', this.showForm);
  }
}
