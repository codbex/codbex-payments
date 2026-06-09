package gen.codbex_payments.data.paymentrecord;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class PaymentRecordRepository extends JavaRepository<PaymentRecordEntity> {

    public PaymentRecordRepository() {
        super(PaymentRecordEntity.class);
    }

    @Override
    public PaymentRecordEntity save(PaymentRecordEntity entity) {
        entity.UUID = require("sdk/utils/uuid").random();
        return super.save(entity);
    }
}
