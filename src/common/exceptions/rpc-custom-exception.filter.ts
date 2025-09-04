import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
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

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        // Si es una RpcException
        if (exception instanceof RpcException) {
            const rpcError = exception.getError();

            if (typeof rpcError === 'object' && rpcError !== null && 'status' in rpcError && 'message' in rpcError) {
                const status = (rpcError as any).status;
                return response.status(status).json({
                    statusCode: status,
                    message: (rpcError as any).message,
                    error: (rpcError as any).error || this.getErrorType(status)
                });
            }

            if (typeof rpcError === 'string') {
                return response.status(400).json({
                    statusCode: 400,
                    message: rpcError,
                    error: 'Bad Request'
                });
            }

            if (typeof rpcError === 'object' && rpcError !== null) {
                return response.status(400).json({
                    statusCode: 400,
                    message: 'Error interno del microservicio',
                    error: 'Bad Request'
                });
            }
        }

        // Si es un error de conectividad con microservicios
        if (exception.message && exception.message.includes('InvalidMessageException')) {
            return response.status(503).json({
                statusCode: 503,
                message: 'Servicio no disponible',
                error: 'Service Unavailable'
            });
        }

        // Si es un error de conexión
        if (exception.message && exception.message.includes('ECONNRESET')) {
            return response.status(503).json({
                statusCode: 503,
                message: 'Error de conexión con el microservicio',
                error: 'Service Unavailable'
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