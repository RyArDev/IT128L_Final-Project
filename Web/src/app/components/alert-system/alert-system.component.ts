import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-alert-system',
  templateUrl: './alert-system.component.html',
  styleUrls: ['./alert-system.component.css']
})
export class AlertSystemComponent implements OnInit, OnChanges {

  @Input() message: string | null = null;
  @Input() success: boolean = false;
  @Input() error: boolean = false;
  private alertTimer: any;

  constructor() { }

  ngOnInit(): void {
    this.startAlertTimer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetAlertTimer();
  }

  async closeAlert(): Promise<void> {
    this.message = null;
    if (this.alertTimer) {
      await clearTimeout(this.alertTimer);
      this.alertTimer = null;
    }
  }

  async startAlertTimer(): Promise<void> {
    if (this.alertTimer) {
      await clearTimeout(this.alertTimer);
      this.alertTimer = null;
    }
    this.alertTimer = await setTimeout(() => {
      this.closeAlert();
    }, 5000);
  }

  resetAlertTimer(): void {
    if (this.alertTimer) {
      clearTimeout(this.alertTimer);
      this.alertTimer = null;
    }
    this.startAlertTimer();
  }

}
