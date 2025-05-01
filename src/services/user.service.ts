import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface UserPreferences {
  theme: string;
}

export interface User {
  fullName: string;
  username: string;
  email: string;
  role: string;
  joinDate: Date;
  location: string;
  bio: string;
  website: string;
  avatar: string;
  social: {
    twitter: string;
    github: string;
    linkedin: string;
  };
  preferences?: UserPreferences;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  updateProfile(userData: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, userData);
  }

  changePassword(passwordData: PasswordChangeData): Observable<any> {
    return this.http.put(`${this.apiUrl}/password`, passwordData);
  }

  updatePreferences(preferences: UserPreferences): Observable<any> {
    return this.http.put(`${this.apiUrl}/preferences`, preferences);
  }
} 