import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { frontendAuthRoutes } from './lib.routes';
import { AuthService } from './services/auth.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(frontendAuthRoutes),
    HttpClientModule,
  ],
  providers: [AuthService],
})
export class FrontendAuthModule {}
