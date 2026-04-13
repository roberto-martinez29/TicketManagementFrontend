import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgxCaptchaModule } from 'ngx-captcha';
import { AdminService } from '../../services/admin-service';
import { Admin } from '../../interfaces/admin';

@Component({
  selector: 'app-login-admin',
  imports: [FormsModule, NgxCaptchaModule],
  templateUrl: './login-admin.html',
  styleUrl: './login-admin.css',
})
export class LoginAdmin {
  constructor(private adminService: AdminService, private router: Router, private location: Location) { }

  adminFilter: Admin = new Admin();
  recaptchaSiteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
  recaptchaToken: string = '';
  captchaError: string = '';

  onCaptchaSuccess(token: string) {
    this.recaptchaToken = token;
    this.captchaError = '';
  }

  onCaptchaExpired() {
    this.recaptchaToken = '';
    this.captchaError = 'El reCAPTCHA expiro. Vuelva a verificar.';
  }

  btnLogin() {
    if (!this.recaptchaToken) {
      this.captchaError = 'Debe completar el reCAPTCHA para continuar.';
      return;
    }

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
