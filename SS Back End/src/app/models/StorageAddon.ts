import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Admin } from './admin';



@Entity()
class StorageAddon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'float' })
    storage: number;


    @Column({ type: 'float' })
    priceMonthly: number;

    @Column()
    description: string;


    @ManyToOne(type => Admin)
    addedBy: Admin;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

export default StorageAddon; 