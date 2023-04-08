import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import PROXY_CONFIG from '../config/proxy.conf'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public forecasts?: WeatherForecast[];

  constructor(private http: HttpClient) {
    this.http.get<WeatherForecast[]>(PROXY_CONFIG.target + "/api/weatherforecast/forecasts").subscribe({
      next: (result) => {

        this.forecasts = result;

      }, error: (err: HttpErrorResponse) => {

          

      }

    });
  }

  title = 'Web';
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
