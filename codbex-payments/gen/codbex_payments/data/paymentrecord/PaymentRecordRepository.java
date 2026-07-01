package gen.codbex_payments.data.paymentrecord;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;
import org.eclipse.dirigible.sdk.utils.Calc;
// custom imports
import org.eclipse.dirigible.sdk.utils;

@Repository
public class PaymentRecordRepository extends JavaRepository<PaymentRecordEntity> {

    public PaymentRecordRepository() {
        super(PaymentRecordEntity.class);
    }

    @Override
    public PaymentRecordEntity save(PaymentRecordEntity entity) {
        entity.UUID = Uuid.random();
        PaymentRecordEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-payments-PaymentRecord-PaymentRecord", Json.stringify(saved));
        return saved;
    }

    @Override
    public PaymentRecordEntity update(PaymentRecordEntity entity) {
        PaymentRecordEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-payments-PaymentRecord-PaymentRecord-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "PaymentRecord-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public PaymentRecordEntity updateWithoutEvent(PaymentRecordEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(PaymentRecordEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-payments-PaymentRecord-PaymentRecord-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        PaymentRecordEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-payments-PaymentRecord-PaymentRecord-deleted", Json.stringify(entity));
        }
    }
}
