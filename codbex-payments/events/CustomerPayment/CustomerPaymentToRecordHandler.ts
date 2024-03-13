import { CustomerPaymentRepository } from "../../gen/dao/CustomerPayment/CustomerPaymentRepository";
import { PaymentRecordRepository } from "../../gen/dao/PaymentRecord/PaymentRecordRepository";

export const trigger = (event) => {
    const CustomerPaymentDao = new CustomerPaymentRepository();
    const PaymentRecordDao = new PaymentRecordRepository();
    const item = event.entity;
    const operation = event.operation;
    const header = CustomerPaymentDao.findById(item.CustomerPayment);

    if (operation === "create") {
        const record = {
            Date: item.Date,
            Valor: item.Valor,
            Amount: item.Amount,
            Currency: item.Currency,
            Reason: item.Reason,
            Description: item.Description,
            Reference: header.UUID,
            Direction: -1,
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