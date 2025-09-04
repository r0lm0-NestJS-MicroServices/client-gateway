import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
    private getErrorType(status: number): string {
        switch (status) {
            case 400: return 'Bad Request';
            case 401: return 'Unauthorized';
            case 403: return 'Forbidden';
            case 404: return 'Not Found';
            case 409: return 'Conflict';
            case 422: return 'Unprocessable Entity';
            case 500: return 'Internal Server Error';
            default: return 'Bad Request';
        }
    }

    catch(exception: RpcException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const rpcError = exception.getError();


        if (typeof rpcError === 'object' && rpcError !== null && 'status' in rpcError && 'message' in rpcError) {
            const status = (rpcError as any).status;
            return response.status(status).json({
                statusCode: status,
                message: (rpcError as any).message,
                error: (rpcError as any).error || this.getErrorType(status)
            });
        }

        // Si es un string o error simple
        if (typeof rpcError === 'string') {
            return response.status(400).json({
                statusCode: 400,
                message: rpcError,
                error: 'Bad Request'
            });
        }

        // Si es un objeto pero no tiene la estructura esperada
        if (typeof rpcError === 'object' && rpcError !== null) {
            return response.status(400).json({
                statusCode: 400,
                message: 'Error interno del microservicio',
                error: 'Bad Request'
            });
        }

        // Caso por defecto para cualquier otro tipo de error
        return response.status(500).json({
            statusCode: 500,
            message: 'Error interno del servidor',
            error: 'Internal Server Error'
        });
    }
}