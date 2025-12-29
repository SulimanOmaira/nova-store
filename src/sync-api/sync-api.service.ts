// // import { BadRequestException, Injectable } from '@nestjs/common';
// // import { DataSource } from 'typeorm';
// // import { SYNC_TABLES, SyncTableConfig } from './sync-table.config';
// // import { SyncPushBodyDto, SyncPushResult } from './sync-api.dto';

// // type PullArgs = {
// //   storeId: string;
// //   deviceId: string;
// //   since: Date | null;
// //   limit: number;
// // };

// // @Injectable()
// // export class SyncApiService {
// //   constructor(private readonly ds: DataSource) {}

// //   // ---------- PULL ----------
// //   async pull(args: PullArgs) {
// //     const { storeId, deviceId, since, limit } = args;

// //     const serverTime = new Date(); // checkpoint واحد بسيط
// //     const sinceDate = since ?? new Date(0);

// //     const data: Record<string, any[]> = {};

// //     // 1) جداول عادية فيها store_id و updated
// //     const normalTables = SYNC_TABLES.filter(
// //       (t) => t.key !== 'invoice_items' && t.key !== 'stores',
// //     );

// //     for (const t of normalTables) {
// //       // device_sync_state نرجّعه فقط للجهاز نفسه
// //       if (t.key === 'device_sync_state') {
// //         data[t.key] = await this.ds.query(
// //           `
// //           SELECT *
// //           FROM ${this.q(t.table)}
// //           WHERE ${this.q(t.storeCol)} = $1 AND ${this.q(t.pk)} = $2
// //           LIMIT 1
// //           `,
// //           [storeId, deviceId],
// //         );
// //         continue;
// //       }

// //       data[t.key] = await this.ds.query(
// //         `
// //         SELECT *
// //         FROM ${this.q(t.table)}
// //         WHERE ${this.q(t.storeCol)} = $1
// //           AND (${this.q(t.updatedCol)} IS NOT NULL)
// //           AND ${this.q(t.updatedCol)} > $2
// //         ORDER BY ${this.q(t.updatedCol)} ASC
// //         LIMIT $3
// //         `,
// //         [storeId, sinceDate, limit],
// //       );
// //     }

// //     // 2) stores: عادة pull للمتجر الحالي فقط
// //     const storeRow = await this.ds.query(
// //       `SELECT * FROM ${this.q('stores')} WHERE id = $1 LIMIT 1`,
// //       [storeId],
// //     );
// //     data['stores'] = storeRow;

// //     // 3) invoice_items: نرجع items الخاصة بفواتير هذا المتجر التي تغيّرت بعد since
// //     // لأن invoice_items ما عنده store_id، نفلتر عبر invoices.updatedat
// //     data['invoice_items'] = await this.ds.query(
// //       `
// //       SELECT ii.*
// //       FROM invoice_items ii
// //       JOIN invoices i ON i.id = ii.invoice_id
// //       WHERE i.store_id = $1
// //         AND i.updatedat > $2
// //       ORDER BY i.updatedat ASC
// //       LIMIT $3
// //       `,
// //       [storeId, sinceDate, limit],
// //     );

// //     // حدّث checkpoint للجهاز بعد pull
// //     await this.upsertDeviceSyncState(storeId, deviceId, serverTime);

// //     return {
// //       serverTime: serverTime.toISOString(),
// //       nextSince: serverTime.toISOString(),
// //       data,
// //     };
// //   }

// //   // ---------- PUSH ----------
// //   async push(body: SyncPushBodyDto): Promise<SyncPushResult> {
// //     const { storeId, deviceId, changes } = body;

// //     if (!storeId || !deviceId) throw new BadRequestException('storeId/deviceId required');

// //     const serverTime = new Date();

// //     // Ack
// //     const accepted: Record<string, string[]> = {};
// //     const rejected: Record<string, { id: string; reason: string }[]> = {};

// //     await this.ds.transaction(async (trx) => {
// //       // ترتيب مهم لتقليل مشاكل FK
// //       const order = [
// //         'stores',
// //         'customers',
// //         'products',
// //         'invoices',
// //         'invoice_items',
// //         'customer_transactions',
// //         'supplier_transactions',
// //         'cashbox',
// //         'stats',
// //         'logs',
// //         'items',
// //         'orders',
// //         'device_sync_state',
// //       ];

// //       for (const key of order) {
// //         const rows = Array.isArray(changes?.[key]) ? changes[key] : [];
// //         if (!rows.length) continue;

// //         const cfg = this.getCfg(key);

// //         // store isolation: افرض store_id على كل row (عدا stores)
// //         const sanitized = rows.map((r) => this.sanitizeRow(cfg, r, storeId, deviceId));

// //         // stores: upsert بدون شرط store
// //         if (key === 'stores') {
// //           const ids = await this.upsertGeneric(trx, cfg, sanitized, {
// //             lwwUpdatedCol: cfg.updatedCol,
// //           });
// //           accepted[key] = ids;
// //           continue;
// //         }

// //         // invoice_items: LWW يعتمد على invoice.updatedat وليس على ii
// //         // if (key === 'invoice_items') {
// //         //   const ids = await this.upsertInvoiceItems(trx, sanitized);
// //         //   accepted[key] = ids;
// //         //   continue;
// //         // }
// //         if (key === 'invoice_items') {
// //           const ids = await this.upsertInvoiceItems(trx, storeId, sanitized);
// //           accepted[key] = ids;
// //           continue;
// //         }

