import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import UsersRepository from "../typeorm/repositories/UsersRespository";
import UserTokensRepository from "../typeorm/repositories/UsersTokensRespository";
import EtherealMail from '@config/mail/EtherealMail';
import path from 'path';

interface IRequest{
  email: string;
}

export default class SendForgotPasswordEmailService{

  public async execute({ email }: IRequest) : Promise<void>{
    const usersRepository = getCustomRepository(UsersRepository);
    const usersTokensRespository = getCustomRepository(UserTokensRepository);

    const user = await usersRepository.findByEmail(email);
    if(!user){
      throw new AppError('User does not exists.');
    }

    const {token} = await usersTokensRespository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');

    await EtherealMail.sendMail({
      to: {name: user.name, email: user.email},
      subject: '[API VENDAS] Recuperação de Senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`
        }

      }
    })


  }
}
