import { Module } from "@nestjs/common";
import { AddOnsService } from "./addons.service";
import { AddOnsController } from "./addons.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AddOnsController],
  providers: [AddOnsService],
  exports: [AddOnsService],
})
export class AddOnsModule {}
