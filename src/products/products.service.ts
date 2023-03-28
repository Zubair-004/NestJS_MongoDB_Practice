import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Model } from 'mongoose';

import { Product } from './products.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(title: string, desc: string, price: number) {
    const prodId = Math.random().toString();
    const newProduct = new this.productModel({
      title,
      description: desc,
      price,
    });
    const result = await newProduct.save();
    console.log(result);
    return result.id as string;
  }

  async getProducts() {
    const products = await this.productModel.find();
    return products as Product[];
  }

  getSingleProduct(productId: string) {
    const product = this.findProduct(productId);
    return product;
  }

  async updateProduct(
    productId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);
    if (title) {
      updatedProduct.title = title;
    }
    if (desc) {
      updatedProduct.description = desc;
    }
    if (price) {
      updatedProduct.price = price;
    }
    await this.productModel.updateOne(
      { _id: updatedProduct.id },
      { $set: { ...updatedProduct } },
    );
    return {
      status: 'success',
      message: 'Product updated successfully',
    };
  }

  async deleteProduct(prodId: string) {
    await this.productModel.deleteOne({ _id: prodId });
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id);
    } catch {
      throw new NotFoundException('Could not find product.');
    }
    if (!product) {
      throw new NotFoundException('Product ID is not valid.');
    }
    return product;
  }
}
