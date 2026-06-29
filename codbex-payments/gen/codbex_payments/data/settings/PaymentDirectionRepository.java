package gen.codbex_payments.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class PaymentDirectionRepository extends JavaRepository<PaymentDirectionEntity> {

    public PaymentDirectionRepository() {
        super(PaymentDirectionEntity.class);
    }
}
