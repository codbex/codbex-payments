import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { CustomerPaymentRepository, CustomerPaymentEntityOptions } from "../../dao/CustomerPayment/CustomerPaymentRepository";
import { user } from "sdk/security"
import { ForbiddenError } from "../utils/ForbiddenError";
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

const validationModules = await Extensions.loadExtensionModules("codbex-payments-CustomerPayment-CustomerPayment", ["validate"]);

@Controller
class CustomerPaymentService {

    private readonly repository = new CustomerPaymentRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            this.checkPermissions("read");
            const options: CustomerPaymentEntityOptions = {
                $limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : undefined,
                $offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : undefined
            };

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/")
    public create(entity: any) {
        try {
            this.checkPermissions("write");
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity);
            response.setHeader("Content-Location", "/services/ts/codbex-payments/gen/codbex-payments/api/CustomerPayment/CustomerPaymentService.ts/" + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/count")
    public count() {
        try {
            this.checkPermissions("read");
            return this.repository.count();
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/count")
    public countWithFilter(filter: any) {
        try {
            this.checkPermissions("read");
            return this.repository.count(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/search")
    public search(filter: any) {
        try {
            this.checkPermissions("read");
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/:id")
    public getById(_: any, ctx: any) {
        try {
            this.checkPermissions("read");
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound("CustomerPayment not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Put("/:id")
    public update(entity: any, ctx: any) {
        try {
            this.checkPermissions("write");
            entity.Id = ctx.pathParameters.id;
            this.validateEntity(entity);
            this.repository.update(entity);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Delete("/:id")
    public deleteById(_: any, ctx: any) {
        try {
            this.checkPermissions("write");
            const id = ctx.pathParameters.id;
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound("CustomerPayment not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === "ForbiddenError") {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === "ValidationError") {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

    private checkPermissions(operationType: string) {
        if (operationType === "read" && !(user.isInRole("codbex-payments.CustomerPayment.CustomerPaymentReadOnly") || user.isInRole("codbex-payments.CustomerPayment.CustomerPaymentFullAccess"))) {
            throw new ForbiddenError();
        }
        if (operationType === "write" && !user.isInRole("codbex-payments.CustomerPayment.CustomerPaymentFullAccess")) {
            throw new ForbiddenError();
        }
    }

    private validateEntity(entity: any): void {
        if (entity.Customer === null || entity.Customer === undefined) {
            throw new ValidationError(`The 'Customer' property is required, provide a valid value`);
        }
        if (entity.Date === null || entity.Date === undefined) {
            throw new ValidationError(`The 'Date' property is required, provide a valid value`);
        }
        if (entity.Valor === null || entity.Valor === undefined) {
            throw new ValidationError(`The 'Valor' property is required, provide a valid value`);
        }
        if (entity.CompanyIBAN?.length > 34) {
            throw new ValidationError(`The 'CompanyIBAN' exceeds the maximum length of [34] characters`);
        }
        if (entity.CounterpartyIBAN?.length > 34) {
            throw new ValidationError(`The 'CounterpartyIBAN' exceeds the maximum length of [34] characters`);
        }
        if (entity.CounterpartyName?.length > 100) {
            throw new ValidationError(`The 'CounterpartyName' exceeds the maximum length of [100] characters`);
        }
        if (entity.Amount === null || entity.Amount === undefined) {
            throw new ValidationError(`The 'Amount' property is required, provide a valid value`);
        }
        if (entity.Currency === null || entity.Currency === undefined) {
            throw new ValidationError(`The 'Currency' property is required, provide a valid value`);
        }
        if (entity.Reason === null || entity.Reason === undefined) {
            throw new ValidationError(`The 'Reason' property is required, provide a valid value`);
        }
        if (entity.Reason?.length > 100) {
            throw new ValidationError(`The 'Reason' exceeds the maximum length of [100] characters`);
        }
        if (entity.Description?.length > 100) {
            throw new ValidationError(`The 'Description' exceeds the maximum length of [100] characters`);
        }
        if (entity.Name?.length > 20) {
            throw new ValidationError(`The 'Name' exceeds the maximum length of [20] characters`);
        }
        if (entity.UUID?.length > 36) {
            throw new ValidationError(`The 'UUID' exceeds the maximum length of [36] characters`);
        }
        if (entity.Reference?.length > 36) {
            throw new ValidationError(`The 'Reference' exceeds the maximum length of [36] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
