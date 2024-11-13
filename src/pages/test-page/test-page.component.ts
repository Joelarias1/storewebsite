import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface UserInfo {
  fullName: string;
  username: string;
  email: string;
  joinDate: Date;
}

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css'
})
export class TestPageComponent implements OnInit {
  userInfo: UserInfo | null = null;
  currentTime: Date = new Date();
  greeting: string = '';

  constructor(private router: Router) {
    const state = history.state;
    console.log('Received state:', state);

    this.userInfo = {
      fullName: state?.fullName || 'Usuario',
      username: state?.username || 'usuario123',
      email: state?.email || 'usuario@ejemplo.com',
      joinDate: new Date()
    };
  }

  ngOnInit() {
    this.setGreeting();
    setInterval(() => {
      this.currentTime = new Date();
      this.setGreeting();
    }, 60000);
  }

  private setGreeting() {
    const hour = this.currentTime.getHours();
    if (hour >= 5 && hour < 12) {
      this.greeting = '¡Buenos días';
    } else if (hour >= 12 && hour < 18) {
      this.greeting = '¡Buenas tardes';
    } else {
      this.greeting = '¡Buenas noches';
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}