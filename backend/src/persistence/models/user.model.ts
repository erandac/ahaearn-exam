import { Table, Column, Model, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';

@Table({ tableName: 'UsersLogin' })
export class User extends Model {

    @Column
    public name!: string;

    @CreatedAt
    public creationDate!: Date;

    @UpdatedAt
    public updatedOn!: Date;
}
