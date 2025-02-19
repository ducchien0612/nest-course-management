
import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../course.entity';

export class CoursesDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;


  constructor(entity: Course) {
    this.id = entity.id;
    this.title = entity.title;
    this.description = entity.description;
  }
}
