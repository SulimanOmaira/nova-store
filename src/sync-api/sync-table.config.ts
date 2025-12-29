// export type SyncTableConfig = {
//   key: string;                 // المفتاح المستخدم في API: changes[key]
//   table: string;               // اسم جدول DB
//   pk: string;                  // اسم PK column
//   storeCol: string;            // store_id column
//   updatedCol: string;          // updated column في DB
//   deletedCol?: string;         // isDeleted / is_deleted / isdeleted ...
//   // الأعمدة التي تدخل في INSERT/UPDATE (بدون pk عادةً)
//   columns: string[];
// };

// export const SYNC_TABLES: SyncTableConfig[] = [
//   // ===== core sync tables =====
//   {
//     key: 'stores',
//     table: 'stores',
//     pk: 'id',
//     storeCol: 'id',            // stores نفسه PK هو store id
//     updatedCol: 'updated_at',   // عندك updatedAt في entity لكن DB column اسمها updatedAt؟ أنت سميتها "updatedAt"
//     // إذا DB عندك "updatedAt" اكتبها هنا، إذا "updatedat" اكتبها كما هي
//     columns: ['name', 'address', 'status', 'logo', 'is_deleted', 'updated_at'],
//   },

//   {
//     key: 'products',
//     table: 'products',
//     pk: 'id',
//     storeCol: 'store_id',
//     updatedCol: 'updated_at',
//     deletedCol: 'is_deleted',
//     columns: [
//       'store_id','name','category','quantity','minquantity','buyprice','sellprice',
//       'notes','imagepath','supplier_id','unit','barcode','createdat','updated_at',
//       'is_deleted','dirty',
//     ],
//   },

//   {
//     key: 'customers',
//     table: 'c_customer',
//     pk: 'Id',
//     storeCol: 'store_id',
//     updatedCol: 'updated_at',      // مطابق لكودك في Customer
//     deletedCol: 'is_deleted',
//     columns: [
//       'Status_Id','City_Id','Lang_Id',
//       'F_Name','M_Name','L_Name','Username','Adress','Phone_Number','Password',
//       'Image_Base64','Rem','Created_By','Created_At','Updated_By','updated_at',
//       'is_deleted','store_id',
//     ],
//   },

//   // {
//   //   key: 'invoices',
//   //   table: 'invoices',
//   //   pk: 'id',
//   //   storeCol: 'store_id',
//   //   updatedCol: 'updatedat',
//   //   deletedCol: 'isdeleted',
//   //   columns: [
//   //     'store_id','invoicenumber','type','customer_id','supplier_id',
//   //     'subtotal','discount','tax','total','paid','remaining','date',
//   //     'createdat','updatedat','isdeleted','dirty',
//   //   ],
//   // },

//   {
//     key: 'invoice_items',
//     table: 'invoice_items',
//     pk: 'id',
//     storeCol: 'invoice_id', // لا يوجد store_id هنا، لكننا سنفلتره عبر join عند pull (في service)
//     updatedCol: 'updated_at',       // ليس له updatedAt عندك (مشكلة شائعة)
//     deletedCol: 'is_deleted',
//     columns: [
//       'invoice_id','product_id','product_name','quantity','price','total','is_deleted','dirty',
//     ],
//   },

//   {
//     key: 'customer_transactions',
//     table: 'customer_transactions',
//     pk: 'id',
//     storeCol: 'store_id',
//     updatedCol: 'updated_at',
//     deletedCol: 'is_deleted',
//     columns: [
//       'store_id','customer_id','invoice_id','amount','type','note','date',
//       'createdat','updated_at','is_deleted','dirty',
//     ],
//   },

//   {
//     key: 'supplier_transactions',
//     table: 'supplier_transactions',
//     pk: 'id',
//     storeCol: 'store_id',
//     updatedCol: 'updated_at',     // في entity عندك UpdateDateColumn updated_at
//     deletedCol: 'is_deleted',
//     columns: [
//       'store_id','supplier_id','invoice_id','amount','type','note','date',
//       'created_at','updated_at','is_deleted','dirty',
//     ],
//   },

//   {
//     key: 'cashbox',
//     table: 'cashbox',
//     pk: 'id',
//     storeCol: 'store_id',
//     updatedCol: 'updated_at',
//     deletedCol: 'is_deleted',
//     columns: [
//       'store_id','type','amount','note','date','created_at','updated_at','is_deleted','dirty',
//     ],
//   },

//   {
//     key: 'logs',
//     table: 'logs',
//     pk: 'id',
//     storeCol: 'store_id',
//     updatedCol: 'updated_at',
//     deletedCol: 'is_deleted',
//     columns: ['store_id','action','timestamp','updated_at','is_deleted','dirty'],
//   },

//   {
//     key: 'stats',
//     table: 'stats',
//     pk: 'id',
//     storeCol: 'store_id',
//     updatedCol: 'updated_at',
//     deletedCol: 'is_deleted',
//     columns: ['store_id','key','json','created_at','updated_at','is_deleted','dirty'],
//   },

//   {
//     key: 'items',
//     table: 'items',
//     pk: 'id',
//     storeCol: 'store_id',
//     updatedCol: 'updated_at', // عندك updatedAt (بدون mapping) — عدله حسب DB
//     deletedCol: 'is_deleted',
//     columns: ['route','title','icon','is_deleted','updated_at','store_id'],
//   },

