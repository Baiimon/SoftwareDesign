import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse() as any;

    const validationErrors = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message
      : [exceptionResponse.message];

    response.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errorCode: 'INCOMPLETE_DATA',
      message:
        'แจ้งเตือน: ข้อมูลไม่ครบถ้วน กรุณากรอกข้อมูล วัน เดือน ปี สถานที่ และงบประมาณ ให้สมบูรณ์',
      missingFields: validationErrors,
      timestamp: new Date().toISOString(),
    });
  }
}
