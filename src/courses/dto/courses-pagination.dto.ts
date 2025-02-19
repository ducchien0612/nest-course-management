
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageRequestDto, Paginate } from 'src/utils/pagination.util';
import { CoursesDto } from './courses.dto';


export class CoursesRequestDto extends PageRequestDto {
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  title: string;
}

export class CoursesPaginated extends Paginate(CoursesDto) {}
