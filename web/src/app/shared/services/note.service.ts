import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class NoteService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  search(criteria) {
    return this.http
      .post(environment.apiUrl + "/note/search", criteria)
      .toPromise();
  }

  save(data) {
    data.username = this.authService.getUser().username;

    return this.http.post(environment.apiUrl + "/note/save", data).toPromise();
  }

  deleteNote(data) {
    data.username = this.authService.getUser().username;

    return this.http
      .post(environment.apiUrl + "/note/deleteNote", data)
      .toPromise();
  }

  get(code) {
    let criteria = {
      id: code,
    };
    return this.http
      .post(environment.apiUrl + "/note/get", criteria)
      .toPromise();
  }
}
