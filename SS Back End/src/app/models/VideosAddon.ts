import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Admin } from './admin';



@Entity()
class VideoAddon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;


    @Column({ type: 'float' })
    priceMonthly: number;



    @Column()
    description: string;


    @ManyToOne(type => Admin)
    addedBy: Admin;


    @Column({ type: 'float' })
    fileSizeLimit: number;

    @Column()
    files: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

export default VideoAddon; 