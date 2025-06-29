import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Hospital Users
export const hospitalUsers = pgTable("hospital_users", {
  id: serial("id").primaryKey(),
  hospitalId: integer("hospital_id").references(() => hospitals.id),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(), // admin, procurement_manager, pharmacist, department_head
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Supplier Users
export const supplierUsers = pgTable("supplier_users", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(), // admin, sales_rep, delivery_personnel, catalog_manager
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Hospitals
export const hospitals = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  contactPerson: text("contact_person").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Suppliers
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  contactPerson: text("contact_person").notNull(),
  paymentTerms: text("payment_terms").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medicine Categories
export const medicineCategories = pgTable("medicine_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

// Medicines
export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Medicine Name
  genericName: text("generic_name").notNull(), // Composition
  brand: text("brand").notNull(), // Brand Name
  brandName: text("brand_name"), // Alternative brand name field
  categoryId: integer("category_id").references(() => medicineCategories.id),
  strength: text("strength").notNull(),
  dosageForm: text("dosage_form").notNull(), // tablet, capsule, injection, etc.
  route: text("route"), // Oral, IV, Topical, etc.
  category: text("category"), // Antibiotic, Analgesic, etc.
  hsnCode: text("hsn_code"), // HSN Code for billing
  gstPercent: decimal("gst_percent", { precision: 5, scale: 2 }).default('0'), // GST Percentage
  unitOfMeasure: text("unit_of_measure").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Hospital Inventory
export const hospitalInventory = pgTable("hospital_inventory", {
  id: serial("id").primaryKey(),
  hospitalId: integer("hospital_id").references(() => hospitals.id),
  medicineId: integer("medicine_id").references(() => medicines.id),
  currentStock: integer("current_stock").notNull().default(0),
  reorderPoint: integer("reorder_point").notNull(),
  maxStock: integer("max_stock").notNull(),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  batchNumber: text("batch_number"),
  expiryDate: timestamp("expiry_date"),
  supplier: text("supplier"),
  location: text("location"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Supplier Inventory
export const supplierInventory = pgTable("supplier_inventory", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  medicineId: integer("medicine_id").references(() => medicines.id),
  availableStock: integer("available_stock").notNull().default(0),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  minOrderQuantity: integer("min_order_quantity").notNull().default(1),
  batchNumber: text("batch_number"),
  expiryDate: timestamp("expiry_date"),
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  hospitalId: integer("hospital_id").references(() => hospitals.id),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  status: text("status").notNull(), // pending, approved, quotation_requested, quotation_received, purchase_order_created, in_transit, delivered, completed, cancelled
  priority: text("priority").notNull().default("standard"), // urgent, standard, low
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
  requestedBy: integer("requested_by").references(() => hospitalUsers.id),
  approvedBy: integer("approved_by").references(() => hospitalUsers.id),
  orderDate: timestamp("order_date").defaultNow(),
  requiredDate: timestamp("required_date").notNull(),
  completedDate: timestamp("completed_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Order Items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  medicineId: integer("medicine_id").references(() => medicines.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("pending"),
});

// Quotations
export const quotations = pgTable("quotations", {
  id: serial("id").primaryKey(),
  quotationNumber: text("quotation_number").notNull().unique(),
  orderId: integer("order_id").references(() => orders.id),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  hospitalId: integer("hospital_id").references(() => hospitals.id),
  status: text("status").notNull(), // pending, submitted, accepted, rejected, expired
  validUntil: timestamp("valid_until").notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
  deliveryTerms: text("delivery_terms"),
  paymentTerms: text("payment_terms"),
  notes: text("notes"),
  submittedAt: timestamp("submitted_at"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quotation Items
export const quotationItems = pgTable("quotation_items", {
  id: serial("id").primaryKey(),
  quotationId: integer("quotation_id").references(() => quotations.id),
  medicineId: integer("medicine_id").references(() => medicines.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  availability: text("availability").notNull().default("available"),
  leadTime: integer("lead_time"), // days
});

// Purchase Orders
export const purchaseOrders = pgTable("purchase_orders", {
  id: serial("id").primaryKey(),
  poNumber: text("po_number").notNull().unique(),
  orderId: integer("order_id").references(() => orders.id),
  quotationId: integer("quotation_id").references(() => quotations.id),
  hospitalId: integer("hospital_id").references(() => hospitals.id),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  status: text("status").notNull(), // created, confirmed, in_progress, shipped, delivered, completed, cancelled
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  expectedDeliveryDate: timestamp("expected_delivery_date"),
  actualDeliveryDate: timestamp("actual_delivery_date"),
  createdBy: integer("created_by").references(() => hospitalUsers.id),
  confirmedBy: integer("confirmed_by").references(() => supplierUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Deliveries
export const deliveries = pgTable("deliveries", {
  id: serial("id").primaryKey(),
  deliveryNumber: text("delivery_number").notNull().unique(),
  purchaseOrderId: integer("purchase_order_id").references(() => purchaseOrders.id),
  vehicleNumber: text("vehicle_number"),
  driverName: text("driver_name"),
  driverPhone: text("driver_phone"),
  status: text("status").notNull(), // scheduled, in_transit, delivered, failed
  scheduledDate: timestamp("scheduled_date"),
  deliveredDate: timestamp("delivered_date"),
  receivedBy: text("received_by"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  paymentNumber: text("payment_number").notNull().unique(),
  purchaseOrderId: integer("purchase_order_id").references(() => purchaseOrders.id),
  hospitalId: integer("hospital_id").references(() => hospitals.id),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").notNull(), // pending, processed, completed, failed
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  reference: text("reference"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // hospital, supplier
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: jsonb("data"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const hospitalUsersRelations = relations(hospitalUsers, ({ one }) => ({
  hospital: one(hospitals, {
    fields: [hospitalUsers.hospitalId],
    references: [hospitals.id],
  }),
}));

export const supplierUsersRelations = relations(supplierUsers, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [supplierUsers.supplierId],
    references: [suppliers.id],
  }),
}));

export const hospitalsRelations = relations(hospitals, ({ many }) => ({
  users: many(hospitalUsers),
  inventory: many(hospitalInventory),
  orders: many(orders),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  users: many(supplierUsers),
  inventory: many(supplierInventory),
  quotations: many(quotations),
}));

export const medicinesRelations = relations(medicines, ({ one, many }) => ({
  category: one(medicineCategories, {
    fields: [medicines.categoryId],
    references: [medicineCategories.id],
  }),
  hospitalInventory: many(hospitalInventory),
  supplierInventory: many(supplierInventory),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  hospital: one(hospitals, {
    fields: [orders.hospitalId],
    references: [hospitals.id],
  }),
  supplier: one(suppliers, {
    fields: [orders.supplierId],
    references: [suppliers.id],
  }),
  items: many(orderItems),
  quotations: many(quotations),
}));

export const quotationsRelations = relations(quotations, ({ one, many }) => ({
  order: one(orders, {
    fields: [quotations.orderId],
    references: [orders.id],
  }),
  supplier: one(suppliers, {
    fields: [quotations.supplierId],
    references: [suppliers.id],
  }),
  items: many(quotationItems),
}));

// Insert Schemas
export const insertHospitalUserSchema = createInsertSchema(hospitalUsers).omit({
  id: true,
  createdAt: true,
});

export const insertSupplierUserSchema = createInsertSchema(supplierUsers).omit({
  id: true,
  createdAt: true,
});

export const insertHospitalSchema = createInsertSchema(hospitals).omit({
  id: true,
  createdAt: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
});

export const insertMedicineSchema = createInsertSchema(medicines).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  orderNumber: true,
});

export const insertQuotationSchema = createInsertSchema(quotations).omit({
  id: true,
  createdAt: true,
  quotationNumber: true,
});

export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders).omit({
  id: true,
  createdAt: true,
  poNumber: true,
});

// Types
export type HospitalUser = typeof hospitalUsers.$inferSelect;
export type InsertHospitalUser = z.infer<typeof insertHospitalUserSchema>;

export type SupplierUser = typeof supplierUsers.$inferSelect;
export type InsertSupplierUser = z.infer<typeof insertSupplierUserSchema>;

export type Hospital = typeof hospitals.$inferSelect;
export type InsertHospital = z.infer<typeof insertHospitalSchema>;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

export type Medicine = typeof medicines.$inferSelect;
export type InsertMedicine = z.infer<typeof insertMedicineSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Quotation = typeof quotations.$inferSelect;
export type InsertQuotation = z.infer<typeof insertQuotationSchema>;

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type InsertPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;
