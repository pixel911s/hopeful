import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if (this.authService.getUser().token) {
    //   request = request.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${this.authService.getUser().token}`,
    //       "Accept-Language": "th_TH",
    //     },
    //   });
    // }

    // request.clone(getRequestOptions());

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.toastr.error("❌❌ Internal Server Error ❌❌");
        } else if (error.status === 417) {
          this.toastr.show(error.error.respMsg);
        } else if (error.status === 429) {
          this.toastr.show("ทำรายการเกินกำหนดกรุณาลองใหม่อีกครั้งภายหลัง.");
        } else if (error.status === 401) {
          console.log(error);
          this.toastr.show(error.error);
        }

        this.spinner.hide();
        return throwError(error);
      })
    );

    // return next.handle(request).pipe(err => {

    //   if (err. === 403) {
    //     this.messageService.errorPopup('ไม่สามารถเชื่อมต่อ Service ได้ กรุณาลองใหม่อีกครั้ง.');
    //   }

    //   this.blockUI.stop();

    //   return throwError(err)

    // })
  }
}
