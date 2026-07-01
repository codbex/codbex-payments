package gen.codbex_payments.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class PaymentTypeRepository extends JavaRepository<PaymentTypeEntity> {

    public PaymentTypeRepository() {
        super(PaymentTypeEntity.class);
    }

    @Override
    public PaymentTypeEntity save(PaymentTypeEntity entity) {
        PaymentTypeEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-payments-Settings-PaymentType", Json.stringify(saved));
        return saved;
    }

    @Override
    public PaymentTypeEntity update(PaymentTypeEntity entity) {
        PaymentTypeEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-payments-Settings-PaymentType-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "PaymentType-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public PaymentTypeEntity updateWithoutEvent(PaymentTypeEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(PaymentTypeEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-payments-Settings-PaymentType-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        PaymentTypeEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-payments-Settings-PaymentType-deleted", Json.stringify(entity));
        }
    }
}
