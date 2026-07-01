package gen.codbex_payments.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class PaymentDirectionRepository extends JavaRepository<PaymentDirectionEntity> {

    public PaymentDirectionRepository() {
        super(PaymentDirectionEntity.class);
    }

    @Override
    public PaymentDirectionEntity save(PaymentDirectionEntity entity) {
        PaymentDirectionEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-payments-Settings-PaymentDirection", Json.stringify(saved));
        return saved;
    }

    @Override
    public PaymentDirectionEntity update(PaymentDirectionEntity entity) {
        PaymentDirectionEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-payments-Settings-PaymentDirection-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "PaymentDirection-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public PaymentDirectionEntity updateWithoutEvent(PaymentDirectionEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(PaymentDirectionEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-payments-Settings-PaymentDirection-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        PaymentDirectionEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-payments-Settings-PaymentDirection-deleted", Json.stringify(entity));
        }
    }
}
