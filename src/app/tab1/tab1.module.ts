import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { TranslateModule } from '@ngx-translate/core';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { UiComponent } from '../common/ui/ui.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    PipesModule,
    IonicModule,
    CommonModule,
    FormsModule,
    
    TranslateModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }])
  ],
  declarations: [Tab1Page],
  providers: [StreamingMedia,NativeAudio,UiComponent]
})
export class Tab1PageModule { }