// //         // device_sync_state: نحدثه على السيرفر بآخر وقت مزامنة من الجهاز إذا كان أحدث
// //         if (key === 'device_sync_state') {
// //           const ids = await this.upsertGeneric(trx, cfg, sanitized, {
// //             lwwUpdatedCol: cfg.updatedCol,
// //           });
// //           accepted[key] = ids;
// //           continue;
// //         }

// //         // // باقي الجداول: Upsert + شرط LWW على updatedCol
// //         // const { okIds, staleIds } = await this.upsertWithLww(trx, cfg, sanitized);

// //         // accepted[key] = (accepted[key] ?? []).concat(okIds);
// //         // if (staleIds.length) {
// //         //   rejected[key] = (rejected[key] ?? []).concat(
// //         //     staleIds.map((id) => ({ id, reason: 'stale_update' })),
// //         //   );
// //         // }


// //         // باقي الجداول: Upsert + شرط LWW داخل SQL نفسه (بدون SELECT لكل row)
// //         const ids = await this.upsertGeneric(trx, cfg, sanitized, { lwwUpdatedCol: cfg.updatedCol });
// //         accepted[key] = (accepted[key] ?? []).concat(ids);

// //       }

// //       // بعد نجاح push: حدّث device_sync_state إلى serverTime (checkpoint)
// //       await this.upsertDeviceSyncStateTx(trx, storeId, deviceId, serverTime);
// //     });

// //     return {
// //       accepted,
// //       rejected,
// //       serverTime: serverTime.toISOString(),
// //     };
// //   }

// //   // ================= HELPERS =================

// //   private getCfg(key: string): SyncTableConfig {
// //     const cfg = SYNC_TABLES.find((t) => t.key === key);
// //     if (!cfg) throw new BadRequestException(`Unknown table key: ${key}`);
// //     return cfg;
// //   }

// //   // Quote identifier
// //   private q(ident: string) {
// //     // "snake" أو "Camel" أو أي شيء
// //     return `"${ident.replace(/"/g, '""')}"`;
// //   }

// //   private sanitizeRow(cfg: SyncTableConfig, row: any, storeId: string, deviceId: string) {
// //     const out: any = {};

// //     // copy pk + configured columns فقط
// //     out[cfg.pk] = row?.[cfg.pk];
// //     for (const c of cfg.columns) out[c] = row?.[c];

// //     // enforce store_id for tenant isolation (except stores table)
// //     if (cfg.table !== 'stores') {
// //       out[cfg.storeCol] = storeId;
// //     }

// //     // ensure device id for device_sync_state
// //     if (cfg.table === 'device_sync_state') {
// //       out['deviceId'] = deviceId;
// //       out[cfg.storeCol] = storeId;
// //     }

// //     return out;
// //   }

// //   /**
// //    * Upsert مع شرط LWW:
// //    * - يحاول تحديث فقط إذا incoming.updatedCol > existing.updatedCol
// //    * - ويرجع ids المقبولة + ids المرفوضة بسبب stale
// //    */
// //   private async upsertWithLww(
// //     trx: DataSource['manager'],
// //     cfg: SyncTableConfig,
// //     rows: any[],
// //   ): Promise<{ okIds: string[]; staleIds: string[] }> {
// //     const okIds: string[] = [];
// //     const staleIds: string[] = [];

// //     for (const r of rows) {
// //       const pkVal = r?.[cfg.pk];
// //       if (!pkVal) continue;

// //       // اقرأ updated الحالي من السيرفر (خفيف لأنه pk)
// //       const existing = await trx.query(
// //         `SELECT ${this.q(cfg.pk)} as id, ${this.q(cfg.updatedCol)} as u
// //          FROM ${this.q(cfg.table)}
// //          WHERE ${this.q(cfg.pk)} = $1
// //            AND ${this.q(cfg.storeCol)} = $2
// //          LIMIT 1`,
// //         [pkVal, r[cfg.storeCol]],
// //       );

// //       const incomingU = r?.[cfg.updatedCol] ? new Date(r[cfg.updatedCol]) : null;
// //       const existingU = existing?.[0]?.u ? new Date(existing[0].u) : null;

// //       // إذا السيرفر أحدث أو مساوي: ارفض
// //       if (existingU && incomingU && incomingU <= existingU) {
// //         staleIds.push(String(pkVal));
// //         continue;
// //       }

// //       await this.upsertGeneric(trx, cfg, [r], { lwwUpdatedCol: cfg.updatedCol });
// //       okIds.push(String(pkVal));
// //     }

// //     return { okIds, staleIds };
// //   }

// //   /**
// //    * Upsert عام باستخدام ON CONFLICT
// //    * - لا يستخدم repository.upsert لأننا نحتاج تحكم باسماء الأعمدة + شرط WHERE
// //    * - مبني على PostgreSQL INSERT ... ON CONFLICT DO UPDATE :contentReference[oaicite:4]{index=4}
// //    */
// //   private async upsertGeneric(
// //     trx: DataSource['manager'],
// //     cfg: SyncTableConfig,
// //     rows: any[],
// //     opts?: { lwwUpdatedCol?: string },
// //   ): Promise<string[]> {
// //     const ids: string[] = [];

// //     for (const r of rows) {
// //       const pkVal = r?.[cfg.pk];
// //       if (!pkVal) continue;

