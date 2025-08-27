import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';


@Controller('products')
export class ProductsController {
  constructor() { }

  @Post()
  createProduct() {
    return 'Product created';
  }

  @Get()
  findAllProducts() {
    return 'Esta funtion retorna todos os produtos';
  }

  @Get(':id')
  findProductById(@Param('id') id: string) {
    return 'Esta funtion retorna um produto # ' + id;
  }

  @Patch(':id')
  pacthProductById(@Param('id') id: string) {
    return 'Esta funtion atualiza um produto # ' + id;
  }

  @Delete(':id')
  deleteProductById(@Param('id') id: string) {
    return 'Esta funtion deleta um produto # ' + id;
  }
}
