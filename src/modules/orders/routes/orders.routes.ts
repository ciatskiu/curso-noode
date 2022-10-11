import { Router } from 'express';
import {celebrate, Joi, Segments} from 'celebrate';
import OrdersController from '../controllers/OrdersController';
import isAuthenticadted from '@shared/http/middlewares/isAuthenticated';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.use(isAuthenticadted);
ordersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {id: Joi.string().uuid().required()}
  }),
  ordersController.show);

  ordersRouter.post('/',
celebrate({
  [Segments.BODY] : {
  customer_id: Joi.string().required(),
  products: Joi.required()
  }
})
,ordersController.create);



export default ordersRouter;

//chamar na index.ts do routes e apagar a rota de teste.
