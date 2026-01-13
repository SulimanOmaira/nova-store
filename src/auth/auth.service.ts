import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AUser } from 'src/a-user/entities/a-user.entity';
// import { Customer } from 'src/c-customer/entities/c-customer.entity';
import { ASession } from 'src/a-session/entities/a-session.entity';
import { CSession } from 'src/c-session/entities/c-session.entity';
import { CreateAUserDto } from 'src/a-user/dto/create-a-user.dto';
import { CreateCCustomerDto } from 'src/c-customer/dto/create-c-customer.dto';
import { randomUUID } from 'crypto';
import { Store } from 'src/sync/entities/store.entity';
import { C_Customer } from 'src/c-customer/entities/c-customer.entity';
import { UpdateCCustomerDto } from 'src/c-customer/dto/update-c-customer.dto';


@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private readonly ds: DataSource, // ✅
    @InjectRepository(AUser) private aUsers: Repository<AUser>,
    @InjectRepository(C_Customer) private customers: Repository<C_Customer>,
    @InjectRepository(ASession) private aSessions: Repository<ASession>,
    @InjectRepository(CSession) private cSessions: Repository<CSession>,
  ) {}

  async validateAdmin(username: string, password: string) {
    const admin = await this.aUsers.findOne({ where: { UserName: username } });
    if (!admin) return null;
    const ok = await bcrypt.compare(password, admin.Password);
    return ok ? admin : null;
  }

  async validateCustomer(username: string, password: string) {
  console.log('Login attempt:', { username, password });
  const user = await this.customers.findOne({ where: { Username: username } });
  console.log('Found user:', user);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.Password);
  console.log('Password match:', ok);
  return ok ? user : null;
}

  async issueAccessToken(sub: string, role: 'admin'|'customer') {
    const payload = { sub, role };
    return this.jwt.signAsync(payload);
  }

  async loginAdmin(admin: AUser, deviceToken?: string) {
    const access = await this.issueAccessToken(admin.Id, 'admin');
    await this.aSessions.save({
      User_Id: admin.Id as any,
      Token: access,
      Device_Token: deviceToken,
      Created_At: new Date(),
    });
    return { access_token: access, role: 'admin' as const };
  }

  async logoutAdmin(adminId: string, token?: string) {
  if (!token) throw new BadRequestException('TOKEN_REQUIRED');

  await this.aSessions.delete({
    User_Id: adminId as any,
    Token: token,
  });

  return { message: 'ADMIN_LOGGED_OUT' };
}

async logoutCustomer(customerId: string, token?: string) {
  if (!token) throw new BadRequestException('TOKEN_REQUIRED');

  await this.cSessions.delete({
    User_Id: customerId as any,
    Access_Token: token,
  });

  return { message: 'CUSTOMER_LOGGED_OUT' };
}


    async registerAdmin(dto: CreateAUserDto) {
    const exists = await this.aUsers.findOne({ where: { UserName: dto.UserName } });
    if (exists) throw new BadRequestException('USERNAME_ALREADY_EXISTS');
    const hash = await bcrypt.hash(dto.Password, 10);
    const admin = this.aUsers.create({ UserName: dto.UserName, Password: hash , F_Name : dto.F_Name , L_Name: dto.L_Name , M_Name: dto.M_Name , Phone_Number : dto.Phone_Number , Status_Id: dto.Status_Id , Created_At: new Date(),});
    await this.aUsers.save(admin);
    return { id: admin.Id, username: admin.UserName };
  }

//   async registerCustomer(dto: CreateCCustomerDto , userID : string) {
//   const exists = await this.customers.findOne({
//     where: { Username: dto.UserName },
//   });
//   if (exists) {
//     throw new BadRequestException('USERNAME_ALREADY_EXISTS');
//   }
//   const hash = await bcrypt.hash(dto.Password, 10);
//   const user = this.customers.create({
//     Username: dto.UserName,
//     Password: hash,
//     F_Name: dto.F_Name,
//     L_Name: dto.L_Name,
//     M_Name: dto.M_Name,
//     Image_Base64: dto.Image_Base64,
//     Phone_Number: dto.Phone_Number,
//     Status_Id: dto.Status_Id,
//     City_Id: dto.City_Id,
//     Lang_Id: dto.Lang_Id,
//     Adress: dto.Adress,
//     Created_At: new Date(),
//     Created_By: userID
//   });
//   await this.customers.save(user);
//   return {
//     data: {
//       id: user.Id,
//       username: user.Username,
//     },
//   };
// }



