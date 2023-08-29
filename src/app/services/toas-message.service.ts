import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
export enum ToastMessageSeverity {

    SEVERITY_INFO = "info",
    SEVERITY_WARN = "warn",
    SEVERITY_ERROR = "error",
    SEVERITY_SUCCESS = "success"

};


export enum GlobalToasts {

    TOAST_LOGIN = "toastLogin",

    TOAST_DASHBOAD = "toastDasboard"

};
@Injectable({
  providedIn: 'root'
})
export class ToasMessageService {

  constructor(private messageService: MessageService) { }
  public showToastMessage(key: string, severity: ToastMessageSeverity, summary: string, detail: string) {

    this.messageService.add({ key, severity, summary, detail });
}
}
