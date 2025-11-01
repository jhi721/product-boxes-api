import {
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

@Injectable()
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (exception instanceof EntityNotFoundError) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        path: req.url,
        message: 'Entity not found',
      });
    }

    if (exception instanceof QueryFailedError) {
      const drv: any = (exception as any).driverError || {};
      const code = drv.code || drv.errno || drv.name;
      const constraint = drv.constraint;

      switch (code) {
        case '23505':
        case 'ER_DUP_ENTRY':
        case 1062:
          return res.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            path: req.url,
            message: 'Duplicate resource',
            meta: constraint ? { constraint } : undefined,
          });

        case '23503':
        case 'ER_NO_REFERENCED_ROW_2':
        case 1452:
          return res.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            path: req.url,
            message: 'Related entity missing',
          });

        case '23502':
          return res.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            path: req.url,
            message: 'A required field is missing',
          });

        case '40001':
        case '40P01':
          return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
            statusCode: HttpStatus.SERVICE_UNAVAILABLE,
            path: req.url,
            message: 'Temporary database conflict. Please retry.',
            retryable: true,
          });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        path: req.url,
        message: 'Database query failed',
      });
    }

    throw new InternalServerErrorException();
  }
}
