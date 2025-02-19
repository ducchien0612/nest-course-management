import {
    Controller,
    Post,
    Patch,
    Delete,
    Get,
    Param,
    Body,
    Query,
    UseGuards,
    Request,
    ParseIntPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CoursesRequestDto } from './dto/courses-pagination.dto';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    // 1. Thêm mới khóa học
    @UseGuards(JwtAuthGuard)
    @Post()
    async createCourse(@Body() createCourseDto: CreateCourseDto, @Request() req) {
        const creatorId = req.user.userId;
        return this.coursesService.createCourse(createCourseDto, creatorId);
    }

    // 2. Sửa thông tin khóa học
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateCourse(
        @Param('id', ParseIntPipe) courseId: number,
        @Body() updateDto: UpdateCourseDto,
        @Request() req,
    ) {
        return this.coursesService.updateCourse(courseId, req.user.userId, updateDto);
    }

    // 3. Xóa khóa học
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteCourse(@Param('id', ParseIntPipe) courseId: number, @Request() req) {
        await this.coursesService.deleteCourse(courseId, req.user.userId);
        return { message: 'Course deleted successfully' };
    }

    // 4. Xem danh sách tất cả các khóa học (có phân trang)
    // GET /courses?page=1&take=1
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllCourses(@Query() q: CoursesRequestDto) {
        return await this.coursesService.getAllCourses(q);

    }

    // 5. Xem chi tiết 1 khóa học
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getCourseById(@Param('id', ParseIntPipe) courseId: number, @Request() req) {
        console.log(req.user.userId, "111111")
        return this.coursesService.getCourseById(courseId, req.user.userId);
    }
}
