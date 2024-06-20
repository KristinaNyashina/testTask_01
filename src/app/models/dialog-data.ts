import { IClient } from "./client";

export interface DialogData {
  action: 'add' | 'edit' | 'delete';
  client?: IClient;
  selectedClients?: IClient[];
}
