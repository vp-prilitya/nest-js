import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Status } from '../constants/status.constant';

export class StatusDto {
  @ApiPropertyOptional({
    enum: Status,
    default: Status.approve,
  })
  @IsEnum(Status)
  @IsOptional()
  readonly status?: Status = Status.approve;
}
