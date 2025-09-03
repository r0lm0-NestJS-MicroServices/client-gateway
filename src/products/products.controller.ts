import { Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';


@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productClient: ClientProxy
  ) { }

  @Post()
  createProduct() {
    return 'Esta función crea un producto';
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productClient.send({ cmd: 'find_all_products' }, paginationDto);
  }

  @Get(':id')
  findProductById(@Param('id') id: string) {
    return 'Esta funtion retorna um produto # ' + id;
  }

  @Patch(':id')
  patchProductById(@Param('id') id: string) {
    return 'Esta función actualiza un producto # ' + id;
  }

  @Delete(':id')
  deleteProductById(@Param('id') id: string) {
    return 'Esta función elimina un producto # ' + id;
  }
}
