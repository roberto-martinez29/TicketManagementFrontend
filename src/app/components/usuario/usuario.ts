import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserNavbar } from '../user-navbar/user-navbar';

@Component({
  selector: 'app-usuario',
  imports: [UserNavbar],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario {
  constructor(private router: Router, private location: Location) { }

  goNuevo() {
    this.router.navigate(['registro']);
  }
  goModificar() {
    this.router.navigate(['usuario/login']);
  }
  goBack() {
    this.location.back();
  }
}
