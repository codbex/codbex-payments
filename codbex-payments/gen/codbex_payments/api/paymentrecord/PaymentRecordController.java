package gen.codbex_payments.api.paymentrecord;

import gen.codbex_payments.data.paymentrecord.PaymentRecordEntity;
import gen.codbex_payments.data.paymentrecord.PaymentRecordRepository;

import org.eclipse.dirigible.components.api.security.UserFacade;
import org.eclipse.dirigible.sdk.platform.Documentation;
import org.eclipse.dirigible.sdk.component.Inject;
import org.eclipse.dirigible.sdk.http.Body;
import org.eclipse.dirigible.sdk.http.Controller;
import org.eclipse.dirigible.sdk.http.Delete;
import org.eclipse.dirigible.sdk.http.Get;
import org.eclipse.dirigible.sdk.http.PathParam;
import org.eclipse.dirigible.sdk.http.Post;
import org.eclipse.dirigible.sdk.http.Put;
import org.eclipse.dirigible.sdk.http.QueryParam;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Controller
@Documentation("codbex-payments - PaymentRecord Controller")
public class PaymentRecordController {

    private static final Set<String> FILTER_FIELDS = Set.of("Id", "Date", "Valor", "OurPartyIBAN", "CounterpartyIBAN", "CounterpartyName", "Amount", "Company", "Currency", "PaymentDirection", "PaymentType", "Reason", "Description", "UUID", "Reference", "Deleted", "DeletedAt", "DeletedReason", "CreatedAt", "CreatedBy", "UpdatedAt", "UpdatedBy");

    @Inject
    private PaymentRecordRepository repository;

    @Get
    @Documentation("List PaymentRecord")
    public List<PaymentRecordEntity> getAll(@QueryParam("$limit") Integer limit,
                                      @QueryParam("$offset") Integer offset) {
        checkPermissions("read");
        int actualLimit = limit != null ? limit.intValue() : 20;
        int actualOffset = offset != null ? offset.intValue() : 0;
        List<PaymentRecordEntity> result = repository.findAll(actualLimit, actualOffset);
        return result;
    }

    @Get("/count")
    @Documentation("Count PaymentRecord")
    public Map<String, Long> count() {
        checkPermissions("read");
        return Map.of("count", repository.count());
    }

    @Post("/count")
    @Documentation("Count PaymentRecord with filter")
    public Map<String, Long> countWithFilter(@Body Map<String, Object> filter) {
        checkPermissions("read");
        return Map.of("count", (long) runFilter(filter).size());
    }

    @Post("/search")
    @Documentation("Search PaymentRecord")
    public List<PaymentRecordEntity> search(@Body Map<String, Object> filter) {
        checkPermissions("read");
        List<PaymentRecordEntity> result = runFilter(filter);
        return result;
    }