//   {
//     key: 'orders',
//     table: 'orders',
//     pk: 'id',
//     storeCol: 'store_id',
//     updatedCol: 'updated_at',
//     deletedCol: 'is_deleted',
//     columns: ['customer','status','total','date','is_deleted','updated_at','store_id','customer_id'],
//   },

//   {
//     key: 'device_sync_state',
//     table: 'device_sync_state',
//     pk: 'deviceId',
//     storeCol: 'store_id',
//     updatedCol: 'lastSyncAt',
//     columns: ['deviceId','store_id','lastSyncAt'],
//   },
// ];

export type SyncTableConfig = {
  key: string;
  table: string;
  pk: string;
  storeCol: string;
  updatedCol: string;
  deletedCol?: string;
  columns: string[];
};

export const SYNC_TABLES: SyncTableConfig[] = [
  {
    key: 'stores',
    table: 'stores',
    pk: 'id',
    storeCol: 'id',
    updatedCol: 'updated_at',
    columns: ['name', 'address', 'status', 'logo', 'is_deleted', 'updated_at'],
  },

  {
    key: 'products',
    table: 'products',
    pk: 'id',
    storeCol: 'store_id',
    updatedCol: 'updated_at',
    deletedCol: 'is_deleted',
    columns: [
      'store_id', 'name', 'category', 'quantity', 'minquantity', 'buyprice', 'sellprice',
      'notes', 'imagepath', 'supplier_id', 'unit', 'barcode',
      // لاحظ: خليها مثل DB عندك. إذا DB فعلاً createdat اتركها، إذا created_at عدلها.
      'createdat', 'updated_at',
      'is_deleted', 'dirty',
    ],
  },

  {
    key: 'customers',
    table: 'c_customer',
    pk: 'Id',
    storeCol: 'store_id',
    updatedCol: 'updated_at',
    deletedCol: 'is_deleted',
    columns: [
      'Status_Id', 'City_Id', 'Lang_Id',
      'F_Name', 'M_Name', 'L_Name', 'Username', 'Adress', 'Phone_Number', 'Password',
      'Image_Base64', 'Rem', 'Created_By', 'Created_At', 'Updated_By', 'updated_at',
      'is_deleted', 'store_id',
    ],
  },

  // {
  //   key: 'invoice_items',
  //   table: 'invoice_items',
  //   pk: 'id',
  //   storeCol: 'invoice_id', // ليس store، لكن نحتاجه كقيمة
  //   updatedCol: 'updated_at',
  //   deletedCol: 'is_deleted',
  //   columns: [
  //     'invoice_id', 'product_id', 'product_name', 'quantity', 'price', 'total', 'is_deleted', 'dirty',
  //   ],
  // },

  {
    key: 'customer_transactions',
    table: 'customer_transactions',
    pk: 'id',
    storeCol: 'store_id',
    updatedCol: 'updated_at',
    deletedCol: 'is_deleted',
    columns: [
      'store_id', 'customer_id', 'invoice_id', 'amount', 'type', 'note', 'date',
      'createdat', 'updated_at', 'is_deleted', 'dirty',
    ],
  },

  {
    key: 'supplier_transactions',
    table: 'supplier_transactions',
    pk: 'id',
    storeCol: 'store_id',
    updatedCol: 'updated_at',
    deletedCol: 'is_deleted',
    columns: [
      'store_id', 'supplier_id', 'invoice_id', 'amount', 'type', 'note', 'date',
      'created_at', 'updated_at', 'is_deleted', 'dirty',
    ],
  },

  {
    key: 'cashbox',
    table: 'cashbox',
    pk: 'id',
    storeCol: 'store_id',
    updatedCol: 'updated_at',
    deletedCol: 'is_deleted',
    columns: [
      'store_id', 'type', 'amount', 'note', 'date', 'created_at', 'updated_at', 'is_deleted', 'dirty',
    ],
  },

  {
    key: 'logs',
    table: 'logs',
    pk: 'id',
    storeCol: 'store_id',
    updatedCol: 'updated_at',
    deletedCol: 'is_deleted',
    columns: ['store_id', 'action', 'timestamp', 'updated_at', 'is_deleted', 'dirty'],
  },

  {
    key: 'stats',
    table: 'stats',
    pk: 'id',
    storeCol: 'store_id',
    updatedCol: 'updated_at',
    deletedCol: 'is_deleted',
    columns: ['store_id', 'key', 'json', 'created_at', 'updated_at', 'is_deleted', 'dirty'],
  },

  {
    key: 'items',
    table: 'items',
    pk: 'id',
    storeCol: 'store_id',
    updatedCol: 'updated_at',
    deletedCol: 'is_deleted',
    columns: ['route', 'title', 'icon', 'is_deleted', 'updated_at', 'store_id'],
  },

  {
    key: 'orders',
    table: 'orders',
    pk: 'id',
    storeCol: 'store_id',
    updatedCol: 'updated_at',
    deletedCol: 'is_deleted',
    columns: ['customer', 'status', 'total', 'date', 'is_deleted', 'updated_at', 'store_id', 'customer_id'],
  },

  // خليه موجود إذا بدك يرجع بالـ pull فقط،
  // لكن لا تمرره عبر upsertGeneric في push (سنفعل ذلك في الخدمة)
  {
    key: 'device_sync_state',
    table: 'device_sync_state',
    pk: 'deviceId',
    storeCol: 'store_id',
    updatedCol: 'lastSyncAt',
    columns: ['deviceId', 'store_id', 'lastSyncAt'],
  },
];
