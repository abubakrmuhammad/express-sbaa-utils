import { db, StatusCode, serviceResponse } from "@/lib";
import { CustomerFormStatus, Prisma } from "@prisma/client";

export async function createForm(formData: Prisma.CustomerFormCreateInput) {
  try {
    const formRecord = await db.customerForm.create({
      data: formData,
    });

    return serviceResponse.success(
      formRecord,
      "Customer form created successfully",
      StatusCode.SuccessCreated
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return serviceResponse.failure(
        "Failed to create customer form",
        StatusCode.ClientErrorBadRequest
      );
    }

    return serviceResponse.exception(
      "An unexpected error occurred while creating customer form",
      StatusCode.ServerErrorInternal,
      error
    );
  }
}

export async function getForms(params: {
  page: number;
  limit: number;
  status?: CustomerFormStatus;
  isEligible?: boolean;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}) {
  try {
    const {
      page,
      limit,
      status,
      isEligible,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params ?? {};

    const skip = (page - 1) * limit;

    const where: Prisma.CustomerFormWhereInput = {
      ...(status && { status }),
      ...(typeof isEligible === "boolean" && { isEligible }),
    };

    const [forms, total] = await Promise.all([
      db.customerForm.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      db.customerForm.count({ where }),
    ]);

    return serviceResponse.success({
      forms,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return serviceResponse.exception(
      "Failed to fetch customer forms",
      StatusCode.ServerErrorInternal,
      error
    );
  }
}

export async function getFormById(id: string) {
  try {
    const form = await db.customerForm.findUnique({
      where: { id },
    });

    if (!form)
      return serviceResponse.failure(
        `Customer form with id ${id} not found`,
        StatusCode.ClientErrorNotFound
      );

    return serviceResponse.success(form);
  } catch (error) {
    return serviceResponse.exception(
      "Failed to fetch customer form",
      StatusCode.ServerErrorInternal,
      error
    );
  }
}

export async function updateFormStatus(
  id: string,
  status: CustomerFormStatus,
  notes?: string
) {
  try {
    const form = await db.customerForm.update({
      where: { id },
      data: {
        status,
        notes,
      },
    });

    return serviceResponse.success(form, "Customer form updated successfully");
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return serviceResponse.failure(
          `Customer form with id ${id} not found`,
          StatusCode.ClientErrorNotFound
        );
      }

      return serviceResponse.failure("Failed to update customer form");
    }

    return serviceResponse.exception(
      "An unexpected error occurred while updating customer form",
      StatusCode.ServerErrorInternal,
      error
    );
  }
}

export async function deleteForm(id: string) {
  try {
    const form = await db.customerForm.delete({
      where: { id },
    });

    return serviceResponse.success(form, "Customer form deleted successfully");
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return serviceResponse.failure(
          `Customer form with id ${id} not found`,
          StatusCode.ClientErrorNotFound
        );
      }

      return serviceResponse.failure("Failed to delete customer form");
    }

    return serviceResponse.exception(
      "An unexpected error occurred while deleting customer form",
      StatusCode.ServerErrorInternal,
      error
    );
  }
}