    @Get("/{id}")
    @Documentation("Get PaymentRecord by id")
    public PaymentRecordEntity getById(@PathParam("id") Integer id) {
        checkPermissions("read");
        PaymentRecordEntity entity = repository.findOne(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PaymentRecord not found"));
        return entity;
    }

    @Post
    @Documentation("Create PaymentRecord")
    public PaymentRecordEntity create(@Body PaymentRecordEntity entity) {
        checkPermissions("write");
        validate(entity);
        return repository.save(entity);
    }

    @Put("/{id}")
    @Documentation("Update PaymentRecord by id")
    public PaymentRecordEntity update(@PathParam("id") Integer id, @Body PaymentRecordEntity entity) {
        checkPermissions("write");
        entity.Id = id;
        validate(entity);
        return repository.update(entity);
    }

    @Delete("/{id}")
    @Documentation("Delete PaymentRecord by id")
    public void deleteById(@PathParam("id") Integer id) {
        checkPermissions("write");
        if (repository.findOne(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "PaymentRecord not found");
        }
        repository.deleteById(id);
    }

    private List<PaymentRecordEntity> runFilter(Map<String, Object> filter) {
        StringBuilder hql = new StringBuilder("from PaymentRecordEntity e");
        Map<String, Object> params = new LinkedHashMap<>();
        boolean first = true;
        if (filter != null && filter.get("equals") instanceof Map<?, ?> equals) {
            for (Map.Entry<?, ?> entry : equals.entrySet()) {
                String field = requireKnownField(String.valueOf(entry.getKey()));
                String paramName = "p" + params.size();
                hql.append(first ? " where e." : " and e.").append(field).append(" = :").append(paramName);
                params.put(paramName, entry.getValue());
                first = false;
            }
        }
        if (filter != null && filter.get("conditions") instanceof List<?> conditions) {
            for (Object raw : conditions) {
                if (!(raw instanceof Map<?, ?> condition)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter condition");
                }
                String field = requireKnownField(String.valueOf(condition.get("propertyName")));
                String operator = String.valueOf(condition.get("operator")).toUpperCase(Locale.ROOT);
                Object value = condition.get("value");
                String paramName = "p" + params.size();
                String clause = switch (operator) {
                    case "EQ" -> "e." + field + " = :" + paramName;
                    case "IN" -> {
                        if (!(value instanceof Collection<?>)) {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IN value must be a list for field: " + field);
                        }
                        yield "e." + field + " in (:" + paramName + ")";
                    }
                    case "LIKE" -> "e." + field + " like :" + paramName;
                    default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported operator: " + operator);
                };
                hql.append(first ? " where " : " and ").append(clause);
                params.put(paramName, value);
                first = false;
            }
        }
        return repository.query(hql.toString(), params);
    }

    private static String requireKnownField(String field) {
        if (!FILTER_FIELDS.contains(field)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown filter field: " + field);
        }
        return field;
    }

    private void checkPermissions(String op) {
        if ("read".equals(op) && !(UserFacade.isInRole("codbex-payments.PaymentRecord.PaymentRecordReadOnly") || UserFacade.isInRole("codbex-payments.PaymentRecord.PaymentRecordFullAccess"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        if ("write".equals(op) && !UserFacade.isInRole("codbex-payments.PaymentRecord.PaymentRecordFullAccess")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private static void validate(PaymentRecordEntity entity) {
        if (entity.Date == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Date' property is required");
        }
        if (entity.Valor == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Valor' property is required");
        }
        if (entity.OurPartyIBAN == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'OurPartyIBAN' property is required");
        }
        if (entity.OurPartyIBAN != null && entity.OurPartyIBAN.length() > 34) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'OurPartyIBAN' exceeds the maximum length of 34");
        }
        if (entity.OurPartyIBAN != null && !entity.OurPartyIBAN.toString().matches("^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The value of 'OurPartyIBAN' does not match the required pattern '^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$'");
        }
        if (entity.CounterpartyIBAN == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'CounterpartyIBAN' property is required");
        }
        if (entity.CounterpartyIBAN != null && entity.CounterpartyIBAN.length() > 34) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'CounterpartyIBAN' exceeds the maximum length of 34");
        }
        if (entity.CounterpartyIBAN != null && !entity.CounterpartyIBAN.toString().matches("^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The value of 'CounterpartyIBAN' does not match the required pattern '^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$'");
        }
        if (entity.CounterpartyName != null && entity.CounterpartyName.length() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'CounterpartyName' exceeds the maximum length of 100");
        }
        if (entity.Amount == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Amount' property is required");
        }
        if (entity.Currency == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Currency' property is required");
        }
        if (entity.PaymentDirection == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'PaymentDirection' property is required");
        }
        if (entity.PaymentType == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'PaymentType' property is required");
        }
        if (entity.Reason != null && entity.Reason.length() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Reason' exceeds the maximum length of 100");
        }
        if (entity.Description != null && entity.Description.length() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Description' exceeds the maximum length of 100");
        }
        if (entity.UUID != null && entity.UUID.length() > 36) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'UUID' exceeds the maximum length of 36");
        }
        if (entity.Reference != null && entity.Reference.length() > 36) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Reference' exceeds the maximum length of 36");
        }
        if (entity.DeletedReason != null && entity.DeletedReason.length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'DeletedReason' exceeds the maximum length of 255");
        }
        if (entity.CreatedBy != null && entity.CreatedBy.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'CreatedBy' exceeds the maximum length of 20");
        }
        if (entity.UpdatedBy != null && entity.UpdatedBy.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'UpdatedBy' exceeds the maximum length of 20");
        }
    }
}
