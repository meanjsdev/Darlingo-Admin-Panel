import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogSubject = new BehaviorSubject<{config: DialogConfig, callback: (result: boolean) => void} | null>(null);
  
  showDialog(config: DialogConfig): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const callback = (result: boolean) => {
        observer.next(result);
        observer.complete();
      };
      this.dialogSubject.next({ config, callback });
    });
  }

  getDialog() {
    return this.dialogSubject.asObservable();
  }

  closeDialog() {
    this.dialogSubject.next(null);
  }
}
