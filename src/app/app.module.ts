import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { SampleComponent } from './components/sample/sample.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpLoaderFactory, SharedModule } from './modules/shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { EditCampaignsComponent } from './components/edit-campaigns/edit-campaigns.component';
import { HeadersInterceptor } from './interceptors/headers.interceptor';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewDocumentComponent } from './components/new-document/new-document.component';
import { AuthGuard } from './_guard/auth.guard';
import { NeedHelpComponent } from './components/need-help/need-help.component';
import { ChatComponent } from './components/chat/chat.component';
import { WhatNextComponent } from './components/what-next/what-next.component';
import { SignInWithGoogleComponent } from './components/sign-in-with-google/sign-in-with-google.component';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AlertsComponent,
    SampleComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    ConfirmComponent,
    NewDocumentComponent,
    NeedHelpComponent,
    WhatNextComponent,
    SignInWithGoogleComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
    AuthGuard
  ],
  exports: [
    EditCampaignsComponent,
    ChatComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
