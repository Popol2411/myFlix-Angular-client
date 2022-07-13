import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://myflixdbpopol.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }
 /**
  * calls API end-point to register a new user
  * @param userDetails {any}
  * @returns a new user object in json format
  */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + `users`, userDetails).pipe(
    catchError(this.handleError)
    );
  }

  /**
   * calls API end-point to log a user in
   * @param userDetails 
   * @returns user data in json format
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
    .post(apiUrl + 'login', userDetails)
    .pipe(catchError(this.handleError)
    );
  }

  /**
   * calls API end-point to get all movie
   * @returns all movies in json format
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      catchError(this.handleError)
      )
    ;
  }

  /**
   * calls API end-point to get a single movie
   * @returns a single movie in json format
   */
  getOneMovie(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/:movieId', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    })
    .pipe(catchError(this.handleError)
    );
  }

  /**
   * calls API end-point to get detail of a director
   * @returns a director in json format
   */
  getDirector(): Observable<any> {
    const token=localStorage.getItem('token');
    return this.http.get(apiUrl +'director', {headers: new HttpHeaders(
      {
      Authorization: 'Bearer' + token,
    })
  })
  .pipe(catchError(this.handleError)
    );
  }

  /**
   * calls API end-point to get detail of a genre
   * @returns a genre in json format
   */
  getGenre(): Observable<any> {
    const token=localStorage.getItem('token');
    return this.http.get(apiUrl +'genre', {headers: new HttpHeaders(
      {
      Authorization: 'Bearer' + token,
    })
  })
  .pipe(catchError(this.handleError)
    );
  }

 /**
  * calls API end-point to get detail of a user
  * @returns a user info in json format
  */
  getUser(): Observable<any> {
    const token=localStorage.getItem('token');
    return this.http.get(apiUrl +'profile', {headers: new HttpHeaders(
      {
      Authorization: 'Bearer' + token,
    })
  })
  .pipe(catchError(this.handleError)
    );
  }

/**
 * calls API end-point to get a user's favorite movie list
 * @returns an array of favorite movie of a user in json format
 */
getFavoriteMovies(): Observable<any> {
  const token=localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return this.http.get(apiUrl +`users/${user}/favorite`, {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
      })
    })
  .pipe(catchError(this.handleError)
  );
}

  /**
   * calls API end-point to add a specific movie to the user's favorites
   * @param id {string}
   * @returns the update user's list of favorite movies
   */
 public addFavoriteMovies(id:any): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http.post(apiUrl + `users/${user}/favorite/${id}`, 
    {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
    .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * calls API end-point to remove a specific movie to the user's favorites
   * @param id {string}
   * @returns the update user's list of favorite movies
   */
  deleteFavoriteMovies(id:string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
    .delete(apiUrl + `users/${user}/favorite/${id}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
    .pipe(catchError(this.handleError));
  }

  /**
   * calls API end-point to get a logged in user's data
   * @returns user's data
   */
  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
    .get(apiUrl + `users/${user}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
    .pipe(catchError(this.handleError));
  }

  /**
   * calls API end-point to edit user's data
   * @param userData {object}
   * @returns  user's updated data in json format
   */
  editUserProfile(userData:object): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
    .put(apiUrl + `users/${user}`, userData, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
    .pipe(catchError(this.handleError));
  }

 /**
  * calls API end-point to remove current user from the database
  * @returns delete status
  */
  deleteUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
    .delete(apiUrl + `users/${user}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
    .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

// non-typed response extraction
private extractResponseData(data: any | Object): any {
  return data || {};
}

private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
    'Something bad happened; please try again later.');
  }
}