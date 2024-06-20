import { Subject, takeUntil } from "rxjs";
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from "@angular/cdk/collections";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { IClient } from "../../models/client";
import { ClientManagerService } from "../../services/client-manager.service";
import { ClientDialogWebComponent } from "../client-dialog/client-dialog.web.component";

@Component({
  selector: 'app-client-list',
  templateUrl: 'client-list.web.component.html',
  styleUrls: ['client-list.web.component.scss']
})
export class ClientListWebComponent implements OnInit, OnDestroy {
  protected isDisabled: boolean = false;
  protected displayedColumns: string[] = ['select', 'name', 'surname', 'email', 'phone'];
  protected dataSource: MatTableDataSource<IClient>;
  protected selection: SelectionModel<IClient> = new SelectionModel<IClient>(true, []);
  private _destroy$: Subject<void> = new Subject<void>();

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private _clientManagerService: ClientManagerService,
    private dialog: MatDialog
  ) {
    const localStoredClients: string | null = localStorage.getItem('clients');
    this.dataSource = new MatTableDataSource<IClient>(localStoredClients ? JSON.parse(localStoredClients) : []);
  }

  /**
   * Запрос и загрузка клиентов в случае их отсутствия
   */
  ngOnInit(): void {
    this._clientManagerService.getClientList
      .pipe(takeUntil(this._destroy$))
      .subscribe(clients => {
      this.dataSource.data = clients;
    });
    this.dataSource.sort = this.sort
  }

  /**
   * Отписка
   */
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Сортировка данных по переданному столбцу
   * @param sort информация об активном объекте и его направлении сортировки
   */
  sortClients(sort: Sort): void {
    this._clientManagerService.sortClients(sort.active);
  }

  /**
   * Проверка все ли клиенты выделены
   * @returns boolean
   */
  isAllClientsSelected(): boolean {
    this.isDisabled = !this.selection.selected.length;
    const countSelectedClients: number = this.selection.selected.length;
    const countRows: number = this.dataSource.data.length;
    return countSelectedClients === countRows;
  }

  /**
   * Тогл выделения клиентов
   */
  masterToggle(): void {
    this.isAllClientsSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**
   * Открытие модального окна для создания нового клиента
   */
  openAddClientDialog(): void {
    const dialogRef: MatDialogRef<ClientDialogWebComponent> = this.dialog.open(ClientDialogWebComponent, {
      width: '448px',
      data: { action: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'add') {
        this._clientManagerService.addClient(result.client);
      }
    });
  }

  /**
   * Открытие модального окна для редактирования клиента
   * @param client
   */
  openEditClientDialog(client: IClient): void {
    const dialogRef: MatDialogRef<ClientDialogWebComponent> = this.dialog.open(ClientDialogWebComponent, {
      width: '448px',
      data: { action: 'edit', client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'edit') {
        this._clientManagerService.editClient(result.client);
      }
    });
  }

  /**
   * Открытие модального окна для удаления клиента/ов
   */
  openDeleteClientDialog(): void {
    const dialogRef: MatDialogRef<ClientDialogWebComponent> = this.dialog.open(ClientDialogWebComponent, {
      width: '448px',
      data: { action: 'delete', selectedClients: this.selection.selected }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'delete') {
        this._clientManagerService.deleteClients(result.selectedClients);
      }
    });
  }
}
