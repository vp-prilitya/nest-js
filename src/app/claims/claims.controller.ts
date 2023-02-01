import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  Put,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/pages/decorator/api-pagination.decorator';
import { PageOptionsDto } from '../../common/pages/dto/page-options.dto';
import { Roles } from '../auth/decorator/roles/roles.decorator';
import { GuardDto } from '../auth/dto/guard.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { StatusDto } from './dto/status.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('claims')
@ApiBearerAuth()
@ApiTags('Claims')
@ApiForbiddenResponse({ description: 'Unauthorized Request' })
@ApiResponse({ status: 500, description: 'Internal error' })
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Roles('customer')
  @Post()
  @ApiOperation({ summary: 'Create new claim' })
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(@Request() req, @Body() createClaimDto: CreateClaimDto) {
    return this.claimsService.create(createClaimDto, req.user);
  }

  @Roles('staff')
  @Get()
  @ApiOperation({ summary: 'List all data claim' })
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(CreateClaimDto)
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.claimsService.findAll(pageOptionsDto);
  }

  @Roles('customer', 'staff')
  @Get(':id')
  @ApiOperation({ summary: 'Find claim by Id' })
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiNotFoundResponse({ description: 'Data not found' })
  findOne(@Param('id') id: string) {
    return this.claimsService.findOne(+id);
  }

  @Roles('customer')
  @Patch(':id')
  @ApiOperation({ summary: 'Update claim by Id' })
  @ApiCreatedResponse({ description: 'Updated Successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Product Not Found' })
  update(@Param('id') id: string, @Body() updateClaimDto: UpdateClaimDto) {
    return this.claimsService.update(+id, updateClaimDto);
  }

  @Roles('staff')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete claim by Id' })
  @ApiCreatedResponse({ description: 'Deleted Successfully' })
  remove(@Param('id') id: string) {
    return this.claimsService.remove(+id);
  }

  @Roles('staff')
  @Put('status/:id')
  @ApiOperation({ summary: 'Update status claim' })
  @ApiCreatedResponse({ description: 'Updated status Successfully' })
  status(@Param('id') id: string, @Query() statusDto: StatusDto) {
    return this.claimsService.updateStatus(+id, statusDto);
  }
}
