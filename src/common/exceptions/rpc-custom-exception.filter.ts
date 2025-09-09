import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const rpcError = exception.getError();

        if (rpcError.toString().includes('Empy respose')) {
            return response.status(500).json({
                status: 500,
                message: 'Empty response from server',
            });
        }

        if (
            typeof rpcError === 'object' &&
            'status' in rpcError &&
            'message' in rpcError
        ) {
            const errorObj = rpcError as { status: any; message: any };
            const status = isNaN(+errorObj.status) ? 400 : +errorObj.status;
            return response.status(status).json(rpcError);
        }

        response.status(400).json({
            status: 400,
            message: rpcError,
        });
    }
}