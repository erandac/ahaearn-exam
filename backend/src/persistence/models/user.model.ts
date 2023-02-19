import { Table, Column, Model, CreatedAt, UpdatedAt, HasMany, Unique, AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'UsersLogin' })
export class User extends Model {

    @Column
    public firstName!: string;

    @Column
    public lastName!: string;

    @Unique
    @Column
    public email!: string;

    @Column
    public emailStatus!: string;

    @AllowNull
    @Column
    public passwordHash?: string;

    @Column
    public authProvider!: string;

    @CreatedAt
    public creationDate!: Date;

    @UpdatedAt
    public updatedOn!: Date;

    public requireEmailVerification(): boolean {
        return this.authProvider === 'INTERNAL' && this.emailStatus === 'PENDING'
    }

}
