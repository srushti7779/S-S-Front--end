import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { UserAuth } from "./UserAuth";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:true})
    message: string;

    @Column({nullable:true})
    type: string;

    @Column({nullable:true})
    status: string;

    @Column({nullable:true})
    data: string;

    @Column({nullable:true})
    email: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
