import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userSub!: Subscription;
  isLogin = false;


  constructor(private dataStorageService: DataStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    // if expiration date will be outdated, automatically user will change to null and logout
    this.userSub = this.authService.user.subscribe(user => {
      console.log(user, !!user)
      this.isLogin = !!user;
    })
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSave() {
    this.dataStorageService.onSaveRecipies();
  }

  onFetch() {
    this.dataStorageService.onFetchRecipes().subscribe();
  }

  logout(){
    this.authService.logout();
  }


}
