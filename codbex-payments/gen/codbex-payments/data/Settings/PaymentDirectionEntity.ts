import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('PaymentDirectionEntity')
@Table('CODBEX_PAYMENTDIRECTION')
@Documentation('PaymentDirection entity mapping')
export class PaymentDirectionEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'PAYMENTDIRECTION_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'PAYMENTDIRECTION_NAME',
        type: 'string',
        length: 20,
    })
    public Name!: string;

}

(new PaymentDirectionEntity());
