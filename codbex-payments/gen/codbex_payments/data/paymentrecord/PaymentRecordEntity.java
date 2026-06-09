package gen.codbex_payments.data.paymentrecord;

import org.eclipse.dirigible.engine.java.annotations.Column;
import org.eclipse.dirigible.engine.java.annotations.CreatedAt;
import org.eclipse.dirigible.engine.java.annotations.CreatedBy;
import org.eclipse.dirigible.engine.java.annotations.Documentation;
import org.eclipse.dirigible.engine.java.annotations.Entity;
import org.eclipse.dirigible.engine.java.annotations.GeneratedValue;
import org.eclipse.dirigible.engine.java.annotations.GenerationType;
import org.eclipse.dirigible.engine.java.annotations.Id;
import org.eclipse.dirigible.engine.java.annotations.Table;
import org.eclipse.dirigible.engine.java.annotations.UpdatedAt;
import org.eclipse.dirigible.engine.java.annotations.UpdatedBy;

@Entity
@Table(name = "CODBEX_PAYMENTRECORD")
@Documentation("PaymentRecord entity mapping")
public class PaymentRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAYMENTRECORD_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "PAYMENTRECORD_DATE", nullable = false)
    @Documentation("Date")
    public java.time.LocalDate Date;

    @Column(name = "PAYMENTRECORD_VALOR", nullable = false)
    @Documentation("Valor")
    public java.time.LocalDate Valor;

    @Column(name = "PAYMENTRECORD_OURPARTYIBAN", length = 34, nullable = false)
    @Documentation("OurPartyIBAN")
    public String OurPartyIBAN;

    @Column(name = "PAYMENTRECORD_COUNTERPARTYIBAN", length = 34, nullable = false)
    @Documentation("CounterpartyIBAN")
    public String CounterpartyIBAN;

    @Column(name = "PAYMENTRECORD_COUNTERPARTYNAME", length = 100, nullable = true)
    @Documentation("CounterpartyName")
    public String CounterpartyName;

    @Column(name = "PAYMENTRECORD_AMOUNT", precision = 16, scale = 2, nullable = false)
    @Documentation("Amount")
    public java.math.BigDecimal Amount;

    @Column(name = "PAYMENTRECORD_COMPANY", nullable = true)
    @Documentation("Company")
    public Integer Company;

    @Column(name = "PAYMENTRECORD_CURRENCY", nullable = false)
    @Documentation("Currency")
    public Integer Currency;

    @Column(name = "PAYMENTRECORD_PAYMENTDIRECTION", nullable = false)
    @Documentation("PaymentDirection")
    public Integer PaymentDirection;

    @Column(name = "PAYMENTRECORD_PAYMENTTYPE", nullable = false)
    @Documentation("PaymentType")
    public Integer PaymentType;

    @Column(name = "PAYMENTRECORD_REASON", length = 100, nullable = true)
    @Documentation("Reason")
    public String Reason;

    @Column(name = "PAYMENTRECORD_DESCRIPTION", length = 100, nullable = true)
    @Documentation("Description")
    public String Description;

    @Column(name = "PAYMENTRECORD_UUID", length = 36, nullable = false, unique = true)
    @Documentation("UUID")
    public String UUID;

    @Column(name = "PAYMENTRECORD_REFERENCE", length = 36, nullable = true)
    @Documentation("Reference")
    public String Reference;

    @Column(name = "PAYMENTRECORD_DELETED", nullable = true)
    @Documentation("Deleted")
    public Boolean Deleted;

    @Column(name = "PAYMENTRECORD_DELETEDAT", nullable = true)
    @Documentation("DeletedAt")
    public java.time.Instant DeletedAt;

    @Column(name = "PAYMENTRECORD_DELETEDREASON", length = 255, nullable = true)
    @Documentation("DeletedReason")
    public String DeletedReason;

    @CreatedAt
    @Column(name = "PAYMENTRECORD_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "PAYMENTRECORD_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "PAYMENTRECORD_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "PAYMENTRECORD_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
