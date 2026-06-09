package gen.codbex_payments.data.supplierpayment;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class SupplierPaymentRepository extends JavaRepository<SupplierPaymentEntity> {

    public SupplierPaymentRepository() {
        super(SupplierPaymentEntity.class);
    }

    @Override
    public SupplierPaymentEntity save(SupplierPaymentEntity entity) {
        entity.Name = new NumberGeneratorService().generateByType('Supplier Payment');
        entity.UUID = require("sdk/utils/uuid").random();
        return super.save(entity);
    }
}
