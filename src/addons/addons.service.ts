import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Country } from "@prisma/client";
import { CreateAddOnDto, UpdateAddOnDto } from "./dto";

@Injectable()
export class AddOnsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAddOnDto) {
    const { pricing, ...addOnData } = data;

    return this.prisma.addOn.create({
      data: {
        ...addOnData,
        pricing: {
          create: pricing,
        },
      },
      include: {
        pricing: true,
        service: true,
      },
    });
  }

  async findAll(country?: Country, serviceId?: string) {
    const where: any = {};

    if (serviceId) {
      where.serviceId = serviceId;
    }

    const addOns = await this.prisma.addOn.findMany({
      where: {
        ...where,
        isVisible: true,
      },
      include: {
        pricing: country ? { where: { country } } : true,
        service: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: [{ service: { title: "asc" } }, { sortOrder: "asc" }],
    });

    return addOns;
  }

  async findByService(serviceId: string, country?: Country) {
    return this.prisma.addOn.findMany({
      where: {
        serviceId,
        isVisible: true,
      },
      include: {
        pricing: country ? { where: { country } } : true,
      },
      orderBy: { sortOrder: "asc" },
    });
  }

  async findByServiceSlug(serviceSlug: string, country?: Country) {
    const service = await this.prisma.service.findUnique({
      where: { slug: serviceSlug },
    });

    if (!service) {
      throw new NotFoundException(
        `Service with slug "${serviceSlug}" not found`
      );
    }

    return this.findByService(service.id, country);
  }

  async findOne(id: string, country?: Country) {
    const addOn = await this.prisma.addOn.findUnique({
      where: { id },
      include: {
        pricing: country ? { where: { country } } : true,
        service: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!addOn) {
      throw new NotFoundException(`AddOn with ID "${id}" not found`);
    }

    return addOn;
  }

  async update(id: string, data: UpdateAddOnDto) {
    const { pricing, ...addOnData } = data;

    // First verify the add-on exists
    await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      // Update the add-on
      const addOn = await tx.addOn.update({
        where: { id },
        data: addOnData,
      });

      // Update pricing if provided
      if (pricing?.length) {
        // Delete existing pricing
        await tx.addOnPricing.deleteMany({
          where: { addOnId: id },
        });

        // Create new pricing
        await tx.addOnPricing.createMany({
          data: pricing.map((p) => ({
            addOnId: id,
            ...p,
          })),
        });
      }

      return tx.addOn.findUnique({
        where: { id },
        include: {
          pricing: true,
          service: true,
        },
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.addOn.delete({ where: { id } });
  }

  /**
   * Validate that add-ons belong to the same service as the package
   */
  async validateAddOnsForPackage(
    packageId: string,
    addOnIds: string[]
  ): Promise<{ valid: boolean; invalidIds: string[] }> {
    // Get the package's service
    const pkg = await this.prisma.package.findUnique({
      where: { id: packageId },
      select: { serviceId: true },
    });

    if (!pkg) {
      return { valid: false, invalidIds: addOnIds };
    }

    // Get all add-ons and check they belong to the same service
    const addOns = await this.prisma.addOn.findMany({
      where: {
        id: { in: addOnIds },
      },
      select: { id: true, serviceId: true },
    });

    const invalidIds = addOns
      .filter((addOn) => addOn.serviceId !== pkg.serviceId)
      .map((addOn) => addOn.id);

    // Also check for add-ons that don't exist
    const foundIds = addOns.map((a) => a.id);
    const notFoundIds = addOnIds.filter((id) => !foundIds.includes(id));

    return {
      valid: invalidIds.length === 0 && notFoundIds.length === 0,
      invalidIds: [...invalidIds, ...notFoundIds],
    };
  }

  /**
   * Get pricing for multiple add-ons in a specific country
   */
  async getAddOnsPricing(
    addOnIds: string[],
    country: Country
  ): Promise<Map<string, { price: number; currency: string }>> {
    const pricing = await this.prisma.addOnPricing.findMany({
      where: {
        addOnId: { in: addOnIds },
        country,
      },
    });

    const priceMap = new Map<string, { price: number; currency: string }>();
    pricing.forEach((p) => {
      priceMap.set(p.addOnId, {
        price: Number(p.price),
        currency: p.currency,
      });
    });

    return priceMap;
  }
}
