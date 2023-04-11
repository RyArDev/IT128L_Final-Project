import { HttpClient } from '@angular/common/http';
import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import PROXY_CONFIG from '../../config/proxy.conf';

@Injectable({
  providedIn: 'root'
})
export class ImageUpload implements OnChanges {

  public imageName: string;
  public imageSrc: File;
  blob: Blob;

  constructor(private http: HttpClient) {

    var arrayBuffer = new ArrayBuffer(100);
    var uint8Array = new Uint8Array(arrayBuffer);
    for (var i = 0; i < 100; i++) {
      uint8Array[i] = i;
    }

    this.blob = new Blob([uint8Array], { type: "image/png" });

    this.imageName = "";
    this.imageSrc = new File([this.blob as BlobPart], "");

  }

  ngOnChanges(simplgeChanges: SimpleChanges): void {

    this.imageName = "";
    this.imageSrc = new File([this.blob as BlobPart], "");

  }

  public onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.imageName = event.target.files[0].name;
      this.imageSrc = event.target.files[0]
    }
  }

  public uploadProfilePicture(file: File, userId: number) {

    let fileToUpload: File = file;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    return this.http.post(`${PROXY_CONFIG.target}/file/upload/profile/${userId}`, formData);
  }
}
