import { Table, Column, Model, CreatedAt, UpdatedAt, HasMany, Unique, AllowNull, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'EmailVerification' })
export class EmailVerification extends Model {

    @PrimaryKey
    @Column
    public verificationId!: string;

    @Column
    public kind!: string;

    @Column
    public userLoginId!: number;

    @CreatedAt
    public creationDate!: Date;

}
