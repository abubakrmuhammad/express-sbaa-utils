import { z } from "zod";
import {
  objectIdParam,
  paginationQueryFields,
  sortOrderSchema,
} from "./common.schemas";
import { CustomerFormStatus } from "@prisma/client";

const basicInformationSchema = z.object({
  fullLegalName: z.string().min(1),
  businessName: z.string().min(1),
  businessAddress: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  emailAddress: z.string().email(),
  phoneNumber: z.string().min(10),
});

const businessDetailsSchema = z.object({
  businessStructure: z.string().min(1),
  llcType: z.string().optional(),
  sCorpElection: z.boolean().optional(),
  hasOperatingAgreement: z.boolean().optional(),
  numberOfMembers: z.number().int().min(0).optional(),
  numberOfEmployees: z.number().int().min(0),
  annualRevenue: z.string().min(1),
  primaryBusinessGoal: z.string().min(1),
});

const servicesNeededSchema = z.object({
  services: z.array(z.string()),
  needsEIN: z.boolean(),
  needsBankAccount: z.boolean(),
  needsPayroll: z.boolean(),
  payrollEmployees: z.number().int().min(0).optional(),
});

const clientScreeningSchema = z.object({
  businessDescription: z.string().min(1),
  businessType: z.string().optional(),
  businessChallenges: z.array(z.string()),
  biggestPainPoint: z.string().min(1),
});

const additionalDetailsSchema = z.object({
  hasFinancialAdvisor: z.string(),
  wantsProfessionalConnection: z.boolean(),
});

export const createCustomerFormSchema = {
  body: z.object({
    basicInformation: basicInformationSchema,
    businessDetails: businessDetailsSchema,
    servicesNeeded: servicesNeededSchema,
    clientScreening: clientScreeningSchema,
    additionalDetails: additionalDetailsSchema,
    isEligible: z.boolean().default(true),
  }),
};

export const getCustomerFormsSchema = {
  query: z.object({
    ...paginationQueryFields,
    status: z.nativeEnum(CustomerFormStatus).optional(),
    isEligible: z.boolean().optional(),
    sortBy: z.enum(["createdAt", "updatedAt"]).optional().default("createdAt"),
    sortOrder: sortOrderSchema,
  }),
};

export const getSingleCustomerFormSchema = {
  params: z.object({
    id: objectIdParam,
  }),
};

export const updateCustomerFormSchema = {
  params: z.object({
    id: objectIdParam,
  }),
  body: z.object({
    status: z.nativeEnum(CustomerFormStatus),
    notes: z.string().optional(),
    isEligible: z.boolean().optional(),
  }),
};

export const deleteCustomerFormSchema = {
  params: z.object({
    id: objectIdParam,
  }),
};
