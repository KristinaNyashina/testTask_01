import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";

import { IClient } from "../models/client";
import { ClientsData } from "../data/clients";


@Injectable()
export class ClientManagerService implements OnDestroy {

  public get getClientList(): BehaviorSubject<IClient[]> {
    return this.clientsSubject;
  }

  private clients: IClient[] = [];
  private clientsSubject: BehaviorSubject<IClient[]> = new BehaviorSubject<IClient[]>([]);
  private _sortType: string = '';
  private _destroy$: Subject<void> = new Subject<void>();


  constructor(
    private clientsData: ClientsData
  ) {
    const localStoredClients: string | null = localStorage.getItem('clients');
    if (localStoredClients) {
      this.clients = JSON.parse(localStoredClients);
      this.clientsSubject.next(this.clients);
    }
    else {
      this.fetchClients();
    }
  }

  /**
   * Запрос списка клиентов
   */
  private fetchClients(): void {
    this.clientsData.getAll()
      .pipe(takeUntil(this._destroy$))
      .subscribe((clients: IClient[]) => {
        this.clients = clients;
        this.clientsSubject.next(clients);
        localStorage.setItem('clients', JSON.stringify(clients));
      });
  }

  /**
   * Сортировка клиентов
   * @param sort
   */
  public sortClients(sort: string): void {
    this._sortType = sort;
    this.clients.sort(this.compare.bind(this));
    this.updateClientList([...this.clients]);
  }

  private compare(a: IClient, b: IClient): number {
    switch (this._sortType) {
      case 'name':
        return this.sortByValues(a.name, b.name);
      case 'surname':
        return this.sortByValues(a.surname, b.surname);
      case 'email':
        return this.sortByValues(a.email, b.email);
      case 'phone':
        return this.sortByValues(a.phone, b.phone);
      default:
        return 0;
    }
  }

  private sortByValues(a: string | number, b: string | number): number {
    return (a < b ? -1 : 1);
  }

  /**
   * Обновление списка клиентов
   * @param clients
   */
  public updateClientList(clients: IClient[]): void {
    this.clientsSubject.next([...this.clients]);
    localStorage.setItem('clients', JSON.stringify(this.clients));
  }

  /**
   * Добавление нового клиента
   * @param client
   */
  public addClient(client: IClient): void {
    this.clients.push(client);
    this.updateClientList([...this.clients]);
  }

  /**
   * Редактирование клиента
   * @param client
   */
  public editClient(client: IClient): void {
    const clientIndex: number = this.clients.findIndex(value => value.email === client.email);
    if (clientIndex !== -1) {
      this.clients[clientIndex] = client;
      this.updateClientList([...this.clients]);
    }
  }

  /**
   * Удаление клиента/ов
   * @param clients
   */
  public deleteClients(clients: IClient[]): void {
    this.clients = this.clients.filter(client => !clients.includes(client));
    this.updateClientList([...this.clients]);

    if (this.clients.length === 0) {
      this.fetchClients();
    }
  }

  /**
   * Отписка
   */
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
