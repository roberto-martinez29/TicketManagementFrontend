import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from '../../services/admin-service';
import { Admin } from '../../interfaces/admin';

@Component({
  selector: 'app-login-admin',
  imports: [FormsModule],
  templateUrl: './login-admin.html',
  styleUrl: './login-admin.css',
})
export class LoginAdmin {
  constructor(private adminService: AdminService, private router: Router, private location: Location) { }

  adminFilter: Admin = new Admin();

  btnLogin() {
    this.adminService.login(this.adminFilter).subscribe({
      next: (data) => {
        console.log('Admin encontrado:', data);
        this.adminService.setSessionActive();
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        console.error('Error o no encontrado', err);
        alert('Verifique sus datos, no se encontró el usuario.');
      }
    });
  }
  goBack() {
    this.location.back();
  }

}
