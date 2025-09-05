import { Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, Body } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto, UpdateProductDto } from './dto';


@Controller('products')
export class ProductsController {
  logger: any;
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productClient: ClientProxy
  ) { }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productClient.send({ cmd: 'create_product' }, createProductDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productClient.send({ cmd: 'find_all_products' }, paginationDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Get(':id')
  async findProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productClient.send({ cmd: 'find_product_by_id' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Patch(':id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productClient.send({ cmd: 'update_product' }, { id, ...updateProductDto })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        })
      );
  }

  @Delete(':id')
  deleteProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productClient.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }
}
