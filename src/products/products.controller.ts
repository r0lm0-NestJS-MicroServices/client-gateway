import { BadRequestException, Controller, Delete, Get, Inject, InternalServerErrorException, Param, ParseIntPipe, Patch, Post, Query, Body } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  logger: any;
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productClient: ClientProxy
  ) { }

  @Post()
  createProduct(@Body() createProductDto: any) {
    return this.productClient.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productClient.send({ cmd: 'find_all_products' }, paginationDto);
  }

  @Get(':id')
  async findProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productClient.send({ cmd: 'find_product_by_id' }, { id });
  }

  @Patch(':id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Query() updateProductDto: any) {
    const dataToSend = { id, ...updateProductDto };
    return this.productClient.send({ cmd: 'update_product' }, dataToSend);
  }

  @Delete(':id')
  deleteProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productClient.send({ cmd: 'delete_product' }, { id });
  }
}
