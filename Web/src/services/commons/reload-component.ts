import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ReloadComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {}

  reloadComponent(self: boolean, urlToNavigateTo?: string) {

    const url = self ? this.router.url : urlToNavigateTo;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/${url}`]).then(() => {
      })
    })

  }

  reloadPage() {
    window.location.reload()
  }

}
