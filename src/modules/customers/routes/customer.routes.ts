import { Router } from 'express';
import {celebrate, Joi, Segments} from 'celebrate';
import CustomersController from '../controllers/CustomersController';
import isAuthenticadted from '@shared/http/middlewares/isAuthenticated';

const customersRouter = Router();
const customersController = new CustomersController();

customersRouter.use(isAuthenticadted);

customersRouter.get('/', customersController.index);

customersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {id: Joi.string().uuid().required()}
  }),
  customersController.show);

customersRouter.post('/',
celebrate({
  [Segments.BODY] : { name: Joi.string().required(),
  email: Joi.string().required()}
})
,customersController.create);

customersRouter.put('/:id',
celebrate({
  [Segments.BODY] : { name: Joi.string().required(),
    email: Joi.string().required()},
  [Segments.PARAMS]: {id: Joi.string().uuid().required(),}
}),
customersController.update);

customersRouter.delete('/:id',
celebrate({
  [Segments.PARAMS]: {id: Joi.string().uuid().required()}
}),
customersController.delete);

export default customersRouter;

//chamar na index.ts do routes e apagar a rota de teste.
