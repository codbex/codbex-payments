const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_PAYMENTITEM",
	properties: [
		{
			name: "Id",
			column: "PAYMENTITEM_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Payment",
			column: "PAYMENTITEM_PAYMENTID",
			type: "INTEGER",
		},
 {
			name: "Product",
			column: "PAYMENTITEM_PRODUCT",
			type: "INTEGER",
		},
 {
			name: "UoM",
			column: "PAYMENTITEM_UOM",
			type: "INTEGER",
		},
 {
			name: "Quantity",
			column: "PAYMENTITEM_QUANTITY",
			type: "DOUBLE",
		},
 {
			name: "Price",
			column: "PAYMENTITEM_PRICE",
			type: "DOUBLE",
		},
 {
			name: "Amount",
			column: "PAYMENTITEM_AMOUNT",
			type: "DOUBLE",
		},
 {
			name: "Discount",
			column: "PAYMENTITEM_DISCOUNT",
			type: "DOUBLE",
		},
 {
			name: "VAT",
			column: "PAYMENTITEM_VAT",
			type: "DOUBLE",
		},
 {
			name: "Total",
			column: "PAYMENTITEM_TOTAL",
			type: "DOUBLE",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_PAYMENTITEM",
		key: {
			name: "Id",
			column: "PAYMENTITEM_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_PAYMENTITEM",
		key: {
			name: "Id",
			column: "PAYMENTITEM_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_PAYMENTITEM",
		key: {
			name: "Id",
			column: "PAYMENTITEM_ID",
			value: id
		}
	});
};

exports.count = function (Payment) {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PAYMENTITEM" WHERE "PAYMENTITEM_PAYMENTID" = ?', [Payment]);
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PAYMENTITEM"');
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
	producer.queue("codbex-payments/payments/PaymentItem/" + operation).send(JSON.stringify(data));
}