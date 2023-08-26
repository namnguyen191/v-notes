import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { frontendCoreRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(frontendCoreRoutes)],
})
export class FrontendCoreModule {}
