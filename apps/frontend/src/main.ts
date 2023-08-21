import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

const requiredEnvs = new Set<string>(['NX_API_URL']);

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`Missing env variable ${env}`);
  }
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
