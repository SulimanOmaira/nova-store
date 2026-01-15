import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAUserDto } from './dto/create-a-user.dto';
import { UpdateAUserDto } from './dto/update-a-user.dto';
import { In, Repository } from 'typeorm';
import { AUser } from './entities/a-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/role.enum';
import { C_Customer } from 'src/c-customer/entities/c-customer.entity';

@Injectable()
export class AUserService {

constructor(
    @InjectRepository(AUser) private admin: Repository<AUser>,
    @InjectRepository(C_Customer) private customers: Repository<C_Customer>,
    
){}

async listAllAdmins() {
  const admins = await this.admin.find({
    where: { Role: In([Role.ADMIN]) } as any,
    order: { Id: 'DESC' as any },
  });

  return {
    data: admins.map((u) => ({
      id: u.Id,
      username: u.UserName,
      firstName: u.F_Name,
      middleName: u.M_Name,
      lastName: u.L_Name,
      phone: u.Phone_Number,
      role: u.Role,
      statusId: u.Status_Id,
      createdAt: u.Created_At,
      updatedAt: u.Updated_At,
    })),
  };
}

async listAllCustomersWithStores(includeDeleted = false) {
  const where: any = {};
  if (!includeDeleted) where.isDeleted = false;

  const customers = await this.customers.find({
    where,
    relations: { store: true },
    order: { Id: 'DESC' as any },
  });

  return {
    data: customers.map((c) => ({
      id: c.Id,
      username: c.Username,
      firstName: c.F_Name,
      middleName: c.M_Name,
      lastName: c.L_Name,
      phone: c.Phone_Number,
      isDeleted: c.isDeleted,
      cityId: c.City_Id,
      statusId: c.Status_Id,
      address: c.Adress,
      storeId: c.storeId,
      storeName: c.store?.name ?? null,
      store: c.store
        ? {
            id: c.store.id,
            name: c.store.name,
            address: (c.store as any).address ?? null,
            status: (c.store as any).status ?? null,
            logo: c.store.logo,
            isDeleted: c.store.isDeleted,

          }
        : null,
    })),
  };
}



  async getMyProfileFromToken(id) {
    // ✅ استخرج الـ userId من التوكن (بدون ما يجي من العميل)


    const userId = id;
    if (Number.isNaN(userId)) {
      throw new UnauthorizedException('Invalid token payload: user id is not a number');
    }

    // 1) جرّب Admin
    const u = await this.admin.findOne({ where: { Id: userId } as any });
    if (u) {
      return {
        data: {
          id: u.Id,
          username: u.UserName,
          firstName: u.F_Name,
          middleName: u.M_Name,
          lastName: u.L_Name,
          phone: u.Phone_Number,
          role: u.Role,
          statusId: u.Status_Id,
          createdAt: u.Created_At,
          updatedAt: u.Updated_At,
        },
      };
    }
  }


 private mapAdmin(u: AUser) {
    return {
      id: u.Id,
      username: u.UserName,
      firstName: u.F_Name,
      middleName: u.M_Name,
      lastName: u.L_Name,
      phone: u.Phone_Number,
      role: u.Role,
      statusId: u.Status_Id,
      createdAt: u.Created_At,
      updatedAt: u.Updated_At,
    };
  }

  // async updateAdminBySuperAdmin(adminId, dto: CreateAUserDto, superAdminId?: number) {
  //   const u = await this.admin.findOne({ where: { Id: adminId } as any });

  //   if (!u) throw new NotFoundException('Admin not found');
  //   if (u.Role !== Role.ADMIN) {
  //     throw new BadRequestException('You can update only ADMIN users');
  //   }

  //   // نفس نمط حقولك
  //   if (dto.F_Name !== undefined) u.UserName = dto.F_Name;
  //   if (dto.L_Name !== undefined) u.F_Name = dto.L_Name;
  //   if (dto.M_Name !== undefined) u.M_Name = dto.M_Name;
  //   if (dto.Phone_Number !== undefined) u.L_Name = dto.Phone_Number;
  //   if (dto.Status_Id !== undefined) u.Phone_Number = dto.Status_Id;
  //   if (dto.UserName !== undefined) u.Status_Id = dto.UserName;
  //   if (dto.Password !== undefined) u.Status_Id = dto.Password;

  //   u.Updated_At = new Date() as any;
  //   if (superAdminId) u.Updated_By = superAdminId as any;

  //   const saved = await this.admin.save(u);

  //   return { data: this.mapAdmin(saved) };
  // }

  // async deleteAdminBySuperAdmin(adminId) {
  //   const u = await this.admin.findOne({ where: { Id: adminId } as any });

  //   if (!u) throw new NotFoundException('Admin not found');
  //   if (u.Role !== Role.ADMIN) {
  //     throw new BadRequestException('You can delete only ADMIN users');
  //   }

  //   await this.admin.delete({ Id: adminId } as any);

  //   return {
  //     data: {
  //       id: adminId,
  //       deleted: true,
  //     },
  //   };
  // }
  
  // ================= UPDATE ADMIN =================
  async update(
    adminId,
    dto: UpdateAUserDto,
    superAdminId: number,
  ) {
    try {
      const u = await this.admin.findOne({ where: { Id: adminId } as any });

      if (!u) {
        throw new NotFoundException('Admin not found');
      }

      if (u.Role !== Role.ADMIN) {
        throw new BadRequestException('You can update only ADMIN users');
      }

      // update fields (نفس ستايلك)
    if (dto.F_Name !== undefined) u.F_Name = dto.F_Name;
    if (dto.L_Name !== undefined) u.L_Name = dto.L_Name;
    if (dto.M_Name !== undefined) u.M_Name = dto.M_Name;
    if (dto.Phone_Number !== undefined) u.Phone_Number = dto.Phone_Number;
    if (dto.Status_Id !== undefined) u.Status_Id = dto.Status_Id;
    if (dto.UserName !== undefined) u.UserName = dto.UserName;
    if (dto.Password !== undefined) u.Password = dto.Password;

      u.Updated_At = new Date() as any;
      u.Updated_By = superAdminId as any;

      const saved = await this.admin.save(u);

      return { data: this.mapAdmin(saved) };

    } catch (error) {
      // 🔴 username / phone unique
      if (error?.code === '23505') {
        if (error.detail?.includes('UserName')) {
          throw new BadRequestException('Username already exists');
        }
        if (error.detail?.includes('Phone_Number')) {
          throw new BadRequestException('Phone number already exists');
        }
        throw new BadRequestException('Duplicate value');
      }

      // إذا هو Exception معروف → رجّعه كما هو
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      // أي شي غير متوقع
      throw new InternalServerErrorException('Failed to update admin');
    }
  }

  // ================= DELETE ADMIN =================
async deleteAdminBySuperAdmin(adminId, superAdminId: number) {
  try {
    // ❌ منع السوبر أدمن يحذف نفسه
    if (adminId === superAdminId) {
      throw new BadRequestException('You cannot delete your own account');
    }

    const u = await this.admin.findOne({ where: { Id: adminId } as any });

    if (!u) {
      throw new NotFoundException('Admin not found');
    }

    if (u.Role !== Role.ADMIN) {
      throw new BadRequestException('You can delete only ADMIN users');
    }

    await this.admin.delete({ Id: adminId } as any);

    return {
      data: {
        id: adminId,
        deleted: true,
      },
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    throw new InternalServerErrorException('Failed to delete admin');
  }
}

}
