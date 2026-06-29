package gen.codbex_payments.data.customerpayment;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class CustomerPaymentRepository extends JavaRepository<CustomerPaymentEntity> {

    public CustomerPaymentRepository() {
        super(CustomerPaymentEntity.class);
    }

    @Override
    public CustomerPaymentEntity save(CustomerPaymentEntity entity) {
        entity.Name = new Generator().generateByType("Customer Payment");
        entity.UUID = Uuid.random();
        return super.save(entity);
    }
}
