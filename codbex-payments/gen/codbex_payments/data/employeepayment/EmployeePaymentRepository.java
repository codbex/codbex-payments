package gen.codbex_payments.data.employeepayment;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;
import org.eclipse.dirigible.sdk.utils.Calc;
// custom imports
import codbex-number-generator.service.Generator;
import org.eclipse.dirigible.sdk.utils;

@Repository
public class EmployeePaymentRepository extends JavaRepository<EmployeePaymentEntity> {

    public EmployeePaymentRepository() {
        super(EmployeePaymentEntity.class);
    }

    @Override
    public EmployeePaymentEntity save(EmployeePaymentEntity entity) {
        entity.Name = new Generator().generateByType("Employee Payment");
        entity.UUID = Uuid.random();
        EmployeePaymentEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-payments-EmployeePayment-EmployeePayment", Json.stringify(saved));
        return saved;
    }

    @Override
    public EmployeePaymentEntity update(EmployeePaymentEntity entity) {
        EmployeePaymentEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-payments-EmployeePayment-EmployeePayment-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "EmployeePayment-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public EmployeePaymentEntity updateWithoutEvent(EmployeePaymentEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(EmployeePaymentEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-payments-EmployeePayment-EmployeePayment-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        EmployeePaymentEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-payments-EmployeePayment-EmployeePayment-deleted", Json.stringify(entity));
        }
    }
}
