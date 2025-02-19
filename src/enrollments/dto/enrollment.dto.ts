
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber} from 'class-validator';

export class EnrollmentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  courseId: number; 

}
