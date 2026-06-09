package gen.codbex_payments.data.supplierpayment;

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
@Table(name = "CODBEX_SUPPLIERPAYMENT")
@Documentation("SupplierPayment entity mapping")
public class SupplierPaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SUPPLIERPAYMENT_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "SUPPLIERPAYMENT_SUPPLIER", nullable = false)
    @Documentation("Supplier")
    public Integer Supplier;

    @Column(name = "SUPPLIERPAYMENT_DATE", nullable = false)
    @Documentation("Date")
    public java.time.LocalDate Date;

    @Column(name = "SUPPLIERPAYMENT_VALOR", nullable = false)
    @Documentation("Valor")
    public java.time.LocalDate Valor;

    @Column(name = "SUPPLIERPAYMENT_OURPARTYIBAN", length = 34, nullable = false)
    @Documentation("OurPartyIBAN")
    public String OurPartyIBAN;

    @Column(name = "SUPPLIERPAYMENT_COUNTERPARTYIBAN", length = 34, nullable = false)
    @Documentation("CounterpartyIBAN")
    public String CounterpartyIBAN;

    @Column(name = "SUPPLIERPAYMENT_COUNTERPARTYNAME", length = 100, nullable = true)
    @Documentation("CounterpartyName")
    public String CounterpartyName;

    @Column(name = "SUPPLIERPAYMENT_AMOUNT", precision = 16, scale = 2, nullable = false)
    @Documentation("Amount")
    public java.math.BigDecimal Amount;

    @Column(name = "SUPPLIERPAYMENT_CURRENCY", nullable = false)
    @Documentation("Currency")
    public Integer Currency;

    @Column(name = "SUPPLIERPAYMENT_COMPANY", nullable = true)
    @Documentation("Company")
    public Integer Company;

    @Column(name = "SUPPLIERPAYMENT_REASON", length = 100, nullable = false)
    @Documentation("Reason")
    public String Reason;

    @Column(name = "SUPPLIERPAYMENT_DESCRIPTION", length = 100, nullable = true)
    @Documentation("Description")
    public String Description;

    @Column(name = "SUPPLIERPAYMENT_PAYMENTMETHOD", nullable = false)
    @Documentation("PaymentMethod")
    public Integer PaymentMethod;

    @Column(name = "SUPPLIERPAYMENT_NAME", length = 20, nullable = true)
    @Documentation("Name")
    public String Name;

    @Column(name = "SUPPLIERPAYMENT_UUID", length = 36, nullable = false, unique = true)
    @Documentation("UUID")
    public String UUID;

    @Column(name = "SUPPLIERPAYMENT_REFERENCE", length = 36, nullable = true)
    @Documentation("Reference")
    public String Reference;

    @CreatedAt
    @Column(name = "SUPPLIERPAYMENT_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "SUPPLIERPAYMENT_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "SUPPLIERPAYMENT_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "SUPPLIERPAYMENT_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
