import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { Complaint, ComplaintPriority, ComplaintStatus } from './entities/complaint.entity';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { C_Customer } from 'src/c-customer/entities/c-customer.entity';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepo: Repository<Complaint>,

    @InjectRepository(C_Customer)
    private readonly customerRepo: Repository<C_Customer>,
  ) {}

  // ---------------- CUSTOMER ----------------
  async createByCustomer(customerId: string, dto: CreateComplaintDto) {
    // 1️⃣ جيب العميل
    const customer = await this.customerRepo.findOne({
      where: { Id: Number(customerId), isDeleted: false },
    });

    if (!customer) {
      throw new NotFoundException('customer.NOT_FOUND');
    }

    // 2️⃣ أنشئ الشكوى مع storeId تلقائيًا
    const complaint = this.complaintRepo.create({
      Customer_Id: customerId,
      storeId: customer.storeId, // ✅ هون الإضافة
      Subject: dto.Subject,
      Description: dto.Description,
      Priority: dto.Priority ?? ComplaintPriority.MEDIUM,
      Status: ComplaintStatus.OPEN,
    });

    return this.complaintRepo.save(complaint);
  }

  async listMine(customerId: string, page = 1, limit = 20) {
    const take = Math.min(Math.max(limit, 1), 100);
    const skip = (Math.max(page, 1) - 1) * take;

    const [items, total] = await this.complaintRepo.findAndCount({
      // where: { Customer_Id: customerId },
          where: { Customer_Id: String(Number(customerId)) }, // ✅ أو Number حسب تعريفك

      order: { Created_At: 'DESC' },
      skip,
      take,
    });

    return { items, total, page: Math.max(page, 1), limit: take };
  }

  async getMineById(customerId: string, id: string) {
    const complaint = await this.complaintRepo.findOne({ where: { Id: id } });
    if (!complaint) throw new NotFoundException('complaint.NOT_FOUND');
    if (complaint.Customer_Id !== customerId) {
      throw new ForbiddenException('complaint.FORBIDDEN');
    }
    return complaint;
  }

  // ---------------- ADMIN ----------------
  async adminList(params: {
    page?: number;
    limit?: number;
    status?: ComplaintStatus;
    priority?: ComplaintPriority;
    customerId?: string;
    storeId?: number;
    from?: string;
    to?: string;
  }) {
    const page = Math.max(params.page ?? 1, 1);
    const take = Math.min(Math.max(params.limit ?? 20, 1), 200);
    const skip = (page - 1) * take;

    const where: FindOptionsWhere<Complaint> = {};

    if (params.status) where.Status = params.status;
    if (params.priority) where.Priority = params.priority;
    if (params.customerId) where.Customer_Id = params.customerId;
    if (typeof params.storeId === 'number') where.storeId = params.storeId;

    if (params.from && params.to) {
      where.Created_At = Between(new Date(params.from), new Date(params.to));
    }

    const [items, total] = await this.complaintRepo.findAndCount({
      where,
      order: { Created_At: 'DESC' },
      skip,
      take,
      relations: {
        Customer: true,
        AssignedAdmin: true,
      },
    });

    return { items, total, page, limit: take };
  }

  async adminGetById(id: string) {
    const complaint = await this.complaintRepo.findOne({
      where: { Id: id },
      relations: { Customer: true, AssignedAdmin: true },
    });
    if (!complaint) throw new NotFoundException('complaint.NOT_FOUND');
    return complaint;
  }

  async adminUpdateStatus(id: string, dto: UpdateComplaintStatusDto) {
    const complaint = await this.complaintRepo.findOne({ where: { Id: id } });
    if (!complaint) throw new NotFoundException('complaint.NOT_FOUND');

    complaint.Status = dto.Status;

    if (
      dto.Status === ComplaintStatus.CLOSED ||
      dto.Status === ComplaintStatus.RESOLVED
    ) {
      complaint.Closed_At = complaint.Closed_At ?? new Date();
    } else {
      complaint.Closed_At = null;
    }

    return this.complaintRepo.save(complaint);
  }
}
