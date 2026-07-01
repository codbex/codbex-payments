package gen.codbex_payments.data.customerpayment;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;
import org.eclipse.dirigible.sdk.utils.Calc;
// custom imports
import codbex-number-generator.service.Generator;
import org.eclipse.dirigible.sdk.utils;

@Repository
public class CustomerPaymentRepository extends JavaRepository<CustomerPaymentEntity> {

    public CustomerPaymentRepository() {
        super(CustomerPaymentEntity.class);
    }

    @Override
    public CustomerPaymentEntity save(CustomerPaymentEntity entity) {
        entity.Name = new Generator().generateByType("Customer Payment");
        entity.UUID = Uuid.random();
        CustomerPaymentEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-payments-CustomerPayment-CustomerPayment", Json.stringify(saved));
        return saved;
    }

    @Override
    public CustomerPaymentEntity update(CustomerPaymentEntity entity) {
        CustomerPaymentEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-payments-CustomerPayment-CustomerPayment-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "CustomerPayment-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public CustomerPaymentEntity updateWithoutEvent(CustomerPaymentEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(CustomerPaymentEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-payments-CustomerPayment-CustomerPayment-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        CustomerPaymentEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-payments-CustomerPayment-CustomerPayment-deleted", Json.stringify(entity));
        }
    }
}
