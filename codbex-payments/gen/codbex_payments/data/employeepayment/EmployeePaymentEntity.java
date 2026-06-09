package gen.codbex_payments.data.employeepayment;

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
@Table(name = "CODBEX_EMPLOYEEPAYMENT")
@Documentation("EmployeePayment entity mapping")
public class EmployeePaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EMPLOYEEPAYMENT_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "EMPLOYEEPAYMENT_EMPLOYEE", nullable = false)
    @Documentation("Employee")
    public Integer Employee;

    @Column(name = "EMPLOYEEPAYMENT_DATE", nullable = false)
    @Documentation("Date")
    public java.time.LocalDate Date;

    @Column(name = "EMPLOYEEPAYMENT_VALOR", nullable = false)
    @Documentation("Valor")
    public java.time.LocalDate Valor;

    @Column(name = "EMPLOYEEPAYMENT_OURPARTYIBAN", length = 34, nullable = false)
    @Documentation("OurPartyIBAN")
    public String OurPartyIBAN;

    @Column(name = "EMPLOYEEPAYMENT_COUNTERPARTYIBAN", length = 34, nullable = false)
    @Documentation("CounterpartyIBAN")
    public String CounterpartyIBAN;

    @Column(name = "EMPLOYEEPAYMENT_COUNTERPARTYNAME", length = 100, nullable = true)
    @Documentation("CounterpartyName")
    public String CounterpartyName;

    @Column(name = "EMPLOYEEPAYMENT_AMOUNT", precision = 16, scale = 2, nullable = false)
    @Documentation("Amount")
    public java.math.BigDecimal Amount;

    @Column(name = "EMPLOYEEPAYMENT_CURRENCY", nullable = false)
    @Documentation("Currency")
    public Integer Currency;

    @Column(name = "EMPLOYEEPAYMENT_COMPANY", nullable = true)
    @Documentation("Company")
    public Integer Company;

    @Column(name = "EMPLOYEEPAYMENT_REASON", length = 100, nullable = false)
    @Documentation("Reason")
    public String Reason;

    @Column(name = "EMPLOYEEPAYMENT_DESCRIPTION", length = 100, nullable = true)
    @Documentation("Description")
    public String Description;

    @Column(name = "EMPLOYEEPAYMENT_NAME", length = 20, nullable = true)
    @Documentation("Name")
    public String Name;

    @Column(name = "EMPLOYEEPAYMENT_UUID", length = 36, nullable = false, unique = true)
    @Documentation("UUID")
    public String UUID;

    @Column(name = "EMPLOYEEPAYMENT_REFERENCE", length = 36, nullable = true)
    @Documentation("Reference")
    public String Reference;

    @CreatedAt
    @Column(name = "EMPLOYEEPAYMENT_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "EMPLOYEEPAYMENT_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "EMPLOYEEPAYMENT_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "EMPLOYEEPAYMENT_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
