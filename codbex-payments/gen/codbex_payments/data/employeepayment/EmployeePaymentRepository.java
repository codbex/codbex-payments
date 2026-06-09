package gen.codbex_payments.data.employeepayment;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class EmployeePaymentRepository extends JavaRepository<EmployeePaymentEntity> {

    public EmployeePaymentRepository() {
        super(EmployeePaymentEntity.class);
    }

    @Override
    public EmployeePaymentEntity save(EmployeePaymentEntity entity) {
        entity.Name = new NumberGeneratorService().generateByType('Employee Payment');
        entity.UUID = require("sdk/utils/uuid").random();
        return super.save(entity);
    }
}
