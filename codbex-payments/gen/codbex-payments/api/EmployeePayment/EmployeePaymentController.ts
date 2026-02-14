import { Controller, Get, Post, Put, Delete, Documentation, request, response } from '@aerokit/sdk/http'
import { HttpUtils } from "@aerokit/sdk/http/utils";
import { ValidationError } from '@aerokit/sdk/http/errors'
import { ForbiddenError } from '@aerokit/sdk/http/errors'
import { user } from '@aerokit/sdk/security'
import { Options } from '@aerokit/sdk/db'
import { Extensions } from "@aerokit/sdk/extensions"
import { Injected, Inject } from '@aerokit/sdk/component'
import { EmployeePaymentRepository } from '../../data/EmployeePayment/EmployeePaymentRepository'
import { EmployeePaymentEntity } from '../../data/EmployeePayment/EmployeePaymentEntity'
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

const validationModules = await Extensions.loadExtensionModules('codbex-payments-EmployeePayment-EmployeePayment', ['validate']);

@Controller
@Documentation('codbex-payments - EmployeePayment Controller')
@Injected()
class EmployeePaymentController {

    @Inject('EmployeePaymentRepository')
    private readonly repository!: EmployeePaymentRepository;

    @Get('/')
    @Documentation('Get All EmployeePayment')
    public getAll(_: any, ctx: any): EmployeePaymentEntity[] {
        try {
            this.checkPermissions('read');
            const options: Options = {
                limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : 20,
                offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : 0,
                language: request.getLocale().slice(0, 2)
            };

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/')
    @Documentation('Create EmployeePayment')
    public create(entity: EmployeePaymentEntity): EmployeePaymentEntity {
        try {
            this.checkPermissions('write');
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity) as any;
            response.setHeader('Content-Location', '/services/ts/codbex-payments/gen/codbex-payments/api/EmployeePayment/EmployeePaymentService.ts/' + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/count')
    @Documentation('Count EmployeePayment')
    public count(): { count: number } {
        try {
            this.checkPermissions('read');
            return { count: this.repository.count() };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/count')
    @Documentation('Count EmployeePayment with filter')
    public countWithFilter(filter: any): { count: number } {
        try {
            this.checkPermissions('read');
            return { count: this.repository.count(filter) };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/search')
    @Documentation('Search EmployeePayment')
    public search(filter: any): EmployeePaymentEntity[] {
        try {
            this.checkPermissions('read');
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/:id')
    @Documentation('Get EmployeePayment by id')
    public getById(_: any, ctx: any): EmployeePaymentEntity {
        try {
            this.checkPermissions('read');
            const id = parseInt(ctx.pathParameters.id);
            const options: Options = {
                language: request.getLocale().slice(0, 2)
            };
            const entity = this.repository.findById(id, options);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound('EmployeePayment not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Put('/:id')
    @Documentation('Update EmployeePayment by id')
    public update(entity: EmployeePaymentEntity, ctx: any): EmployeePaymentEntity {
        try {
            this.checkPermissions('write');
            const id = parseInt(ctx.pathParameters.id);
            entity.Id = id;
            this.validateEntity(entity);
            this.repository.update(entity);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Delete('/:id')
    @Documentation('Delete EmployeePayment by id')
    public deleteById(_: any, ctx: any): void {
        try {
            this.checkPermissions('write');
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound('EmployeePayment not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === 'ForbiddenError') {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === 'ValidationError') {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

    private checkPermissions(operationType: string) {
        if (operationType === 'read' && !(user.isInRole('codbex-payments.EmployeePayment.EmployeePaymentReadOnly') || user.isInRole('codbex-payments.EmployeePayment.EmployeePaymentFullAccess'))) {
            throw new ForbiddenError();
        }
        if (operationType === 'write' && !user.isInRole('codbex-payments.EmployeePayment.EmployeePaymentFullAccess')) {
            throw new ForbiddenError();
        }
    }

    private validateEntity(entity: any): void {
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