// //       const insertCols = [cfg.pk, ...cfg.columns];
// //       // تأكد أن storeCol موجود ضمن الأعمدة (إذا لم يكن ضمن columns)
// //       if (!insertCols.includes(cfg.storeCol)) insertCols.push(cfg.storeCol);

// //       const values = insertCols.map((c) => r?.[c] ?? null);
// //       const params = values.map((_, i) => `$${i + 1}`).join(', ');

// //       const setCols = cfg.columns
// //         .filter((c) => c !== cfg.pk)
// //         .map((c) => `${this.q(c)} = EXCLUDED.${this.q(c)}`)
// //         .join(', ');

// //       const whereLww =
// //         opts?.lwwUpdatedCol
// //           ? `WHERE ${this.q(cfg.table)}.${this.q(opts.lwwUpdatedCol)} IS NULL
// //                  OR EXCLUDED.${this.q(opts.lwwUpdatedCol)} > ${this.q(cfg.table)}.${this.q(opts.lwwUpdatedCol)}`
// //           : '';

// //       const sql = `
// //         INSERT INTO ${this.q(cfg.table)} (${insertCols.map((c) => this.q(c)).join(', ')})
// //         VALUES (${params})
// //         ON CONFLICT (${this.q(cfg.pk)}) DO UPDATE
// //           SET ${setCols}
// //           ${whereLww}
// //       `;

// //       await trx.query(sql, values);
// //       ids.push(String(pkVal));
// //     }

// //     return ids;
// //   }

// //   /**
// //    * invoice_items:
// //    * - لا يوجد updatedAt عندك
// //    * - سنقبل upsert دائمًا (أو يمكنك ربطها بـ invoice.updatedat)
// //    * - أفضل عمليًا: items تأتي مع invoice نفسه
// //    */
// //   // private async upsertInvoiceItems(trx: DataSource['manager'], rows: any[]): Promise<string[]> {
// //   //   const ids: string[] = [];

// //   //   for (const r of rows) {
// //   //     const id = r?.id;
// //   //     if (!id) continue;

// //   //     // upsert بلا LWW
// //   //     const sql = `
// //   //       INSERT INTO "invoice_items"
// //   //         ("id","invoice_id","product_id","product_name","quantity","price","total","is_deleted","dirty")
// //   //       VALUES
// //   //         ($1,$2,$3,$4,$5,$6,$7,$8,$9)
// //   //       ON CONFLICT ("id") DO UPDATE SET
// //   //         "invoice_id"=EXCLUDED."invoice_id",
// //   //         "product_id"=EXCLUDED."product_id",
// //   //         "product_name"=EXCLUDED."product_name",
// //   //         "quantity"=EXCLUDED."quantity",
// //   //         "price"=EXCLUDED."price",
// //   //         "total"=EXCLUDED."total",
// //   //         "is_deleted"=EXCLUDED."is_deleted",
// //   //         "dirty"=EXCLUDED."dirty"
// //   //     `;

// //   //     await trx.query(sql, [
// //   //       r.id,
// //   //       r.invoice_id,
// //   //       r.product_id,
// //   //       r.product_name,
// //   //       r.quantity,
// //   //       r.price,
// //   //       r.total,
// //   //       r.is_deleted ?? false,
// //   //       r.dirty ?? false,
// //   //     ]);

// //   //     ids.push(String(id));
// //   //   }

// //   //   return ids;
// //   // }

// //   private async upsertInvoiceItems(
// //   trx: DataSource['manager'],
// //   storeId: string,
// //   rows: any[],
// // ): Promise<string[]> {
// //   const ids: string[] = [];

// //   for (const r of rows) {
// //     const id = r?.id;
// //     if (!id) continue;

// //     // ✅ تأكد أن invoice_id تابع لنفس المتجر
// //     const ok = await trx.query(
// //       `SELECT 1 FROM "invoices" WHERE "id" = $1 AND "store_id" = $2 LIMIT 1`,
// //       [r.invoice_id, storeId],
// //     );
// //     if (!ok.length) {
// //       continue; // أو سجلها ضمن rejected إذا بدك
// //     }

// //     const sql = `
// //       INSERT INTO "invoice_items"
// //         ("id","invoice_id","product_id","product_name","quantity","price","total","is_deleted","dirty")
// //       VALUES
// //         ($1,$2,$3,$4,$5,$6,$7,$8,$9)
// //       ON CONFLICT ("id") DO UPDATE SET
// //         "invoice_id"=EXCLUDED."invoice_id",
// //         "product_id"=EXCLUDED."product_id",
// //         "product_name"=EXCLUDED."product_name",
// //         "quantity"=EXCLUDED."quantity",
// //         "price"=EXCLUDED."price",
// //         "total"=EXCLUDED."total",
// //         "is_deleted"=EXCLUDED."is_deleted",
// //         "dirty"=EXCLUDED."dirty"
// //     `;

// //     await trx.query(sql, [
// //       r.id,
// //       r.invoice_id,
// //       r.product_id,
// //       r.product_name,
// //       r.quantity,
// //       r.price,
// //       r.total,
// //       r.is_deleted ?? false,
// //       r.dirty ?? false,
// //     ]);

// //     ids.push(String(id));
// //   }

// //   return ids;
// // }

