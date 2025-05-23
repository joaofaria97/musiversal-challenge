import { FileValidator } from '@nestjs/common';

export interface FileValidationOptions {
  fieldName: string;
  allowedMimeTypes: RegExp;
  maxSize: number;
}

export class FileTypeAndSizeValidator extends FileValidator<FileValidationOptions, Express.Multer.File> {
  constructor(options: FileValidationOptions) {
    super(options);
  }

  isValid(file: Express.Multer.File): boolean {
    if (file.fieldname !== this.validationOptions.fieldName) {
      return true; // Skip validation for other fields
    }
    return this.validationOptions.allowedMimeTypes.test(file.mimetype) && 
           file.size <= this.validationOptions.maxSize;
  }

  buildErrorMessage(): string {
    return `File must be a valid ${this.validationOptions.fieldName} with allowed MIME types and size limit`;
  }
} 