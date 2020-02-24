import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { AuthService } from '../services/auth.service';
import { UiComponent } from '../common/ui/ui.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    
    RegisterPageRoutingModule
  ],
  providers:[AuthService,UiComponent],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
