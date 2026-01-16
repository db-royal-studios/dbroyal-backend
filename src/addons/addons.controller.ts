import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { AddOnsService } from "./addons.service";
import { Country } from "@prisma/client";
import { GetCountry } from "../common/decorators/country.decorator";
import { ApiCountryHeader } from "../common/decorators/api-country-header.decorator";
import { CreateAddOnDto, UpdateAddOnDto } from "./dto";

@ApiTags("addons")
@ApiCountryHeader()
@Controller("addons")
export class AddOnsController {
  constructor(private readonly addOnsService: AddOnsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new add-on (Manager only)" })
  @ApiResponse({ status: 201, description: "Add-on created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  create(@Body() body: CreateAddOnDto) {
    return this.addOnsService.create(body);
  }

  @Get()
  @ApiOperation({ summary: "Get all add-ons" })
  @ApiQuery({
    name: "serviceId",
    required: false,
    description: "Filter by service ID",
  })
  @ApiResponse({ status: 200, description: "Returns all add-ons" })
  findAll(
    @GetCountry() country: Country,
    @Query("serviceId") serviceId?: string
  ) {
    return this.addOnsService.findAll(country, serviceId);
  }

  @Get("service/:serviceId")
  @ApiOperation({ summary: "Get add-ons by service ID" })
  @ApiParam({ name: "serviceId", description: "Service ID" })
  @ApiResponse({ status: 200, description: "Returns add-ons for the service" })
  findByService(
    @GetCountry() country: Country,
    @Param("serviceId") serviceId: string
  ) {
    return this.addOnsService.findByService(serviceId, country);
  }

  @Get("service/slug/:slug")
  @ApiOperation({ summary: "Get add-ons by service slug" })
  @ApiParam({ name: "slug", description: "Service slug" })
  @ApiResponse({ status: 200, description: "Returns add-ons for the service" })
  @ApiResponse({ status: 404, description: "Service not found" })
  findByServiceSlug(
    @GetCountry() country: Country,
    @Param("slug") slug: string
  ) {
    return this.addOnsService.findByServiceSlug(slug, country);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get add-on by ID" })
  @ApiParam({ name: "id", description: "Add-on ID" })
  @ApiResponse({ status: 200, description: "Returns the add-on" })
  @ApiResponse({ status: 404, description: "Add-on not found" })
  findOne(@GetCountry() country: Country, @Param("id") id: string) {
    return this.addOnsService.findOne(id, country);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an add-on (Manager only)" })
  @ApiParam({ name: "id", description: "Add-on ID" })
  @ApiResponse({ status: 200, description: "Add-on updated successfully" })
  @ApiResponse({ status: 404, description: "Add-on not found" })
  update(@Param("id") id: string, @Body() body: UpdateAddOnDto) {
    return this.addOnsService.update(id, body);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an add-on (Manager only)" })
  @ApiParam({ name: "id", description: "Add-on ID" })
  @ApiResponse({ status: 200, description: "Add-on deleted successfully" })
  @ApiResponse({ status: 404, description: "Add-on not found" })
  remove(@Param("id") id: string) {
    return this.addOnsService.remove(id);
  }
}