// //   private async upsertDeviceSyncState(storeId: string, deviceId: string, lastSyncAt: Date) {
// //     await this.ds.query(
// //       `
// //       INSERT INTO "device_sync_state" ("deviceId","store_id","lastSyncAt")
// //       VALUES ($1,$2,$3)
// //       ON CONFLICT ("deviceId","store_id") DO UPDATE SET
// //         "lastSyncAt" = EXCLUDED."lastSyncAt"
// //       `,
// //       [deviceId, storeId, lastSyncAt],
// //     );
// //   }

// //   private async upsertDeviceSyncStateTx(
// //     trx: DataSource['manager'],
// //     storeId: string,
// //     deviceId: string,
// //     lastSyncAt: Date,
// //   ) {
// //     await trx.query(
// //       `
// //       INSERT INTO "device_sync_state" ("deviceId","store_id","lastSyncAt")
// //       VALUES ($1,$2,$3)
// //       ON CONFLICT ("deviceId","store_id") DO UPDATE SET
// //         "lastSyncAt" = EXCLUDED."lastSyncAt"
// //       `,
// //       [deviceId, storeId, lastSyncAt],
// //     );
// //   }
// // }

// import { BadRequestException, Injectable } from '@nestjs/common';
// import { DataSource } from 'typeorm';
// import { SYNC_TABLES, SyncTableConfig } from './sync-table.config';
// import { SyncPushBodyDto, SyncPushResult } from './sync-api.dto';

// type PullArgs = {
//   storeId: string;
//   deviceId: string;
//   since: Date | null;
//   limit: number;
// };

// @Injectable()
// export class SyncApiService {
//   constructor(private readonly ds: DataSource) {}

//   // ---------- PULL ----------
//   async pull(args: PullArgs) {
//     const { storeId, deviceId, since, limit } = args;

//     const serverTime = new Date(); // checkpoint واحد بسيط
//     const sinceDate = since ?? new Date(0);

//     const data: Record<string, any[]> = {};

//     // 1) جداول عادية فيها store_id و updated
//     const normalTables = SYNC_TABLES.filter(
//       (t) => t.key !== 'invoice_items' && t.key !== 'stores',
//     );

//     for (const t of normalTables) {
//       // device_sync_state نرجّعه فقط للجهاز نفسه
//       if (t.key === 'device_sync_state') {
//         data[t.key] = await this.ds.query(
//           `
//           SELECT *
//           FROM ${this.q(t.table)}
//           WHERE ${this.q(t.storeCol)} = $1 AND store_id = $2
//           LIMIT 1
//           `,
//           [storeId, deviceId],
//         );
//         continue;
//       }

//       data[t.key] = await this.ds.query(
//         `
//         SELECT *
//         FROM ${this.q(t.table)}
//         WHERE ${this.q(t.storeCol)} = $1
//           AND (${this.q(t.updatedCol)} IS NOT NULL)
//           AND ${this.q(t.updatedCol)} > $2
//         ORDER BY ${this.q(t.updatedCol)} ASC
//         LIMIT $3
//         `,
//         [storeId, sinceDate, limit],
//       );
//     }

//     // 2) stores: عادة pull للمتجر الحالي فقط
//     const storeRow = await this.ds.query(
//       `SELECT * FROM ${this.q('stores')} WHERE id = $1 LIMIT 1`,
//       [storeId],
//     );
//     data['stores'] = storeRow;

//     // 3) invoice_items: نرجع items الخاصة بفواتير هذا المتجر التي تغيّرت بعد since
//     // لأن invoice_items ما عنده store_id، نفلتر عبر invoices.updatedat
//     data['invoice_items'] = await this.ds.query(
//       `
//       SELECT ii.*
//       FROM invoice_items ii
//       JOIN invoices i ON i.id = ii.invoice_id
//       WHERE i.store_id = $1
//         AND i.updated_at  > $2
//       ORDER BY i.updated_at  ASC
//       LIMIT $3
//       `,
//       [storeId, sinceDate, limit],
//     );

//     // حدّث checkpoint للجهاز بعد pull
//     await this.upsertDeviceSyncState(storeId, deviceId, serverTime);

//     return {
//       serverTime: serverTime.toISOString(),
//       nextSince: serverTime.toISOString(),
//       data,
//     };
//   }

//   // ---------- PUSH ----------
//   async push(body: SyncPushBodyDto): Promise<SyncPushResult> {
//     const { storeId, deviceId, changes } = body;

//     if (!storeId || !deviceId) throw new BadRequestException('storeId/deviceId required');

//     const serverTime = new Date();

//     // Ack
//     const accepted: Record<string, string[]> = {};
//     const rejected: Record<string, { id: string; reason: string }[]> = {};

//     await this.ds.transaction(async (trx) => {
//       // ترتيب مهم لتقليل مشاكل FK
//       const order = [
//         'stores',
//         'customers',
//         'products',
//         'invoices',
//         'invoice_items',
//         'customer_transactions',
//         'supplier_transactions',
//         'cashbox',
//         'stats',
//         'logs',
//         'items',
//         'orders',
//         'device_sync_state',
//       ];

//       for (const key of order) {
//         const rows = Array.isArray(changes?.[key]) ? changes[key] : [];
//         if (!rows.length) continue;

//         const cfg = this.getCfg(key);

//         // store isolation: افرض store_id على كل row (عدا stores)
//         const sanitized = rows.map((r) => this.sanitizeRow(cfg, r, storeId, deviceId));

//         // stores: upsert بدون شرط store
//         if (key === 'stores') {
//           const ids = await this.upsertGeneric(trx, cfg, sanitized, {
//             lwwUpdatedCol: cfg.updatedCol,
//           });
//           accepted[key] = ids;
//           continue;
//         }

