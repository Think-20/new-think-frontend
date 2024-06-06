import { FileUploadInterface } from "./file-upload.interface";
import { Observable } from "rxjs";

export interface FileUploadServiceInterface {
  saveMultipleUrl(): string
  previewFileUrl(file: FileUploadInterface): string
  downloadUrl(file: FileUploadInterface): string
  viewUrl(file: FileUploadInterface): string
  delete(id): Observable<any>
  create(): FileUploadInterface
}
