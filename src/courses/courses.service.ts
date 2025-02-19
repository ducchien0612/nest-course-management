import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './course.entity';
import { CoursesPaginated, CoursesRequestDto } from './dto/courses-pagination.dto';
import { PageMetaDto } from 'src/utils/pagination.util';
import { CoursesDto } from './dto/courses.dto';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';

@Injectable()
export class CoursesService {
    private readonly logger = new Logger(CoursesService.name);
    constructor(
        @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
        private readonly enrollmentsService: EnrollmentsService,
    ) { }

    // 1. Thêm mới khóa học
    async createCourse(createCourseDto: CreateCourseDto, creatorId: string): Promise<Course> {
        this.logger.log(`User ${creatorId} is creating a course with title: ${createCourseDto.title}`);
        const course = this.courseRepo.create({
            title: createCourseDto.title,
            description: createCourseDto.description,
            creatorId,
        });
        this.logger.log(`Course ${course.id} created successfully by user ${creatorId}`);
        return this.courseRepo.save(course);
    }

    // 2. Sửa thông tin khóa học
    async updateCourse(courseId: number, userId: string, updateDto: UpdateCourseDto): Promise<Course> {
        const course = await this.courseRepo.findOne({ where: { id: courseId } });
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        // Chỉ người tạo mới được sửa
        if (course.creatorId !== userId) {
            throw new ForbiddenException('You are not the creator of this course');
        }
        Object.assign(course, updateDto);
        return this.courseRepo.save(course);
    }

    // 3. Xóa khóa học
    async deleteCourse(courseId: number, userId: string): Promise<void> {
        const course = await this.courseRepo.findOne({ where: { id: courseId } });
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        if (course.creatorId !== userId) {
            throw new ForbiddenException('You are not the creator of this course');
        }
        await this.courseRepo.remove(course);
    }

    // 4. Xem danh sách khóa học (phân trang)
    async getAllCourses(q: CoursesRequestDto) {
        const [courses, total] = await this.courseRepo.findAndCount({
            skip: q.skip,
            take: q.take,
            order: { id: 'ASC' },
        });
        const meta = new PageMetaDto({ options: q, total });

        return new CoursesPaginated(
            courses.map((e) => new CoursesDto(e)),
            meta,
        );
    }

    // 5. Xem chi tiết 1 khóa học
    async getCourseById(courseId: number, userId: string): Promise<Course> {
        // Kiểm tra enroll
        const isEnrolled = await this.enrollmentsService.isUserEnrolled(userId, courseId);
        if (!isEnrolled) {
            throw new ForbiddenException('You are not enrolled in this course');
        }
        const course = await this.courseRepo.findOne({ where: { id: courseId } });
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        return course;
    }
}
