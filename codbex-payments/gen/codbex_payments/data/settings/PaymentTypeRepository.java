package gen.codbex_payments.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class PaymentTypeRepository extends JavaRepository<PaymentTypeEntity> {

    public PaymentTypeRepository() {
        super(PaymentTypeEntity.class);
    }
}
