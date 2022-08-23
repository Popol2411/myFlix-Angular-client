import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  //Declaring the api url that will provide data for the client app
apiUrl = 'https://myflixdbpopol.herokuapp.com/';

  // Inject HttpClient module to constructor params
  constructor(private http: HttpClient) { }

  /**
   * calls API endpoint to register a new user
   * @param userDetails 
   * @returns a new user object in JSON format
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(this.apiUrl + 'users', userDetails)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * calls API endpoint to login an existing user
   * @param userDetails 
   * @returns data of the user in JSON format
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'login', userDetails)
      .pipe(
        catchError(this.handleError)
      );
  }


  /**
   * calls API endpoint to get data on all movies
   * @returns array of all movies in JSON format
   */
  getAllMovies(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getUserToken(),
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API endpoint to get data on a single movie specified by its title
   * @param title 
   * @returns JSON object holding movie data
   */
  getSingleMovie(title: any): Observable<any> {
    return this.http
      .get(this.apiUrl + `movies/${title}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getUserToken(),
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API endpoint to get data on a director
   * @param name 
   * @returns JSON obejct holding director data
   */
  getDirector(name: any): Observable<any> {
    return this.http
      .get(this.apiUrl + `/director/${name}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getUserToken(),
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API endpoint to get data on a genre
   * @param name 
   * @returns JSON object holding genre data
   */
  getGenre(name: any): Observable<any> {
    return this.http
      .get(this.apiUrl + `/genre/${name}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getUserToken(),
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API endpoint to get data on a single user
   * @returns JSON object holding data about the requested user
   */
  getUser(): Observable<any> {
      return this.http
      .get(this.apiUrl + `users/${this.getUserName()}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getUserToken(),
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API endpoint to get list of favorite movies of this user --> ENDPOINT TBD!! (Doesn't exist yet)
   * @returns list of the user's favorite movies in JSON format
   */
  getFavoriteMovies(): Observable<any> {
    return this.http
      .get(this.apiUrl + `users/${this.getUserName()}/movies`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getUserToken(),
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API endpoint to add a movie to the user's list of favorite movies
   * @param movieID 
   * @returns JSON object holding data about the updated user
   */
  addFavoriteMovie(movieID: any): Observable<any> {
    console.log('test token', this.getUserToken())
    return this.http
      .post(this.apiUrl + `users/${this.getUserName()}/movies/${movieID}`, {}, 
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getUserToken(),
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API endpoint to delete a movie from the user's list of favorite movies
   * @param movieID 
   * @returns JSON object holding data about the updated user
   */
  removeFavoriteMovie(movieID: any): Observable<any> {
    return this.http
      .delete(this.apiUrl + `users/${this.getUserName()}/movies/${movieID}`,  
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getUserToken(),
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API endpoint to allow user to update their user information
   * @param updateDetails 
   * @returns JSON object holding data about the updated user
   */
  editUser(updateDetails: any): Observable<any> {
    return this.http
      .put(this.apiUrl + `users/${this.getUserName()}`, updateDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getUserToken(),
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API endpoint to deregister an existing user
   * @returns	A success message indicating that the profile was successfully deleted.
   */
  deleteUser(): Observable<any> {
    return this.http
      .delete(this.apiUrl + `users/${this.getUserName()}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getUserToken(),
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }


  /**
   * extracts response data from HTTP response
   * @param res 
   * @returns response body or empty object
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * handles errors
   * @param error 
   * @returns error message
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occured:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error Body is: ${error.error}`
      );
    }
    return throwError(
      'Something bad happened; please try again later.'
    );
  }

  private getUserName() {
    return localStorage.getItem('user');
  }

  private getUserToken() {
    return localStorage.getItem('token');
  }

}