package gen.codbex_payments.data.paymentadjustment;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;
import org.eclipse.dirigible.sdk.utils.Calc;
// custom imports
import org.eclipse.dirigible.sdk.utils;

@Repository
public class PaymentAdjustmentRepository extends JavaRepository<PaymentAdjustmentEntity> {

    public PaymentAdjustmentRepository() {
        super(PaymentAdjustmentEntity.class);
    }

    @Override
    public PaymentAdjustmentEntity save(PaymentAdjustmentEntity entity) {
        entity.UUID = Uuid.random();
        PaymentAdjustmentEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-payments-PaymentAdjustment-PaymentAdjustment", Json.stringify(saved));
        return saved;
    }

    @Override
    public PaymentAdjustmentEntity update(PaymentAdjustmentEntity entity) {
        PaymentAdjustmentEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-payments-PaymentAdjustment-PaymentAdjustment-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "PaymentAdjustment-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public PaymentAdjustmentEntity updateWithoutEvent(PaymentAdjustmentEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(PaymentAdjustmentEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-payments-PaymentAdjustment-PaymentAdjustment-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        PaymentAdjustmentEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-payments-PaymentAdjustment-PaymentAdjustment-deleted", Json.stringify(entity));
        }
    }
}
