package gen.codbex_payments.data.paymentadjustment;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class PaymentAdjustmentRepository extends JavaRepository<PaymentAdjustmentEntity> {

    public PaymentAdjustmentRepository() {
        super(PaymentAdjustmentEntity.class);
    }

    @Override
    public PaymentAdjustmentEntity save(PaymentAdjustmentEntity entity) {
        entity.UUID = require("sdk/utils/uuid").random();
        return super.save(entity);
    }
}
