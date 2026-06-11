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
        entity.Name = new Generator().generateByType("Employee Payment");
        entity.UUID = Uuid.random();
        return super.save(entity);
    }
}
