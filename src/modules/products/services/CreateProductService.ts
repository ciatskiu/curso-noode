import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import Product from "../typeorm/entities/Product";
import { ProductRepository } from "../typeorm/repositories/ProductsRepository";
import RedisCache from "@shared/cache/RedisChache";

interface IRequest{
  name: string;
  price: number;
  quantity: number;
}

export default class CreateProductService{

  public async execute({name, price, quantity}: IRequest) : Promise<Product>{
    const productsRepository = getCustomRepository(ProductRepository);
    const productExists = await productsRepository.findByName(name);
    const redisCache = new RedisCache();

    if(productExists){
      throw new AppError('There is already one product with this name');
    }

    const product = productsRepository.create({
      name,
      price,
      quantity,
    });

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    await productsRepository.save(product);

    return product;
  }
}
