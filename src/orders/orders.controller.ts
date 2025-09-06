import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDER_SERVICE } from 'src/config';
import { catchError } from 'rxjs';

@Controller('orders')
export class OrdersController {
  logger: any;
  constructor(
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy
  ) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderClient.send({ cmd: 'create_order' }, createOrderDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Get()
  findAll() {
    return this.orderClient.send({ cmd: 'find_all_orders' }, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.orderClient.send({ cmd: 'find_order_by_id' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }


}
