import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadFileService } from '../upload-file.service';
import { API } from '../../app.api';
import { FileUploadInterface } from './file-upload.interface';
import { FileUploadServiceInterface } from './file-upload-service.interface';
import { FileUploadService } from './file-upload.service';
import { ImageViewerComponent } from '../../shared/image-viewer/image-viewer.component';
import { GALLERY_IMAGE } from 'ngx-image-gallery';
import { LoggerService } from '../logger.service';
import { MessageLoadingComponent } from './message-loading/message-loading';
import { MessageLoadingService } from './message-loading/message-loading.service';

@Component({
  selector: 'cb-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  @ViewChild(ImageViewerComponent, { static: false }) imageViewer: ImageViewerComponent;
  images: GALLERY_IMAGE[] = []
  fileForm: FormGroup
  progress: number
  @Input() max: number = null
  @Input() readOnly: boolean = false
  @Input() readOnlyMessage: string = 'Não é possível alterar, somente leitura'
  @Input() properties: any
  @Input() accept: String[] = ['application/pdf', 'image/jpeg']
  @Input() typeForm: string
  @Input() files: FileUploadInterface[] = []
  @Input() fileServiceInterface: FileUploadServiceInterface
  @Output() uploadEmitter: EventEmitter<boolean> = new EventEmitter()

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private fileUploadService: FileUploadService,
    private messageLoadingService: MessageLoadingService,
    private logger: LoggerService,
    private uploadFileService: UploadFileService) { }

  ngOnInit() {
    if( [null, undefined].indexOf(this.fileServiceInterface) >= 0) {
      this.logger.error('Você deve passar um fileServiceInterface válido para o componente file-upload.')
      return;
    }

    this.fileForm = this.formBuilder.group({
      files: this.formBuilder.array([]),
    })

    this.files.forEach((fileInterface) => {
      this.addFile(fileInterface)
    })
  }

  openModal(i: number) {
    this.imageViewer.openGallery(i)
  }

  previewFile(fileInterface: FileUploadInterface) {
    let url = this.fileServiceInterface.previewFileUrl(fileInterface)
    window.open(`${API}/${url}`, '_blank')
  }

  download(fileInterface: FileUploadInterface, filename: string, type: String) {
    let url = this.fileServiceInterface.downloadUrl(fileInterface)

    this.fileUploadService.download(url).subscribe((blob) => {
      let fileUrl = URL.createObjectURL(blob)
      //window.open(fileUrl, '_blank')
      let anchor = document.createElement("a");
      anchor.download = filename;
      anchor.href = fileUrl;
      anchor.target = '_blank'
      anchor.click();
    })
  }

  addFile(fileInterface: FileUploadInterface) {
    let image: string
    const files = <FormArray>this.fileForm.controls.files

    if(fileInterface.type == 'pdf') {
      image = '/assets/images/icons/pdf.png'
    } else {
      image = this.fileServiceInterface.viewUrl(fileInterface)
    }

    files.push(this.formBuilder.group({
      id: this.formBuilder.control(fileInterface.id),
      original_name: this.formBuilder.control({ value: (fileInterface ? fileInterface.original_name : ''), disabled: (this.typeForm === 'show' ? true : false) }),
      image: this.formBuilder.control(image),
      type: this.formBuilder.control(fileInterface.type)
    }))

    this.images.push({
      altText: '',
      extUrl: `${API}/${this.fileServiceInterface.previewFileUrl(fileInterface)}`,
      title: fileInterface.original_name,
      url: image
    })
  }

  getImageUrl(group: FormGroup) {
    return group.controls.image.value
  }

  getType(group: FormGroup) {
    return group.controls.type.value
  }

  deleteFile(i) {
    if(this.readOnly) {
      this.snackbar.open(this.readOnlyMessage, '', { duration: 3000 })
      return
    }

    let snackbar = this.snackbar.open('Aguarde, estamos removendo...')
    const files = <FormArray>this.fileForm.controls.files
    let fileInterface = <FileUploadInterface> files.at(i).value
    this.images.splice(i, 1)

    this.fileServiceInterface.delete(fileInterface.id).subscribe((data) => {
      snackbar.dismiss()
      if(data.status == false) {
        this.snackbar.open(data.message, '', { duration: 3000 })
        return
      }

      files.removeAt(i)
    })
  }

  uploadFile(inputFile: HTMLInputElement) {
    if(this.readOnly) {
      this.snackbar.open(this.readOnlyMessage, '', { duration: 3000 })
      return
    }

    let snackbar = this.snackbar.open('Aguarde enquanto carregamos os arquivos. O upload pode demorar dependendo do tamanho e quantidade de arquivos...')

    for(let i = 0; i < inputFile.files.length; i++) {
      if(this.accept.indexOf(inputFile.files.item(i).type) < 0) {
        snackbar.dismiss()
        snackbar = this.snackbar.open('Só é permitido fazer upload de ' + this.accept.join(', '), '', {
          duration: 5000
        })
        return;
      }
    }

    snackbar.dismiss()
    snackbar = this.snackbar.openFromComponent(MessageLoadingComponent)
    this.messageLoadingService.counter.next(1)

    this.uploadFileService.uploadFile(inputFile, (percentDone) => {
      this.progress = percentDone
      this.messageLoadingService.counter.next(percentDone.toFixed(0))
    }, (response) => {
      let files: FileUploadInterface[] = []

      for(let i = 0; i < inputFile.files.length; i++) {
        let fileInterface = Object.assign(this.fileServiceInterface.create(), this.properties)
        fileInterface.original_name = inputFile.files[i].name
        files.push(fileInterface)
      }

      snackbar.dismiss()
      snackbar = this.snackbar.open('Salvando arquivos e carregando para visualização...')

      let url = this.fileServiceInterface.saveMultipleUrl()
      this.fileUploadService.saveMultiple(files, url).subscribe((data) => {
        snackbar.dismiss()
        if(data.status == false) {
          this.snackbar.open(data.message, '', { duration: 3000 })
          return
        }

        let files = <FileUploadInterface[]> data.files
        files.forEach((fileInterface) => {
          this.addFile(fileInterface)
          this.files.push(fileInterface)
        })

        this.uploadEmitter.emit(true)
      })
    }).subscribe(() => {})
  }

  getFilesControls() {
    return (<FormArray>this.fileForm.controls.files).controls
  }

}