//         // invoice_items: LWW يعتمد على invoice.updatedat وليس على ii
//         // if (key === 'invoice_items') {
//         //   const ids = await this.upsertInvoiceItems(trx, sanitized);
//         //   accepted[key] = ids;
//         //   continue;
//         // }
//         if (key === 'invoice_items') {
//           const ids = await this.upsertInvoiceItems(trx, storeId, sanitized);
//           accepted[key] = ids;
//           continue;
//         }

//         // device_sync_state: نحدثه على السيرفر بآخر وقت مزامنة من الجهاز إذا كان أحدث
//         if (key === 'device_sync_state') {
//           const ids = await this.upsertGeneric(trx, cfg, sanitized, {
//             lwwUpdatedCol: cfg.updatedCol,
//           });
//           accepted[key] = ids;
//           continue;
//         }

//         // // باقي الجداول: Upsert + شرط LWW على updatedCol
//         // const { okIds, staleIds } = await this.upsertWithLww(trx, cfg, sanitized);

//         // accepted[key] = (accepted[key] ?? []).concat(okIds);
//         // if (staleIds.length) {
//         //   rejected[key] = (rejected[key] ?? []).concat(
//         //     staleIds.map((id) => ({ id, reason: 'stale_update' })),
//         //   );
//         // }


//         // باقي الجداول: Upsert + شرط LWW داخل SQL نفسه (بدون SELECT لكل row)
//         const ids = await this.upsertGeneric(trx, cfg, sanitized, { lwwUpdatedCol: cfg.updatedCol });
//         accepted[key] = (accepted[key] ?? []).concat(ids);

//       }

//       // بعد نجاح push: حدّث device_sync_state إلى serverTime (checkpoint)
//       await this.upsertDeviceSyncStateTx(trx, storeId, deviceId, serverTime);
//     });

//     return {
//       accepted,
//       rejected,
//       serverTime: serverTime.toISOString(),
//     };
//   }

//   // ================= HELPERS =================

//   private getCfg(key: string): SyncTableConfig {
//     const cfg = SYNC_TABLES.find((t) => t.key === key);
//     if (!cfg) throw new BadRequestException(`Unknown table key: ${key}`);
//     return cfg;
//   }

//   // Quote identifier
//   private q(ident: string) {
//     // "snake" أو "Camel" أو أي شيء
//     return `"${ident.replace(/"/g, '""')}"`;
//   }

//   private sanitizeRow(cfg: SyncTableConfig, row: any, storeId: string, deviceId: string) {
//     const out: any = {};

//     // copy pk + configured columns فقط
//     out[cfg.pk] = row?.[cfg.pk];
//     for (const c of cfg.columns) out[c] = row?.[c];

//     // enforce store_id for tenant isolation (except stores table)
//     if (cfg.table !== 'stores') {
//       out[cfg.storeCol] = storeId;
//     }

//     // ensure device id for device_sync_state
//     if (cfg.table === 'device_sync_state') {
//       out['deviceId'] = deviceId;
//       out[cfg.storeCol] = storeId;
//     }

//     return out;
//   }

//   /**
//    * Upsert مع شرط LWW:
//    * - يحاول تحديث فقط إذا incoming.updatedCol > existing.updatedCol
//    * - ويرجع ids المقبولة + ids المرفوضة بسبب stale
//    */
//   private async upsertWithLww(
//     trx: DataSource['manager'],
//     cfg: SyncTableConfig,
//     rows: any[],
//   ): Promise<{ okIds: string[]; staleIds: string[] }> {
//     const okIds: string[] = [];
//     const staleIds: string[] = [];

//     for (const r of rows) {
//       const pkVal = r?.[cfg.pk];
//       if (!pkVal) continue;

//       // اقرأ updated الحالي من السيرفر (خفيف لأنه pk)
//       const existing = await trx.query(
//         `SELECT ${this.q(cfg.pk)} as id, ${this.q(cfg.updatedCol)} as u
//          FROM ${this.q(cfg.table)}
//          WHERE ${this.q(cfg.pk)} = $1
//            AND ${this.q(cfg.storeCol)} = $2
//          LIMIT 1`,
//         [pkVal, r[cfg.storeCol]],
//       );

//       const incomingU = r?.[cfg.updatedCol] ? new Date(r[cfg.updatedCol]) : null;
//       const existingU = existing?.[0]?.u ? new Date(existing[0].u) : null;

//       // إذا السيرفر أحدث أو مساوي: ارفض
//       if (existingU && incomingU && incomingU <= existingU) {
//         staleIds.push(String(pkVal));
//         continue;
//       }

//       await this.upsertGeneric(trx, cfg, [r], { lwwUpdatedCol: cfg.updatedCol });
//       okIds.push(String(pkVal));
//     }

//     return { okIds, staleIds };
//   }

//   /**
//    * Upsert عام باستخدام ON CONFLICT
//    * - لا يستخدم repository.upsert لأننا نحتاج تحكم باسماء الأعمدة + شرط WHERE
//    * - مبني على PostgreSQL INSERT ... ON CONFLICT DO UPDATE :contentReference[oaicite:4]{index=4}
//    */
//   private async upsertGeneric(
//     trx: DataSource['manager'],
//     cfg: SyncTableConfig,
//     rows: any[],
//     opts?: { lwwUpdatedCol?: string },
//   ): Promise<string[]> {
//     const ids: string[] = [];