async registerCustomer(dto: CreateCCustomerDto, userID: string) {
  // 1) تحقق username
  const exists = await this.customers.findOne({ where: { Username: dto.UserName } });
  if (exists) throw new BadRequestException('USERNAME_ALREADY_EXISTS');

  const hash = await bcrypt.hash(dto.Password, 10);

  return this.ds.transaction(async (trx) => {
    // 2) أنشئ متجر جديد
    // const storeId = randomUUID();

    const store = trx.create(Store, {
      // id: storeId,
      name: dto.StoreName ?? `${dto.F_Name} Store`, // إذا ما عندك StoreName بالـ DTO
      address: dto.Adress ?? null,
      status: 'active',
      logo: null,
      isDeleted: false,
      updatedAt: new Date(),
    });

    const savedStore  = await trx.save(Store, store);
    const storeId = savedStore.id; // رقم int


    // 3) أنشئ Customer مربوط بالمتجر الجديد
    const user = trx.create(C_Customer, {
      Username: dto.UserName,
      Password: hash,
      F_Name: dto.F_Name,
      L_Name: dto.L_Name,
      M_Name: dto.M_Name,
      Image_Base64: dto.Image_Base64,
      Phone_Number: dto.Phone_Number,
      Status_Id: dto.Status_Id,
      City_Id: dto.City_Id,
      Lang_Id: dto.Lang_Id,
      Adress: dto.Adress,
      Created_At: new Date(),
      Updated_At: new Date(),
      Created_By: userID,
      // storeId: storeId,     // ✅ الربط الأساسي
      // store_id: storeId,     // ✅ الربط الأساسي
      // store: store,         // اختياري لكنه مفيد
      storeId: storeId,   // ✅ اسم الحقل في entity
      store: store,
      isDeleted: false,
    });

    await trx.save(C_Customer, user);

    return {
      data: {
        id: user.Id,
        username: user.Username,
        storeId: storeId,
        storeName: store.name,
      },
    };
  });
}

  async loginCustomer(user: C_Customer, deviceToken?: string) {
    const access = await this.issueAccessToken(user.Id.toString(), 'customer');
    await this.cSessions.save({
      User_Id: user.Id as any,
      Access_Token: access,
      Device_Token: deviceToken,
      Created_At: new Date(),
    });
    return { access_token: access, role: 'customer' as const , storeId : user.storeId
      
    };
  }

    async listCustomers(params?: { page?: number; limit?: number; includeDeleted?: boolean }) {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (!params?.includeDeleted) where.isDeleted = false;

    const [items, total] = await this.customers.findAndCount({
      where,
      relations: { store: true },
      order: { Id: 'DESC' as any },
      take: limit,
      skip,
    });

    return {
      data: items.map((u) => ({
        id: u.Id,
        username: u.Username,
        firstName: u.F_Name,
        lastName: u.L_Name,
        phone: u.Phone_Number,
        isDeleted: u.isDeleted,
        storeId: u.storeId,
        City: u.City,
        Status_Id: u.Status_Id,
        Adress: u.Adress,
        transactions: u.transactions,
        City_Id: u.City_Id,
        storeName: u.store?.name ?? null,
      })),
      meta: { page, limit, total },
    };
  }

  // ✅ عرض عميل واحد
  async getCustomer(id: number) {
    const user = await this.customers.findOne({
      where: { Id: id, isDeleted: false },
      relations: { store: true },
    });
    if (!user) throw new NotFoundException('CUSTOMER_NOT_FOUND');

    return {
      data: {
        id: user.Id,
        username: user.Username,
        firstName: user.F_Name,
        lastName: user.L_Name,
        middleName: user.M_Name,
        phone: user.Phone_Number,
        address: user.Adress,
        statusId: user.Status_Id,
        cityId: user.City_Id,
        langId: user.Lang_Id,
        storeId: user.storeId,
        storeName: user.store?.name ?? null,
      },
    };
  }

  // ✅ تعديل عميل (وممكن تعديل اسم/عنوان المتجر كمان إذا بدك)
  async updateCustomer(id: number, dto: UpdateCCustomerDto, adminId: string) {
    return this.ds.transaction(async (trx) => {
      const repo = trx.getRepository(C_Customer);
      const storeRepo = trx.getRepository(Store);

      const user = await repo.findOne({ where: { Id: id, isDeleted: false }, relations: { store: true } });
      if (!user) throw new NotFoundException('CUSTOMER_NOT_FOUND');

      // 1) إذا بدك تمنع تعديل username من هون:
      if (dto.UserName && dto.UserName !== user.Username) {
        // تحقق من التكرار
        const exists = await repo.findOne({ where: { Username: dto.UserName } });
        if (exists) throw new BadRequestException('USERNAME_ALREADY_EXISTS');
        user.Username = dto.UserName;
      }

      // 2) Password: الأفضل Endpoint خاص
      if ((dto as any).Password) {
        throw new BadRequestException('PASSWORD_CHANGE_USE_SEPARATE_ENDPOINT');
      }

      // 3) بقية الحقول
      if (dto.F_Name !== undefined) user.F_Name = dto.F_Name;
      if (dto.L_Name !== undefined) user.L_Name = dto.L_Name;
      if (dto.M_Name !== undefined) user.M_Name = dto.M_Name;
      if (dto.Phone_Number !== undefined) user.Phone_Number = dto.Phone_Number;
      if (dto.Image_Base64 !== undefined) user.Image_Base64 = dto.Image_Base64;
      if (dto.Status_Id !== undefined) user.Status_Id = dto.Status_Id;
      if (dto.City_Id !== undefined) user.City_Id = dto.City_Id;
      if (dto.Lang_Id !== undefined) user.Lang_Id = dto.Lang_Id;
      if (dto.Adress !== undefined) user.Adress = dto.Adress;

      user.Updated_At = new Date();
      user.Updated_By = adminId as any;

      // 4) إذا بدك تسمح بتعديل بيانات المتجر أيضاً (اختياري)
      if (dto.StoreName || dto.Adress) {
        const store = await storeRepo.findOne({ where: { id: user.storeId } });
        if (store) {
          if (dto.StoreName) store.name = dto.StoreName;
          // إذا عندك address للمتجر منفصل عن Adress تبع العميل:
          if (dto.Adress !== undefined) store.address = dto.Adress ?? null;
          store.Updated_At = new Date();
          await storeRepo.save(store);
        }
      }

      await repo.save(user);

      return {
        data: {
          id: user.Id,
          username: user.Username,
          storeId: user.storeId,
        },
      };
    });
  }

  // ✅ حذف (Soft Delete)
  async deleteCustomer(id: number, adminId: string) {
    const user = await this.customers.findOne({ where: { Id: id, isDeleted: false } });
    if (!user) throw new NotFoundException('CUSTOMER_NOT_FOUND');

    user.isDeleted = true;
    user.Updated_At = new Date();
    user.Updated_By = adminId as any;

    await this.customers.save(user);

    return { message: 'CUSTOMER_DELETED', data: { id } };
  }

  // (اختياري) Endpoint خاص لتغيير كلمة السر
  async changeCustomerPassword(id: number, newPassword: string, adminId: string) {
    const user = await this.customers.findOne({ where: { Id: id, isDeleted: false } });
    if (!user) throw new NotFoundException('CUSTOMER_NOT_FOUND');

    user.Password = await bcrypt.hash(newPassword, 10);
    user.Updated_At = new Date();
    user.Updated_By = adminId as any;

    await this.customers.save(user);
    return { message: 'PASSWORD_UPDATED', data: { id } };
  }

}
