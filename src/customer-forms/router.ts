import { Router } from "express";
import {
  createCustomerForm,
  getCustomerForms,
  getCustomerFormById,
  updateCustomerForm,
  deleteCustomerForm,
} from "./controllers";

const customerFormRouter = Router();

customerFormRouter.route("/").get(getCustomerForms).post(createCustomerForm);

customerFormRouter
  .route("/:id")
  .get(getCustomerFormById)
  .put(updateCustomerForm)
  .delete(deleteCustomerForm);

export default customerFormRouter;
