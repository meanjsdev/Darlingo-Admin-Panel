import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" *ngIf="isOpen">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ config?.title }}</h3>
        <p class="text-gray-700 mb-6">{{ config?.message }}</p>
        <div class="flex justify-end space-x-3">
          <button
            *ngIf="config?.cancelText"
            (click)="onCancel()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ config?.cancelText || 'Cancel' }}
          </button>
          <button
            (click)="onConfirm()"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ config?.confirmText || 'OK' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 50;
    }
  `]
})
export class DialogComponent implements OnDestroy {
  isOpen = false;
  config: any = null;
  private callback: ((result: boolean) => void) | null = null;
  private subscription: any;

  constructor(private dialogService: DialogService) {
    this.subscription = this.dialogService.getDialog().subscribe(dialog => {
      if (dialog) {
        this.config = dialog.config;
        this.callback = dialog.callback;
        this.isOpen = true;
      } else {
        this.isOpen = false;
        this.config = null;
        this.callback = null;
      }
    });
  }

  onConfirm() {
    if (this.callback) {
      this.callback(true);
    }
    this.dialogService.closeDialog();
  }

  onCancel() {
    if (this.callback) {
      this.callback(false);
    }
    this.dialogService.closeDialog();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
