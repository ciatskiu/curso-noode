import User from "@modules/users/typeorm/entities/User";
import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import UsersRepository from "../typeorm/repositories/UsersRespository";
import { compare } from "bcryptjs";
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

interface IRequest{
  email: string;
  password: string;
}

interface IResponse{
  user: User;
  token: string;
}

export default class CreateSessionsService{
  public async execute({email, password}: IRequest) : Promise<IResponse>{
    const usersRepository = getCustomRepository(UsersRepository);
    const user  = await usersRepository.findByEmail(email);
    if(!user){
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordConfirmed = await compare(password, user.password);
    if(!passwordConfirmed){
      throw new AppError('Incorrect email/passowrd combination.', 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id, expiresIn: authConfig.jwt.expiresIn
    })

    return {user, token};
  }
}