//     for (const r of rows) {
//       const pkVal = r?.[cfg.pk];
//       if (!pkVal) continue;

//       const insertCols = [cfg.pk, ...cfg.columns];
//       // تأكد أن storeCol موجود ضمن الأعمدة (إذا لم يكن ضمن columns)
//       if (!insertCols.includes(cfg.storeCol)) insertCols.push(cfg.storeCol);

//       const values = insertCols.map((c) => r?.[c] ?? null);
//       const params = values.map((_, i) => `$${i + 1}`).join(', ');

//       const setCols = cfg.columns
//         .filter((c) => c !== cfg.pk)
//         .map((c) => `${this.q(c)} = EXCLUDED.${this.q(c)}`)
//         .join(', ');

//       const whereLww =
//         opts?.lwwUpdatedCol
//           ? `WHERE ${this.q(cfg.table)}.${this.q(opts.lwwUpdatedCol)} IS NULL
//                  OR EXCLUDED.${this.q(opts.lwwUpdatedCol)} > ${this.q(cfg.table)}.${this.q(opts.lwwUpdatedCol)}`
//           : '';

//       const sql = `
//         INSERT INTO ${this.q(cfg.table)} (${insertCols.map((c) => this.q(c)).join(', ')})
//         VALUES (${params})
//         ON CONFLICT (${this.q(cfg.pk)}) DO UPDATE
//           SET ${setCols}
//           ${whereLww}
//       `;

//       await trx.query(sql, values);
//       ids.push(String(pkVal));
//     }

//     return ids;
//   }

//   /**
//    * invoice_items:
//    * - لا يوجد updatedAt عندك
//    * - سنقبل upsert دائمًا (أو يمكنك ربطها بـ invoice.updatedat)
//    * - أفضل عمليًا: items تأتي مع invoice نفسه
//    */
//   // private async upsertInvoiceItems(trx: DataSource['manager'], rows: any[]): Promise<string[]> {
//   //   const ids: string[] = [];

//   //   for (const r of rows) {
//   //     const id = r?.id;
//   //     if (!id) continue;

//   //     // upsert بلا LWW
//   //     const sql = `
//   //       INSERT INTO "invoice_items"
//   //         ("id","invoice_id","product_id","product_name","quantity","price","total","is_deleted","dirty")
//   //       VALUES
//   //         ($1,$2,$3,$4,$5,$6,$7,$8,$9)
//   //       ON CONFLICT ("id") DO UPDATE SET
//   //         "invoice_id"=EXCLUDED."invoice_id",
//   //         "product_id"=EXCLUDED."product_id",
//   //         "product_name"=EXCLUDED."product_name",
//   //         "quantity"=EXCLUDED."quantity",
//   //         "price"=EXCLUDED."price",
//   //         "total"=EXCLUDED."total",
//   //         "is_deleted"=EXCLUDED."is_deleted",
//   //         "dirty"=EXCLUDED."dirty"
//   //     `;

//   //     await trx.query(sql, [
//   //       r.id,
//   //       r.invoice_id,
//   //       r.product_id,
//   //       r.product_name,
//   //       r.quantity,
//   //       r.price,
//   //       r.total,
//   //       r.is_deleted ?? false,
//   //       r.dirty ?? false,
//   //     ]);

//   //     ids.push(String(id));
//   //   }

//   //   return ids;
//   // }

//   private async upsertInvoiceItems(
//   trx: DataSource['manager'],
//   storeId: string,
//   rows: any[],
// ): Promise<string[]> {
//   const ids: string[] = [];

//   for (const r of rows) {
//     const id = r?.id;
//     if (!id) continue;

//     // ✅ تأكد أن invoice_id تابع لنفس المتجر
//     const ok = await trx.query(
//       `SELECT 1 FROM "invoices" WHERE "id" = $1 AND "store_id" = $2 LIMIT 1`,
//       [r.invoice_id, storeId],
//     );
//     if (!ok.length) {
//       continue; // أو سجلها ضمن rejected إذا بدك
//     }

//     const sql = `
//       INSERT INTO "invoice_items"
//         ("id","invoice_id","product_id","product_name","quantity","price","total","is_deleted","dirty")
//       VALUES
//         ($1,$2,$3,$4,$5,$6,$7,$8,$9)
//       ON CONFLICT ("id") DO UPDATE SET
//         "invoice_id"=EXCLUDED."invoice_id",
//         "product_id"=EXCLUDED."product_id",
//         "product_name"=EXCLUDED."product_name",
//         "quantity"=EXCLUDED."quantity",
//         "price"=EXCLUDED."price",
//         "total"=EXCLUDED."total",
//         "is_deleted"=EXCLUDED."is_deleted",
//         "dirty"=EXCLUDED."dirty"
//     `;

//     await trx.query(sql, [
//       r.id,
//       r.invoice_id,
//       r.product_id,
//       r.product_name,
//       r.quantity,
//       r.price,
//       r.total,
//       r.is_deleted ?? false,
//       r.dirty ?? false,
//     ]);

//     ids.push(String(id));
//   }

//   return ids;
// }

//   private async upsertDeviceSyncState(storeId: string, deviceId: string, lastSyncAt: Date) {
//     await this.ds.query(
//       `
//       INSERT INTO "device_sync_state" ("deviceId","store_id","lastSyncAt")
//       VALUES ($1,$2,$3)
//       ON CONFLICT ("deviceId","store_id") DO UPDATE SET
//         "lastSyncAt" = EXCLUDED."lastSyncAt"
//       `,
//       [deviceId, storeId, lastSyncAt],
//     );
//   }

