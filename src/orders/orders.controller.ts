import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query, ParseUUIDPipe } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDER_SERVICE } from 'src/config';
import { catchError, firstValueFrom } from 'rxjs';
import { OrderPaginationDto } from './dto';

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
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.orderClient.send({ cmd: 'find_all_orders' }, orderPaginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.orderClient.send({ cmd: 'find_order_by_id' }, { id })
      )
      return order
    } catch (error) {
      throw new RpcException(error);
    }

  }


}
