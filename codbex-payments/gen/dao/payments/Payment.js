const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");
const EntityUtils = require("codbex-payments/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "CODBEX_PAYMENT",
	properties: [
		{
			name: "Id",
			column: "PAYMENT_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Date",
			column: "PAYMENT_DATE",
			type: "DATE",
		},
 {
			name: "Operator",
			column: "PAYMENT_OPERATOR",
			type: "INTEGER",
		},
 {
			name: "Receiver",
			column: "PAYMENT_BUYER",
			type: "INTEGER",
		},
 {
			name: "Sender",
			column: "PAYMENT_SELLER",
			type: "INTEGER",
		},
 {
			name: "Type",
			column: "PAYMENT_TYPE",
			type: "INTEGER",
		},
 {
			name: "AccountFrom",
			column: "PAYMENT_ACCOUNTFROM",
			type: "VARCHAR",
		},
 {
			name: "AccountTo",
			column: "PAYMENT_ACCOUNTTO",
			type: "VARCHAR",
		},
 {
			name: "Currency",
			column: "PAYMENT_CURRENCY",
			type: "VARCHAR",
		},
 {
			name: "Amount",
			column: "PAYMENT_AMOUNT",
			type: "DOUBLE",
		},
 {
			name: "Discount",
			column: "PAYMENT_DISCOUNT",
			type: "DOUBLE",
		},
 {
			name: "VAT",
			column: "PAYMENT_VAT",
			type: "DOUBLE",
		},
 {
			name: "Total",
			column: "PAYMENT_TOTAL",
			type: "DOUBLE",
		},
 {
			name: "ValueDate",
			column: "PAYMENT_VALUEDATE",
			type: "DATE",
		},
 {
			name: "ReasonForPayment",
			column: "PAYMENT_REASONFORPAYMENT",
			type: "VARCHAR",
		},
 {
			name: "InvoiceId",
			column: "PAYMENT_INVOICEID",
			type: "INTEGER",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setDate(e, "Date");
		EntityUtils.setDate(e, "ValueDate");
		return e;
	});
};

exports.get = function(id) {
	let entity = dao.find(id);
	EntityUtils.setDate(entity, "Date");
	EntityUtils.setDate(entity, "ValueDate");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "Date");
	EntityUtils.setLocalDate(entity, "ValueDate");
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_PAYMENT",
		key: {
			name: "Id",
			column: "PAYMENT_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	// EntityUtils.setLocalDate(entity, "Date");
	// EntityUtils.setLocalDate(entity, "ValueDate");
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_PAYMENT",
		key: {
			name: "Id",
			column: "PAYMENT_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_PAYMENT",
		key: {
			name: "Id",
			column: "PAYMENT_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PAYMENT"');
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("codbex-payments/payments/Payment/" + operation).send(JSON.stringify(data));
}