//   private async upsertDeviceSyncStateTx(
//     trx: DataSource['manager'],
//     storeId: string,
//     deviceId: string,
//     lastSyncAt: Date,
//   ) {
//     await trx.query(
//       `
//       INSERT INTO "device_sync_state" ("deviceId","store_id","lastSyncAt")
//       VALUES ($1,$2,$3)
//       ON CONFLICT ("deviceId","store_id") DO UPDATE SET
//         "lastSyncAt" = EXCLUDED."lastSyncAt"
//       `,
//       [deviceId, storeId, lastSyncAt],
//     );
//   }
// }


import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SYNC_TABLES, SyncTableConfig } from './sync-table.config';
import { SyncPushBodyDto, SyncPushResult } from './sync-api.dto';

type PullArgs = {
  storeId: string;
  deviceId: string;
  since: Date | null;
  limit: number;
};

@Injectable()
export class SyncApiService {
  constructor(private readonly ds: DataSource) {}

  // ---------- PULL ----------
  async pull(args: PullArgs) {
    const { storeId, deviceId, since, limit } = args;

    const serverTime = new Date();
    const sinceDate = since ?? new Date(0);

    const data: Record<string, any[]> = {};

    // جداول عادية: استثنِ stores و invoice_items (نعالجهم خاص)
    const normalTables = SYNC_TABLES.filter(
      (t) => t.key !== 'invoice_items' && t.key !== 'stores',
    );

    for (const t of normalTables) {
      // ✅ device_sync_state: رجّع سطر الجهاز نفسه
      if (t.key === 'device_sync_state') {
        data[t.key] = await this.ds.query(
          `
          SELECT *
          FROM ${this.q(t.table)}
          WHERE ${this.q(t.storeCol)} = $1 AND "deviceId" = $2
          LIMIT 1
          `,
          [storeId, deviceId],
        );
        continue;
      }

      data[t.key] = await this.ds.query(
        `
        SELECT *
        FROM ${this.q(t.table)}
        WHERE ${this.q(t.storeCol)} = $1
          AND (${this.q(t.updatedCol)} IS NOT NULL)
          AND ${this.q(t.updatedCol)} > $2
        ORDER BY ${this.q(t.updatedCol)} ASC
        LIMIT $3
        `,
        [storeId, sinceDate, limit],
      );
    }

    // stores: المتجر الحالي فقط
    data['stores'] = await this.ds.query(
      `SELECT * FROM ${this.q('stores')} WHERE id = $1 LIMIT 1`,
      [storeId],
    );

    // ✅ invoice_items بدون invoices: لا يوجد طريقة فلترة صحيحة حسب store
    // لذا: إمّا ترجعها كلها بعد since (إذا كان فيها updated_at)
    // أو ترجعها فارغة لتجنب تسريب بيانات.
    // هنا سأرجعها بعد sinceDate بناءً على updated_at (لو موجود)
    data['invoice_items'] = await this.ds.query(
      `
      SELECT *
      FROM ${this.q('invoice_items')}
      WHERE ${this.q('updated_at')} IS NOT NULL
        AND ${this.q('updated_at')} > $1
      ORDER BY ${this.q('updated_at')} ASC
      LIMIT $2
      `,
      [sinceDate, limit],
    );

    // checkpoint
    await this.upsertDeviceSyncState(storeId, deviceId, serverTime);

    return {
      serverTime: serverTime.toISOString(),
      nextSince: serverTime.toISOString(),
      data,
    };
  }

  // ---------- PUSH ----------
  async push(body: SyncPushBodyDto): Promise<SyncPushResult> {
    const { storeId, deviceId, changes } = body;

    if (!storeId || !deviceId) {
      throw new BadRequestException('storeId/deviceId required');
    }

    const serverTime = new Date();

    const accepted: Record<string, string[]> = {};
    const rejected: Record<string, { id: string; reason: string }[]> = {};

    await this.ds.transaction(async (trx) => {
      // ✅ بدون invoices
      const order = [
        'stores',
        'customers',
        'products',
        'invoice_items',
        'customer_transactions',
        'supplier_transactions',
        'cashbox',
        'stats',
        'logs',
        'items',
        'orders',
        // لا تعالج device_sync_state هنا (سنكتب checkpoint في النهاية)
      ];

      for (const key of order) {
        const rows = Array.isArray(changes?.[key]) ? changes[key] : [];
        if (!rows.length) continue;

        const cfg = this.getCfg(key);

        // ✅ normalize keys camelCase->snake_case قبل sanitize
        const sanitized = rows.map((r) =>
          this.sanitizeRow(cfg, this.normalizeRowKeys(r), storeId, deviceId),
        );

        if (key === 'stores') {
          accepted[key] = await this.upsertGeneric(trx, cfg, sanitized, {
            lwwUpdatedCol: cfg.updatedCol,
          });
          continue;
        }

        if (key === 'invoice_items') {
          // ✅ بدون تحقق invoices (لأنه غير موجود عندك في sync)
          accepted[key] = await this.upsertInvoiceItemsNoInvoiceCheck(trx, sanitized);
          continue;
        }

        // باقي الجداول
        const ids = await this.upsertGeneric(trx, cfg, sanitized, {
          lwwUpdatedCol: cfg.updatedCol,
        });
        accepted[key] = (accepted[key] ?? []).concat(ids);
      }

      // ✅ checkpoint فقط
      await this.upsertDeviceSyncStateTx(trx, storeId, deviceId, serverTime);
    });

    return {
      accepted,
      rejected,
      serverTime: serverTime.toISOString(),
    };
  }

