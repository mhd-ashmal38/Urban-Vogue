import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new address for a user
   */
  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    // If setting as primary, unset other primary addresses
    if (createAddressDto.isPrimary) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isPrimary: false },
      });
    }

    return await this.prisma.address.create({
      data: {
        userId,
        ...createAddressDto,
      },
    });
  }

  /**
   * Get all addresses for a user
   */
  async getUserAddresses(userId: string) {
    return await this.prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  /**
   * Get a specific address by ID
   */
  async getAddressById(id: string, userId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new BadRequestException('You do not have permission to access this address');
    }

    return address;
  }

  /**
   * Update an existing address
   */
  async updateAddress(id: string, userId: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.getAddressById(id, userId);

    // If setting as primary, unset other primary addresses
    if (updateAddressDto.isPrimary) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isPrimary: false },
      });
    }

    return await this.prisma.address.update({
      where: { id },
      data: updateAddressDto,
    });
  }

  /**
   * Delete an address
   */
  async deleteAddress(id: string, userId: string) {
    const address = await this.getAddressById(id, userId);

    await this.prisma.address.delete({
      where: { id },
    });

    return { message: 'Address deleted successfully' };
  }

  /**
   * Set an address as primary
   */
  async setPrimaryAddress(id: string, userId: string) {
    const address = await this.getAddressById(id, userId);

    // Unset all other primary addresses
    await this.prisma.address.updateMany({
      where: { userId },
      data: { isPrimary: false },
    });

    // Set this address as primary
    await this.prisma.address.update({
      where: { id },
      data: { isPrimary: true },
    });

    return address;
  }

  /**
   * Get user's primary address
   */
  async getPrimaryAddress(userId: string) {
    return await this.prisma.address.findFirst({
      where: {
        userId,
        isPrimary: true,
      },
    });
  }
}
