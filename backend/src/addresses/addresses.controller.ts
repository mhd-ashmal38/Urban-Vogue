import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  create(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.createAddress(req.user.id, createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user addresses' })
  findAll(@Request() req) {
    return this.addressesService.getUserAddresses(req.user.id);
  }

  @Get('primary')
  @ApiOperation({ summary: 'Get user primary address' })
  getPrimary(@Request() req) {
    return this.addressesService.getPrimaryAddress(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific address' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.addressesService.getAddressById(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an address' })
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.updateAddress(id, req.user.id, updateAddressDto);
  }

  @Patch(':id/primary')
  @ApiOperation({ summary: 'Set address as primary' })
  setPrimary(@Param('id') id: string, @Request() req) {
    return this.addressesService.setPrimaryAddress(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address' })
  remove(@Param('id') id: string, @Request() req) {
    return this.addressesService.deleteAddress(id, req.user.id);
  }
}