  // ================= HELPERS =================

  private getCfg(key: string): SyncTableConfig {
    const cfg = SYNC_TABLES.find((t) => t.key === key);
    if (!cfg) throw new BadRequestException(`Unknown table key: ${key}`);
    return cfg;
  }

  private q(ident: string) {
    return `"${ident.replace(/"/g, '""')}"`;
  }

  // ---- camelCase -> snake_case normalization ----
  private camelToSnakeKey(k: string) {
    return k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
  }

  private normalizeRowKeys(row: any) {
    if (!row || typeof row !== 'object') return row;
    const out: any = { ...row };
    for (const [k, v] of Object.entries(row)) {
      const snake = this.camelToSnakeKey(k);
      if (!(snake in out)) out[snake] = v;
    }
    return out;
  }

  private sanitizeRow(cfg: SyncTableConfig, row: any, storeId: string, deviceId: string) {
    const out: any = {};

    out[cfg.pk] = row?.[cfg.pk];
    for (const c of cfg.columns) out[c] = row?.[c];

    // enforce store_id for tenant isolation (except stores)
    if (cfg.table !== 'stores') {
      out[cfg.storeCol] = storeId;
    }

    // device_sync_state لا نعالجه هنا (checkpoint له دالة خاصة)
    return out;
  }

  private async upsertGeneric(
    trx: DataSource['manager'],
    cfg: SyncTableConfig,
    rows: any[],
    opts?: { lwwUpdatedCol?: string },
  ): Promise<string[]> {
    const ids: string[] = [];

    for (const r of rows) {
      const pkVal = r?.[cfg.pk];
      if (!pkVal) continue;

      const insertCols = [cfg.pk, ...cfg.columns];
      if (!insertCols.includes(cfg.storeCol)) insertCols.push(cfg.storeCol);

      const values = insertCols.map((c) => r?.[c] ?? null);
      const params = values.map((_, i) => `$${i + 1}`).join(', ');

      const setCols = cfg.columns
        .filter((c) => c !== cfg.pk)
        .map((c) => `${this.q(c)} = EXCLUDED.${this.q(c)}`)
        .join(', ');

      const whereLww =
        opts?.lwwUpdatedCol
          ? `WHERE ${this.q(cfg.table)}.${this.q(opts.lwwUpdatedCol)} IS NULL
                 OR EXCLUDED.${this.q(opts.lwwUpdatedCol)} > ${this.q(cfg.table)}.${this.q(opts.lwwUpdatedCol)}`
          : '';

      const sql = `
        INSERT INTO ${this.q(cfg.table)} (${insertCols.map((c) => this.q(c)).join(', ')})
        VALUES (${params})
        ON CONFLICT (${this.q(cfg.pk)}) DO UPDATE
          SET ${setCols}
          ${whereLww}
      `;

      await trx.query(sql, values);
      ids.push(String(pkVal));
    }

    return ids;
  }

  // ✅ invoice_items بدون invoices
  private async upsertInvoiceItemsNoInvoiceCheck(
    trx: DataSource['manager'],
    rows: any[],
  ): Promise<string[]> {
    const ids: string[] = [];

    for (const r of rows) {
      const id = r?.id;
      if (!id) continue;

      const sql = `
        INSERT INTO "invoice_items"
          ("id","invoice_id","product_id","product_name","quantity","price","total","is_deleted","dirty")
        VALUES
          ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT ("id") DO UPDATE SET
          "invoice_id"=EXCLUDED."invoice_id",
          "product_id"=EXCLUDED."product_id",
          "product_name"=EXCLUDED."product_name",
          "quantity"=EXCLUDED."quantity",
          "price"=EXCLUDED."price",
          "total"=EXCLUDED."total",
          "is_deleted"=EXCLUDED."is_deleted",
          "dirty"=EXCLUDED."dirty"
      `;

      await trx.query(sql, [
        r.id,
        r.invoice_id,
        r.product_id,
        r.product_name,
        r.quantity,
        r.price,
        r.total,
        r.is_deleted ?? false,
        r.dirty ?? false,
      ]);

      ids.push(String(id));
    }

    return ids;
  }

  private async upsertDeviceSyncState(storeId: string, deviceId: string, lastSyncAt: Date) {
    await this.ds.query(
      `
      INSERT INTO "device_sync_state" ("deviceId","store_id","lastSyncAt")
      VALUES ($1,$2,$3)
      ON CONFLICT ("deviceId","store_id") DO UPDATE SET
        "lastSyncAt" = EXCLUDED."lastSyncAt"
      `,
      [deviceId, storeId, lastSyncAt],
    );
  }

  private async upsertDeviceSyncStateTx(
    trx: DataSource['manager'],
    storeId: string,
    deviceId: string,
    lastSyncAt: Date,
  ) {
    await trx.query(
      `
      INSERT INTO "device_sync_state" ("deviceId","store_id","lastSyncAt")
      VALUES ($1,$2,$3)
      ON CONFLICT ("deviceId","store_id") DO UPDATE SET
        "lastSyncAt" = EXCLUDED."lastSyncAt"
      `,
      [deviceId, storeId, lastSyncAt],
    );
  }
}
