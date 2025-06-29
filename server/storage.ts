import { 
  hospitalUsers, supplierUsers, hospitals, suppliers, medicines, medicineCategories,
  hospitalInventory, supplierInventory, orders, orderItems, quotations, quotationItems,
  purchaseOrders, deliveries, payments, notifications,
  type HospitalUser, type InsertHospitalUser, type SupplierUser, type InsertSupplierUser,
  type Hospital, type InsertHospital, type Supplier, type InsertSupplier,
  type Medicine, type InsertMedicine, type Order, type InsertOrder,
  type Quotation, type InsertQuotation, type PurchaseOrder, type InsertPurchaseOrder
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Hospital Users
  getHospitalUser(id: number): Promise<HospitalUser | undefined>;
  getHospitalUserByUsername(username: string): Promise<HospitalUser | undefined>;
  createHospitalUser(user: InsertHospitalUser): Promise<HospitalUser>;
  
  // Supplier Users
  getSupplierUser(id: number): Promise<SupplierUser | undefined>;
  getSupplierUserByUsername(username: string): Promise<SupplierUser | undefined>;
  createSupplierUser(user: InsertSupplierUser): Promise<SupplierUser>;
  
  // Hospitals
  getHospital(id: number): Promise<Hospital | undefined>;
  createHospital(hospital: InsertHospital): Promise<Hospital>;
  getAllHospitals(): Promise<Hospital[]>;
  
  // Suppliers
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  getAllSuppliers(): Promise<Supplier[]>;
  
  // Medicines
  getMedicine(id: number): Promise<Medicine | undefined>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  updateMedicine(id: number, medicine: Partial<InsertMedicine>): Promise<Medicine>;
  getAllMedicines(): Promise<Medicine[]>;
  searchMedicines(query: string): Promise<Medicine[]>;
  
  // Hospital Inventory
  getHospitalInventory(hospitalId: number): Promise<any[]>;
  getLowStockItems(hospitalId: number): Promise<any[]>;
  updateHospitalStock(hospitalId: number, medicineId: number, quantity: number): Promise<void>;
  updateHospitalInventoryItem(hospitalId: number, medicineId: number, data: any): Promise<void>;
  deleteHospitalInventoryItem(hospitalId: number, itemId: number): Promise<void>;
  
  // Supplier Inventory
  getSupplierInventory(supplierId: number): Promise<any[]>;
  updateSupplierStock(supplierId: number, medicineId: number, quantity: number, price: number): Promise<void>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getHospitalOrders(hospitalId: number): Promise<Order[]>;
  getSupplierOrders(supplierId: number): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<void>;
  
  // Quotations
  createQuotation(quotation: InsertQuotation): Promise<Quotation>;
  getQuotation(id: number): Promise<Quotation | undefined>;
  getQuotationsByOrder(orderId: number): Promise<Quotation[]>;
  getPendingQuotations(supplierId: number): Promise<any[]>;
  getHospitalQuotations(hospitalId: number): Promise<any[]>;
  updateQuotationStatus(id: number, status: string): Promise<void>;
  
  // Purchase Orders
  createPurchaseOrder(po: InsertPurchaseOrder): Promise<PurchaseOrder>;
  getPurchaseOrder(id: number): Promise<PurchaseOrder | undefined>;
  getHospitalPurchaseOrders(hospitalId: number): Promise<PurchaseOrder[]>;
  getSupplierPurchaseOrders(supplierId: number): Promise<PurchaseOrder[]>;
  
  // Dashboard Stats
  getHospitalDashboardStats(hospitalId: number): Promise<any>;
  getSupplierDashboardStats(supplierId: number): Promise<any>;
  
  // Notifications
  createNotification(type: string, userId: number, title: string, message: string, data?: any): Promise<void>;
  getUserNotifications(type: string, userId: number): Promise<any[]>;
  markNotificationRead(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getHospitalUser(id: number): Promise<HospitalUser | undefined> {
    const [user] = await db.select().from(hospitalUsers).where(eq(hospitalUsers.id, id));
    return user || undefined;
  }

  async getHospitalUserByUsername(username: string): Promise<HospitalUser | undefined> {
    const [user] = await db.select().from(hospitalUsers).where(eq(hospitalUsers.username, username));
    return user || undefined;
  }

  async createHospitalUser(insertUser: InsertHospitalUser): Promise<HospitalUser> {
    const [user] = await db.insert(hospitalUsers).values(insertUser).returning();
    return user;
  }

  async getSupplierUser(id: number): Promise<SupplierUser | undefined> {
    const [user] = await db.select().from(supplierUsers).where(eq(supplierUsers.id, id));
    return user || undefined;
  }

  async getSupplierUserByUsername(username: string): Promise<SupplierUser | undefined> {
    const [user] = await db.select().from(supplierUsers).where(eq(supplierUsers.username, username));
    return user || undefined;
  }

  async createSupplierUser(insertUser: InsertSupplierUser): Promise<SupplierUser> {
    const [user] = await db.insert(supplierUsers).values(insertUser).returning();
    return user;
  }

  async getHospital(id: number): Promise<Hospital | undefined> {
    const [hospital] = await db.select().from(hospitals).where(eq(hospitals.id, id));
    return hospital || undefined;
  }

  async createHospital(insertHospital: InsertHospital): Promise<Hospital> {
    const [hospital] = await db.insert(hospitals).values(insertHospital).returning();
    return hospital;
  }

  async getAllHospitals(): Promise<Hospital[]> {
    return await db.select().from(hospitals).where(eq(hospitals.isActive, true));
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier || undefined;
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const [supplier] = await db.insert(suppliers).values(insertSupplier).returning();
    return supplier;
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).where(eq(suppliers.isActive, true));
  }

  async getMedicine(id: number): Promise<Medicine | undefined> {
    const [medicine] = await db.select().from(medicines).where(eq(medicines.id, id));
    return medicine || undefined;
  }

  async createMedicine(insertMedicine: InsertMedicine): Promise<Medicine> {
    const [medicine] = await db.insert(medicines).values(insertMedicine).returning();
    return medicine;
  }

  async updateMedicine(id: number, updateData: Partial<InsertMedicine>): Promise<Medicine> {
    const [medicine] = await db.update(medicines)
      .set(updateData)
      .where(eq(medicines.id, id))
      .returning();
    return medicine;
  }

  async getAllMedicines(): Promise<Medicine[]> {
    return await db.select().from(medicines).where(eq(medicines.isActive, true));
  }

  async searchMedicines(query: string): Promise<Medicine[]> {
    return await db.select().from(medicines)
      .where(sql`${medicines.name} ILIKE ${`%${query}%`} OR ${medicines.genericName} ILIKE ${`%${query}%`}`);
  }

  async getHospitalInventory(hospitalId: number): Promise<any[]> {
    return await db
      .select({
        id: hospitalInventory.id,
        medicineId: hospitalInventory.medicineId,
        medicineName: medicines.name,
        genericName: medicines.genericName,
        brand: medicines.brand,
        currentStock: hospitalInventory.currentStock,
        reorderPoint: hospitalInventory.reorderPoint,
        maxStock: hospitalInventory.maxStock,
        unitCost: hospitalInventory.unitCost,
        batchNumber: hospitalInventory.batchNumber,
        expiryDate: hospitalInventory.expiryDate,
        supplier: hospitalInventory.supplier,
        location: hospitalInventory.location,
        lastUpdated: hospitalInventory.lastUpdated,
      })
      .from(hospitalInventory)
      .innerJoin(medicines, eq(hospitalInventory.medicineId, medicines.id))
      .where(eq(hospitalInventory.hospitalId, hospitalId));
  }

  async getLowStockItems(hospitalId: number): Promise<any[]> {
    return await db
      .select({
        id: hospitalInventory.id,
        medicineId: hospitalInventory.medicineId,
        medicineName: medicines.name,
        genericName: medicines.genericName,
        brand: medicines.brand,
        currentStock: hospitalInventory.currentStock,
        reorderPoint: hospitalInventory.reorderPoint,
        maxStock: hospitalInventory.maxStock,
      })
      .from(hospitalInventory)
      .innerJoin(medicines, eq(hospitalInventory.medicineId, medicines.id))
      .where(
        and(
          eq(hospitalInventory.hospitalId, hospitalId),
          sql`${hospitalInventory.currentStock} <= ${hospitalInventory.reorderPoint}`
        )
      );
  }

  async updateHospitalStock(hospitalId: number, medicineId: number, quantity: number): Promise<void> {
    // Check if inventory item exists
    const existing = await db
      .select()
      .from(hospitalInventory)
      .where(
        and(
          eq(hospitalInventory.hospitalId, hospitalId),
          eq(hospitalInventory.medicineId, medicineId)
        )
      );

    if (existing.length > 0) {
      // Update existing inventory
      await db
        .update(hospitalInventory)
        .set({ 
          currentStock: quantity,
          lastUpdated: new Date()
        })
        .where(
          and(
            eq(hospitalInventory.hospitalId, hospitalId),
            eq(hospitalInventory.medicineId, medicineId)
          )
        );
    } else {
      // Insert new inventory item
      await db
        .insert(hospitalInventory)
        .values({
          hospitalId,
          medicineId,
          currentStock: quantity,
          reorderPoint: 10,
          maxStock: 100,
          unitCost: '0',
          batchNumber: '',
          supplier: '',
          location: '',
          lastUpdated: new Date()
        });
    }
  }

  async updateHospitalInventoryItem(hospitalId: number, medicineId: number, data: any): Promise<void> {
    // Check if inventory item exists
    const existing = await db
      .select()
      .from(hospitalInventory)
      .where(
        and(
          eq(hospitalInventory.hospitalId, hospitalId),
          eq(hospitalInventory.medicineId, medicineId)
        )
      );

    const updateData = {
      currentStock: data.currentStock || 0,
      reorderPoint: data.reorderPoint || 10,
      maxStock: data.maxStock || 100,
      unitCost: data.unitCost?.toString() || '0',
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      batchNumber: data.batchNumber || '',
      supplier: data.supplier || '',
      location: data.location || '',
      lastUpdated: new Date()
    };

    if (existing.length > 0) {
      // Update existing inventory
      await db
        .update(hospitalInventory)
        .set(updateData)
        .where(
          and(
            eq(hospitalInventory.hospitalId, hospitalId),
            eq(hospitalInventory.medicineId, medicineId)
          )
        );
    } else {
      // Insert new inventory item
      await db
        .insert(hospitalInventory)
        .values({
          hospitalId,
          medicineId,
          currentStock: updateData.currentStock,
          reorderPoint: updateData.reorderPoint,
          maxStock: updateData.maxStock,
          unitCost: updateData.unitCost,
          expiryDate: updateData.expiryDate,
          batchNumber: updateData.batchNumber,
          supplier: updateData.supplier,
          location: updateData.location
        });
    }
  }

  async deleteHospitalInventoryItem(hospitalId: number, itemId: number): Promise<void> {
    await db
      .delete(hospitalInventory)
      .where(
        and(
          eq(hospitalInventory.hospitalId, hospitalId),
          eq(hospitalInventory.id, itemId)
        )
      );
  }

  async getSupplierInventory(supplierId: number): Promise<any[]> {
    return await db
      .select({
        id: supplierInventory.id,
        medicineId: supplierInventory.medicineId,
        medicineName: medicines.name,
        genericName: medicines.genericName,
        brand: medicines.brand,
        availableStock: supplierInventory.availableStock,
        unitPrice: supplierInventory.unitPrice,
        minOrderQuantity: supplierInventory.minOrderQuantity,
        batchNumber: supplierInventory.batchNumber,
        expiryDate: supplierInventory.expiryDate,
        isActive: supplierInventory.isActive,
      })
      .from(supplierInventory)
      .innerJoin(medicines, eq(supplierInventory.medicineId, medicines.id))
      .where(eq(supplierInventory.supplierId, supplierId));
  }

  async updateSupplierStock(supplierId: number, medicineId: number, quantity: number, price: number): Promise<void> {
    await db
      .update(supplierInventory)
      .set({ 
        availableStock: quantity,
        unitPrice: price.toString(),
        lastUpdated: new Date()
      })
      .where(
        and(
          eq(supplierInventory.supplierId, supplierId),
          eq(supplierInventory.medicineId, medicineId)
        )
      );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const [order] = await db
      .insert(orders)
      .values({ ...insertOrder, orderNumber })
      .returning();
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getHospitalOrders(hospitalId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.hospitalId, hospitalId))
      .orderBy(desc(orders.createdAt));
  }

  async getSupplierOrders(supplierId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.supplierId, supplierId))
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: number, status: string): Promise<void> {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
  }

  async createQuotation(insertQuotation: InsertQuotation): Promise<Quotation> {
    const quotationNumber = `QUO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const [quotation] = await db
      .insert(quotations)
      .values({ ...insertQuotation, quotationNumber })
      .returning();
    return quotation;
  }

  async getQuotation(id: number): Promise<Quotation | undefined> {
    const [quotation] = await db.select().from(quotations).where(eq(quotations.id, id));
    return quotation || undefined;
  }

  async getQuotationsByOrder(orderId: number): Promise<Quotation[]> {
    return await db.select().from(quotations).where(eq(quotations.orderId, orderId));
  }

  async getPendingQuotations(supplierId: number): Promise<any[]> {
    return await db
      .select({
        id: quotations.id,
        quotationNumber: quotations.quotationNumber,
        orderId: quotations.orderId,
        orderNumber: orders.orderNumber,
        hospitalName: hospitals.name,
        status: quotations.status,
        validUntil: quotations.validUntil,
        createdAt: quotations.createdAt,
      })
      .from(quotations)
      .innerJoin(orders, eq(quotations.orderId, orders.id))
      .innerJoin(hospitals, eq(orders.hospitalId, hospitals.id))
      .where(
        and(
          eq(quotations.supplierId, supplierId),
          eq(quotations.status, 'pending')
        )
      )
      .orderBy(desc(quotations.createdAt));
  }

  async getHospitalQuotations(hospitalId: number): Promise<any[]> {
    return await db
      .select({
        id: quotations.id,
        quotationNumber: quotations.quotationNumber,
        orderId: quotations.orderId,
        orderNumber: orders.orderNumber,
        supplierName: suppliers.name,
        status: quotations.status,
        totalAmount: quotations.totalAmount,
        validUntil: quotations.validUntil,
        submittedAt: quotations.submittedAt,
      })
      .from(quotations)
      .innerJoin(orders, eq(quotations.orderId, orders.id))
      .innerJoin(suppliers, eq(quotations.supplierId, suppliers.id))
      .where(eq(quotations.hospitalId, hospitalId))
      .orderBy(desc(quotations.createdAt));
  }

  async updateQuotationStatus(id: number, status: string): Promise<void> {
    await db.update(quotations).set({ status }).where(eq(quotations.id, id));
  }

  async createPurchaseOrder(insertPO: InsertPurchaseOrder): Promise<PurchaseOrder> {
    const poNumber = `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const [po] = await db
      .insert(purchaseOrders)
      .values({ ...insertPO, poNumber })
      .returning();
    return po;
  }

  async getPurchaseOrder(id: number): Promise<PurchaseOrder | undefined> {
    const [po] = await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, id));
    return po || undefined;
  }

  async getHospitalPurchaseOrders(hospitalId: number): Promise<PurchaseOrder[]> {
    return await db
      .select()
      .from(purchaseOrders)
      .where(eq(purchaseOrders.hospitalId, hospitalId))
      .orderBy(desc(purchaseOrders.createdAt));
  }

  async getSupplierPurchaseOrders(supplierId: number): Promise<PurchaseOrder[]> {
    return await db
      .select()
      .from(purchaseOrders)
      .where(eq(purchaseOrders.supplierId, supplierId))
      .orderBy(desc(purchaseOrders.createdAt));
  }

  async getHospitalDashboardStats(hospitalId: number): Promise<any> {
    const [inventoryValue] = await db
      .select({ 
        value: sql<number>`SUM(${hospitalInventory.currentStock} * ${hospitalInventory.unitCost})` 
      })
      .from(hospitalInventory)
      .where(eq(hospitalInventory.hospitalId, hospitalId));

    const [pendingOrders] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(orders)
      .where(
        and(
          eq(orders.hospitalId, hospitalId),
          sql`${orders.status} IN ('pending', 'approved', 'quotation_requested')`
        )
      );

    const [lowStockCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(hospitalInventory)
      .where(
        and(
          eq(hospitalInventory.hospitalId, hospitalId),
          sql`${hospitalInventory.currentStock} <= ${hospitalInventory.reorderPoint}`
        )
      );

    const [monthlySpending] = await db
      .select({ 
        amount: sql<number>`SUM(${purchaseOrders.totalAmount})` 
      })
      .from(purchaseOrders)
      .where(
        and(
          eq(purchaseOrders.hospitalId, hospitalId),
          sql`${purchaseOrders.createdAt} >= DATE_TRUNC('month', CURRENT_DATE)`
        )
      );

    return {
      inventoryValue: inventoryValue?.value || 0,
      pendingOrders: pendingOrders?.count || 0,
      lowStockItems: lowStockCount?.count || 0,
      monthlySpending: monthlySpending?.amount || 0,
    };
  }

  async getSupplierDashboardStats(supplierId: number): Promise<any> {
    const [monthlyRevenue] = await db
      .select({ 
        revenue: sql<number>`SUM(${purchaseOrders.totalAmount})` 
      })
      .from(purchaseOrders)
      .where(
        and(
          eq(purchaseOrders.supplierId, supplierId),
          sql`${purchaseOrders.createdAt} >= DATE_TRUNC('month', CURRENT_DATE)`
        )
      );

    const [activeOrders] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(purchaseOrders)
      .where(
        and(
          eq(purchaseOrders.supplierId, supplierId),
          sql`${purchaseOrders.status} IN ('created', 'confirmed', 'in_progress', 'shipped')`
        )
      );

    const [pendingQuotations] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(quotations)
      .where(
        and(
          eq(quotations.supplierId, supplierId),
          eq(quotations.status, 'pending')
        )
      );

    const [hospitalPartners] = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${orders.hospitalId})` })
      .from(orders)
      .where(eq(orders.supplierId, supplierId));

    return {
      monthlyRevenue: monthlyRevenue?.revenue || 0,
      activeOrders: activeOrders?.count || 0,
      pendingQuotations: pendingQuotations?.count || 0,
      hospitalPartners: hospitalPartners?.count || 0,
    };
  }

  async createNotification(type: string, userId: number, title: string, message: string, data?: any): Promise<void> {
    await db.insert(notifications).values({
      type,
      userId,
      title,
      message,
      data,
    });
  }

  async getUserNotifications(type: string, userId: number): Promise<any[]> {
    return await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.type, type),
          eq(notifications.userId, userId)
        )
      )
      .orderBy(desc(notifications.createdAt))
      .limit(10);
  }

  async markNotificationRead(id: number): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }
}

export const storage = new DatabaseStorage();
