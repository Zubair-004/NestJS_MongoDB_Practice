import * as mongoose from 'mongoose';

export const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
});
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
}
