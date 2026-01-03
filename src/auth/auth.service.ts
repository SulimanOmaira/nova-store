import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AUser } from 'src/a-user/entities/a-user.entity';
import { C_Customer } from 'src/c-customer/entities/c-customer.entity';
import { ASession } from 'src/a-session/entities/a-session.entity';
import { CSession } from 'src/c-session/entities/c-session.entity';
import { CreateAUserDto } from 'src/a-user/dto/create-a-user.dto';
import { CreateCCustomerDto } from 'src/c-customer/dto/create-c-customer.dto';
import { randomUUID } from 'crypto';
import { Store } from 'src/sync/entities/store.entity';


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
      store_id: storeId,     // ✅ الربط الأساسي
      store: store,         // اختياري لكنه مفيد
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
    const access = await this.issueAccessToken(user.Id, 'customer');
    await this.cSessions.save({
      User_Id: user.Id as any,
      Access_Token: access,
      Device_Token: deviceToken,
      Created_At: new Date(),
    });
    return { access_token: access, role: 'customer' as const };
  }

}
