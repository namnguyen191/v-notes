import { SignUpRequestBody } from '@v-notes/shared/api-interfaces';
import { IsEmail, IsString } from 'class-validator';

export class UserCredentialsDto implements SignUpRequestBody {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
