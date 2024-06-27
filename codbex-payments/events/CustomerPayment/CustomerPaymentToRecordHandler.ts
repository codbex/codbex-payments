import { PaymentRecordRepository } from "../../gen/codbex-payments/dao/PaymentRecord/PaymentRecordRepository";

export const trigger = (event) => {
    const PaymentRecordDao = new PaymentRecordRepository();
    const item = event.entity;
    const operation = event.operation;

    if (operation === "create") {
        const record = {
            Date: item.Date,
            Valor: item.Valor,
            CompanyIBAN: item.CompanyIBAN,
            CounterpartyIBAN: item.CounterpartyIBAN,
            CounterpartyName: item.CounterpartyName,
            Amount: item.Amount,
            Currency: item.Currency,
            Reason: item.Reason,
            Description: item.Description,
            Reference: item.UUID,
            Direction: 1,
            Deleted: false,
        }
        PaymentRecordDao.create(record);
    } else if (operation === "update") {
        // TODO find by Item Id and update
    } else if (operation === "delete") {
        // TODO find by Item Id and mark as deleted
    } else {
        throw new Error("Unknown operation: " + operation);
    }
}