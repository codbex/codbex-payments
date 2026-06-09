package gen.codbex_payments.data.customerpayment;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class CustomerPaymentRepository extends JavaRepository<CustomerPaymentEntity> {

    public CustomerPaymentRepository() {
        super(CustomerPaymentEntity.class);
    }

    @Override
    public CustomerPaymentEntity save(CustomerPaymentEntity entity) {
        entity.Name = new NumberGeneratorService().generateByType('Customer Payment');
        entity.UUID = require("sdk/utils/uuid").random();
        return super.save(entity);
    }
}
