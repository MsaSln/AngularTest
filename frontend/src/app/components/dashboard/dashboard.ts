import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, User } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: Auth, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
