package gen.codbex_payments.data.paymentadjustment;

import org.eclipse.dirigible.sdk.db.Column;
import org.eclipse.dirigible.sdk.db.CreatedAt;
import org.eclipse.dirigible.sdk.db.CreatedBy;
import org.eclipse.dirigible.sdk.platform.Documentation;
import org.eclipse.dirigible.sdk.db.Entity;
import org.eclipse.dirigible.sdk.db.GeneratedValue;
import org.eclipse.dirigible.sdk.db.GenerationType;
import org.eclipse.dirigible.sdk.db.Id;
import org.eclipse.dirigible.sdk.db.Table;
import org.eclipse.dirigible.sdk.db.UpdatedAt;
import org.eclipse.dirigible.sdk.db.UpdatedBy;

@Entity
@Table(name = "CODBEX_PAYMENTADJUSTMENT")
@Documentation("PaymentAdjustment entity mapping")
public class PaymentAdjustmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAYMENTADJUSTMENT_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "PAYMENTADJUSTMENT_DATE", nullable = false)
    @Documentation("Date")
    public java.time.LocalDate Date;

    @Column(name = "PAYMENTADJUSTMENT_VALOR", nullable = false)
    @Documentation("Valor")
    public java.time.LocalDate Valor;

    @Column(name = "PAYMENTADJUSTMENT_AMOUNT", precision = 16, scale = 2, nullable = false)
    @Documentation("Amount")
    public java.math.BigDecimal Amount;

    @Column(name = "PAYMENTADJUSTMENT_CURRENCY", nullable = false)
    @Documentation("Currency")
    public Integer Currency;

    @Column(name = "PAYMENTADJUSTMENT_REASON", length = 100, nullable = true)
    @Documentation("Reason")
    public String Reason;

    @Column(name = "PAYMENTADJUSTMENT_COMPANY", nullable = false)
    @Documentation("Company")
    public Integer Company;

    @Column(name = "PAYMENTADJUSTMENT_UUID", length = 36, nullable = true, unique = true)
    @Documentation("UUID")
    public String UUID;

    @CreatedAt
    @Column(name = "PAYMENTADJUSTMENT_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "PAYMENTADJUSTMENT_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "PAYMENTADJUSTMENT_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "PAYMENTADJUSTMENT_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
