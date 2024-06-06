import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { GALLERY_IMAGE, GALLERY_CONF, NgxImageGalleryComponent } from 'ngx-image-gallery';

@Component({
  selector: 'cb-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent implements OnInit, AfterViewInit {

  @Input() openWhenInit: boolean = false

  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.ngxImageGallery.images = this.images

    if(this.openWhenInit)
      this.openGallery()
  }

  // get reference to gallery component
  @ViewChild(NgxImageGalleryComponent, { static: false }) ngxImageGallery: NgxImageGalleryComponent;

  // gallery configuration
  conf: GALLERY_CONF = {
    imageOffset: '0px',
    showDeleteControl: false,
    showImageTitle: true
  };

  // gallery images
  @Input() images: GALLERY_IMAGE[] = []

  // METHODS
  // open gallery
  openGallery(index: number = 0) {
    this.ngxImageGallery.open(index);
  }

  // close gallery
  closeGallery() {
    this.ngxImageGallery.close();
  }

  // set new active(visible) image in gallery
  newImage(index: number = 0) {
    this.ngxImageGallery.setActiveImage(index);
  }

  // next image in gallery
  nextImage(index: number = 0) {
    this.ngxImageGallery.next();
  }

  // prev image in gallery
  prevImage(index: number = 0) {
    this.ngxImageGallery.prev();
  }

  /**************************************************/

  // EVENTS
  // callback on gallery opened
  galleryOpened(index) {
    //console.info('Gallery opened at index ', index);
  }

  // callback on gallery closed
  galleryClosed() {
    //console.info('Gallery closed.');
  }

  // callback on gallery image clicked
  galleryImageClicked(index) {
    //console.info('Gallery image clicked with index ', index);
  }

  // callback on gallery image changed
  galleryImageChanged(index) {
    //console.info('Gallery image changed to index ', index);
  }

  // callback on user clicked delete button
  deleteImage(index) {
    //console.info('Delete image at index ', index);
  }

}
