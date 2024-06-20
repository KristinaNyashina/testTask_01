import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogData } from "../../models/dialog-data";


@Component({
  selector: 'app-common-dialog',
  templateUrl: 'client-dialog.web.component.html',
  styleUrls: ['client-dialog.web.component.scss']
})
export class ClientDialogWebComponent {
  clientForm!: FormGroup;
  isEditMode: boolean;
  isDeleteMode: boolean;
  action: 'add' | 'edit' | 'delete';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ClientDialogWebComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.action = data.action;
    this.isEditMode = data.action === 'edit';
    this.isDeleteMode = data.action === 'delete';

    if (!this.isDeleteMode) {
      this.clientForm = this.fb.group({
        name: [data.client?.name || '', [Validators.required, Validators.minLength(2)]],
        surname: [data.client?.surname || '', [Validators.required, Validators.minLength(2)]],
        email: [data.client?.email || '', [Validators.required, Validators.email]],
        phone: [data.client?.phone || '', [Validators.pattern(/^(\+7|8)\d{10}$/)]]
      });
    }
  }

  /**
   * Сохранение данных
   */
  onSave(): void {
    if (this.clientForm.valid) {
      this.dialogRef.close({ action: this.action, client: this.clientForm.value });
    }
  }

  /**
   * Удаление клиентов
   */
  onDelete(): void {
    this.dialogRef.close({ action: this.action, selectedClients: this.data.selectedClients });
  }

  /**
   * Закрытие модального окна
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
