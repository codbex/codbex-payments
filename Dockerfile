# Docker descriptor for codbex-payments
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:0.15.0

COPY codbex-payments target/dirigible/repository/root/registry/public/codbex-payments
COPY codbex-payments-data target/dirigible/repository/root/registry/public/codbex-payments-data

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-payments/gen/index.html
