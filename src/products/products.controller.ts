import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';


@Controller('products')
export class ProductsController {
  constructor() { }

  @Post()
  createProduct() {
    return 'Esta función crea un producto';
  }

  @Get()
  findAllProducts() {
    return 'Esta funtion retorna todos los produtos';
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
