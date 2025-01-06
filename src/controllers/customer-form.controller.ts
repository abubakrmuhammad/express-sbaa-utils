import { createRouteHandler } from "@/lib/create-route-handler";
import {
  createCustomerFormSchema,
  deleteCustomerFormSchema,
  getCustomerFormsSchema,
  getSingleCustomerFormSchema,
  updateCustomerFormSchema,
} from "@/schemas/requests/customer-form.schemas";
import * as customerFormService from "@/services/customer-form.service";
import { StatusCode } from "@/lib/status-codes";

export const createCustomerForm = createRouteHandler({
  schema: createCustomerFormSchema,
  async controller(req, res) {
    const formData = req.body;

    const customerFormResp = await customerFormService.createForm(formData);

    if (customerFormResp.isUnsuccessful())
      return res.error(customerFormResp.statusCode, customerFormResp.message);

    return res.success(
      StatusCode.SuccessCreated,
      "Form submitted successfully",
      customerFormResp.data
    );
  },
});

export const getCustomerForms = createRouteHandler({
  schema: getCustomerFormsSchema,
  async controller(req, res) {
    const {
      page = 1,
      limit = 20,
      status,
      isEligible,
      sortBy,
      sortOrder,
    } = req.query;

    const formsResp = await customerFormService.getForms({
      page,
      limit,
      status,
      isEligible,
      sortBy,
      sortOrder
    });

    if (formsResp.isUnsuccessful())
      return res.error(formsResp.statusCode, formsResp.message);

    return res.success("Customer forms fetched successfully", formsResp.data);
  },
});

export const getCustomerFormById = createRouteHandler({
  schema: getSingleCustomerFormSchema,
  async controller(req, res) {
    const formId = req.params.id;

    const formResp = await customerFormService.getFormById(formId);

    if (formResp.isUnsuccessful())
      return res.error(formResp.statusCode, formResp.message);

    return res.success("Customer form fetched successfully", formResp.data);
  },
});

export const updateCustomerForm = createRouteHandler({
  schema: updateCustomerFormSchema,
  async controller(req, res) {
    const formId = req.params.id;
    const newStatus = req.body.status;
    const optionalNote = req.body.notes;

    const updateFormResp = await customerFormService.updateFormStatus(
      formId,
      newStatus,
      optionalNote
    );

    if (updateFormResp.isUnsuccessful())
      return res.error(updateFormResp.statusCode, updateFormResp.message);

    return res.success(
      "Customer form updated successfully",
      updateFormResp.data
    );
  },
});

export const deleteCustomerForm = createRouteHandler({
  schema: deleteCustomerFormSchema,
  async controller(req, res) {
    const formId = req.params.id;

    const deleteFormResp = await customerFormService.deleteForm(formId);

    if (deleteFormResp.isUnsuccessful())
      return res.error(deleteFormResp.statusCode, deleteFormResp.message);

    return res.success("Customer form deleted successfully", deleteFormResp);
  },
});
