import { Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICES } from 'src/config';
import { CreateProductDto, UpdateProductDto, UpdateProductDto as updateProductDto } from './dto';

@Controller('products')
export class ProductsController {
  logger: any;
  constructor(
    @Inject(NATS_SERVICES) private readonly client: ClientProxy
  ) { }

  @Post()
  createProduct(@Query() createProductDto: CreateProductDto) {
    return this.client.send({ cmd: 'create_product' }, createProductDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'find_all_products' }, paginationDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Get(':id')
  async findProductById(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'find_product_by_id' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Patch(':id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Query() updateProductDto: UpdateProductDto) {
    return this.client.send({ cmd: 'update_product' }, { id, ...updateProductDto }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Delete(':id')
  deleteProductById(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }
}
