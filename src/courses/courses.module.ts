import { Module, forwardRef} from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]), forwardRef(() => EnrollmentsModule)
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule { }
