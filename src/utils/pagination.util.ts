import { Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { OrderBy } from 'src/constants/orderby.constants';


export class PageRequestDto {
    @ApiPropertyOptional({
        enum: OrderBy,
        default: OrderBy.ASC,
    })
    @IsEnum(OrderBy)
    @IsOptional()
    readonly order: OrderBy = OrderBy.DESC;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
    })
    @Transform(({ value }) => +value)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 100,
        default: 10,
    })
    @Transform(({ value }) => +value)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    take = 10;

    get skip(): number {
        return (this.page - 1) * this.take;
    }

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    readonly keyword?: string;


}

interface IPageMetaDto {
    options: PageRequestDto;
    total: number;
}

export class PageMetaDto {
    @ApiProperty()
    readonly page: number;

    @ApiProperty()
    readonly take: number;

    @ApiProperty()
    readonly total: number;

    @ApiProperty()
    readonly totalPage: number;

    @ApiProperty()
    readonly hasPreviousPage: boolean;

    @ApiProperty()
    readonly hasNextPage: boolean;

    constructor({ options, total }: IPageMetaDto) {
        this.page = options.page;
        this.take = options.take;
        this.total = total;
        this.totalPage = Math.ceil(this.total / this.take);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.totalPage;
    }
}

export interface IPaginated<T> {
    docs: T[];
    meta: PageMetaDto;
}

export function Paginate<T>(classRef: Type<T>): Type<IPaginated<T>> {
    class Pagination implements IPaginated<T> {
        @ApiProperty({ type: classRef, isArray: true })
        docs: T[];

        @ApiProperty({ type: () => PageMetaDto })
        meta: PageMetaDto;

        constructor(data: T[], meta: PageMetaDto) {
            this.docs = data;
            this.meta = meta;
        }
    }

    return Pagination;
}
