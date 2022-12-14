import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import Product from "../typeorm/entities/Product";
import { ProductRepository } from "../typeorm/repositories/ProductsRepository";
import RedisCache from "@shared/cache/RedisChache";

export default class ListProductService{

  public async execute() : Promise<Product[]>{
    const productsRepository = getCustomRepository(ProductRepository);

    const redisCache = new RedisCache();

    let products = await redisCache.revover<Product[]>(
      'api-vendas-PRODUCT_LIST');

    if(!products){
      products = await productsRepository.find();
      await redisCache.save('api-vendas-PRODUCT_LIST', products);
    }
    return products;
  }
}
