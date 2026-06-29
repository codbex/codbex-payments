package gen.codbex_payments.data.employeepayment;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class EmployeePaymentRepository extends JavaRepository<EmployeePaymentEntity> {

    public EmployeePaymentRepository() {
        super(EmployeePaymentEntity.class);
    }

    @Override
    public EmployeePaymentEntity save(EmployeePaymentEntity entity) {
        entity.Name = new Generator().generateByType("Employee Payment");
        entity.UUID = Uuid.random();
        return super.save(entity);
    }
}
