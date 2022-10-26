import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
@Entity('forgotpasswords')
export class ForgotPassword {
  @PrimaryColumn()
  email: string;
  @Column()
  newPasswordToken: string;
  @Column()
  timestamp: Date;
}
