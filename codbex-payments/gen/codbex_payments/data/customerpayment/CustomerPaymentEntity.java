package gen.codbex_payments.data.customerpayment;

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
@Table(name = "CODBEX_CUSTOMERPAYMENT")
@Documentation("CustomerPayment entity mapping")
public class CustomerPaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CUSTOMERPAYMENT_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "CUSTOMERPAYMENT_CUSTOMER", nullable = false)
    @Documentation("Customer")
    public Integer Customer;

    @Column(name = "CUSTOMERPAYMENT_DATE", nullable = false)
    @Documentation("Date")
    public java.time.LocalDate Date;

    @Column(name = "CUSTOMERPAYMENT_VALOR", nullable = false)
    @Documentation("Valor")
    public java.time.LocalDate Valor;

    @Column(name = "CUSTOMERPAYMENT_OURPARTYIBAN", length = 34, nullable = false)
    @Documentation("OurPartyIBAN")
    public String OurPartyIBAN;

    @Column(name = "CUSTOMERPAYMENT_COUNTERPARTYIBAN", length = 34, nullable = false)
    @Documentation("CounterpartyIBAN")
    public String CounterpartyIBAN;

    @Column(name = "CUSTOMERPAYMENT_COUNTERPARTYNAME", length = 100, nullable = true)
    @Documentation("CounterpartyName")
    public String CounterpartyName;

    @Column(name = "CUSTOMERPAYMENT_AMOUNT", precision = 16, scale = 2, nullable = false)
    @Documentation("Amount")
    public java.math.BigDecimal Amount;

    @Column(name = "CUSTOMERPAYMENT_CURRENCY", nullable = false)
    @Documentation("Currency")
    public Integer Currency;

    @Column(name = "CUSTOMERPAYMENT_COMPANY", nullable = true)
    @Documentation("Company")
    public Integer Company;

    @Column(name = "CUSTOMERPAYMENT_REASON", length = 100, nullable = false)
    @Documentation("Reason")
    public String Reason;

    @Column(name = "CUSTOMERPAYMENT_DESCRIPTION", length = 100, nullable = true)
    @Documentation("Description")
    public String Description;

    @Column(name = "CUSTOMERPAYMENT_PAYMENTMETHOD", nullable = false)
    @Documentation("PaymentMethod")
    public Integer PaymentMethod;

    @Column(name = "CUSTOMERPAYMENT_NAME", length = 20, nullable = true)
    @Documentation("Name")
    public String Name;

    @Column(name = "CUSTOMERPAYMENT_UUID", length = 36, nullable = false, unique = true)
    @Documentation("UUID")
    public String UUID;

    @Column(name = "CUSTOMERPAYMENT_REFERENCE", length = 36, nullable = true)
    @Documentation("Reference")
    public String Reference;

    @CreatedAt
    @Column(name = "CUSTOMERPAYMENT_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "CUSTOMERPAYMENT_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "CUSTOMERPAYMENT_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "CUSTOMERPAYMENT_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
