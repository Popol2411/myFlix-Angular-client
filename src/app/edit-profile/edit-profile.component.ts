import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  @Input() userData: any = {};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<EditProfileComponent>,
    public snackBar: MatSnackBar,
    public router: Router,
  ) { }

  ngOnInit(): void {
  }


    /**
   * allows user to edit their data, such as Username, password, email, and birthday
   * @memberof EditProfileComponent
   * @returns userData - the user details
   */
     editUser(): void {
      // console.log(this.userData);
      this.fetchApiData.editUser(this.userData).subscribe((result) => {
        this.dialogRef.close();
        // console.log(result);
        // if result is successful, show a snackbar
        this.snackBar.open('User details updated', '', {
          duration: 2000,
        });
        // navigate to the profile page
        this.router.navigate(['/profile']);
        // reload the component
        location.reload();
      });
    }
  }