import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AdminService } from '../../services/admin-service';

@Component({
    selector: 'app-admin-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './admin-navbar.html',
    styleUrl: './admin-navbar.css',
})
export class AdminNavbar {
    constructor(public adminService: AdminService, private router: Router) { }

    logout(): void {
        this.adminService.logout();
        this.router.navigate(['']);
    }
}