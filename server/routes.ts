import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { insertHospitalUserSchema, insertSupplierUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
    
    ws.on('message', (message) => {
      console.log('Received:', message.toString());
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  // Hospital Authentication Routes
  app.post('/api/hospital/register', async (req, res) => {
    try {
      const userData = insertHospitalUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createHospitalUser({
        ...userData,
        password: hashedPassword,
      });
      
      res.json({ success: true, user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/hospital/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getHospitalUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const hospital = await storage.getHospital(user.hospitalId!);
      
      res.json({ 
        success: true, 
        user: { ...user, password: undefined },
        hospital 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Supplier Authentication Routes
  app.post('/api/supplier/register', async (req, res) => {
    try {
      const userData = insertSupplierUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createSupplierUser({
        ...userData,
        password: hashedPassword,
      });
      
      res.json({ success: true, user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/supplier/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getSupplierUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const supplier = await storage.getSupplier(user.supplierId!);
      
      res.json({ 
        success: true, 
        user: { ...user, password: undefined },
        supplier 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Hospital Dashboard Routes
  app.get('/api/hospital/:id/dashboard', async (req, res) => {
    try {
      const hospitalId = parseInt(req.params.id);
      const stats = await storage.getHospitalDashboardStats(hospitalId);
      const lowStockItems = await storage.getLowStockItems(hospitalId);
      const recentOrders = await storage.getHospitalOrders(hospitalId);
      const quotations = await storage.getHospitalQuotations(hospitalId);
      
      res.json({
        stats,
        lowStockItems: lowStockItems.slice(0, 5),
        recentOrders: recentOrders.slice(0, 5),
        quotations: quotations.slice(0, 5),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/hospital/:id/inventory', async (req, res) => {
    try {
      const hospitalId = parseInt(req.params.id);
      const inventory = await storage.getHospitalInventory(hospitalId);
      res.json(inventory);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add new inventory item
  app.post('/api/hospital/:id/inventory', async (req, res) => {
    try {
      const hospitalId = parseInt(req.params.id);
      
      if (!hospitalId || isNaN(hospitalId)) {
        return res.status(400).json({ error: 'Invalid hospital ID' });
      }
      
      const medicineId = parseInt(req.body.medicineId);
      if (!medicineId || isNaN(medicineId)) {
        return res.status(400).json({ error: 'Invalid medicine ID' });
      }
      
      // First check if medicine already exists in hospital inventory
      const existingInventory = await storage.getHospitalInventory(hospitalId);
      const existingItem = existingInventory.find((item: any) => 
        item.medicineId === medicineId
      );
      
      if (existingItem && existingItem.currentStock > 0) {
        return res.status(400).json({ error: 'Medicine already exists in inventory. Use edit to update.' });
      }
      
      // Create comprehensive inventory data
      const inventoryData = {
        hospitalId,
        medicineId,
        currentStock: Number(req.body.currentStock) || 0,
        reorderPoint: Number(req.body.reorderPoint) || 10,
        maxStock: Number(req.body.maxStock) || 100,
        unitCost: Number(req.body.unitCost) || 0,
        expiryDate: req.body.expiryDate || null,
        batchNumber: req.body.batchNumber || '',
        supplier: req.body.supplier || '',
        location: req.body.location || '',
      };
      
      // Add to hospital inventory with comprehensive data
      await storage.updateHospitalInventoryItem(
        hospitalId, 
        medicineId, 
        inventoryData
      );
      
      const updatedInventory = await storage.getHospitalInventory(hospitalId);
      const newItem = updatedInventory.find((item: any) => 
        item.medicineId === medicineId
      );
      
      res.json(newItem);
    } catch (error: any) {
      console.error('Error adding inventory:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update inventory item
  app.put('/api/hospital/:id/inventory/:itemId', async (req, res) => {
    try {
      const hospitalId = parseInt(req.params.id);
      const itemId = parseInt(req.params.itemId);
      
      if (!hospitalId || isNaN(hospitalId)) {
        return res.status(400).json({ error: 'Invalid hospital ID' });
      }
      
      const medicineId = parseInt(req.body.medicineId);
      if (!medicineId || isNaN(medicineId)) {
        return res.status(400).json({ error: 'Invalid medicine ID' });
      }
      
      // Update hospital inventory with comprehensive data
      const inventoryData = {
        currentStock: Number(req.body.currentStock) || 0,
        reorderPoint: Number(req.body.reorderPoint) || 10,
        maxStock: Number(req.body.maxStock) || 100,
        unitCost: Number(req.body.unitCost) || 0,
        expiryDate: req.body.expiryDate || null,
        batchNumber: req.body.batchNumber || "",
        supplier: req.body.supplier || "",
        location: req.body.location || "",
      };
      
      await storage.updateHospitalInventoryItem(
        hospitalId, 
        medicineId, 
        inventoryData
      );
      
      const updatedInventory = await storage.getHospitalInventory(hospitalId);
      const updatedItem = updatedInventory.find((item: any) => 
        item.medicineId === medicineId
      );
      
      res.json(updatedItem);
    } catch (error: any) {
      console.error('Error updating inventory:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete inventory item
  app.delete('/api/hospital/:id/inventory/:itemId', async (req, res) => {
    try {
      const hospitalId = parseInt(req.params.id);
      const itemId = parseInt(req.params.itemId);
      
      if (!hospitalId || isNaN(hospitalId)) {
        return res.status(400).json({ error: 'Invalid hospital ID' });
      }
      
      if (!itemId || isNaN(itemId)) {
        return res.status(400).json({ error: 'Invalid item ID' });
      }
      
      // Delete the inventory item
      await storage.deleteHospitalInventoryItem(hospitalId, itemId);
      
      res.json({ message: 'Inventory item deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting inventory:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/hospital/:id/orders', async (req, res) => {
    try {
      const hospitalId = parseInt(req.params.id);
      const orders = await storage.getHospitalOrders(hospitalId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/hospital/:id/orders', async (req, res) => {
    try {
      const hospitalId = parseInt(req.params.id);
      
      if (!hospitalId || isNaN(hospitalId)) {
        return res.status(400).json({ error: 'Invalid hospital ID' });
      }

      const { items, ...orderDetails } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
      }

      const orderData = {
        ...orderDetails,
        hospitalId,
        status: 'pending',
        priority: req.body.priority || 'standard',
        requiredDate: new Date(req.body.requiredDate),
      };
      
      const order = await storage.createOrder(orderData);
      
      // Create order items
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          medicineId: item.medicineId,
          quantity: item.quantity,
          status: 'pending'
        });
      }
      
      // Broadcast to suppliers via WebSocket
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'new_order',
            data: { ...order, items },
          }));
        }
      });
      
      res.json({ ...order, items });
    } catch (error: any) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/hospital/:id/quotations', async (req, res) => {
    try {
      const hospitalId = parseInt(req.params.id);
      const quotations = await storage.getHospitalQuotations(hospitalId);
      res.json(quotations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/hospital/quotations/:id/accept', async (req, res) => {
    try {
      const quotationId = parseInt(req.params.id);
      const quotation = await storage.getQuotation(quotationId);
      
      if (!quotation) {
        return res.status(404).json({ error: 'Quotation not found' });
      }
      
      await storage.updateQuotationStatus(quotationId, 'accepted');
      
      // Create Purchase Order
      const purchaseOrder = await storage.createPurchaseOrder({
        orderId: quotation.orderId,
        quotationId: quotationId,
        hospitalId: quotation.hospitalId,
        supplierId: quotation.supplierId,
        status: 'created',
        totalAmount: quotation.totalAmount!,
        deliveryAddress: req.body.deliveryAddress,
        expectedDeliveryDate: req.body.expectedDeliveryDate,
        createdBy: req.body.createdBy,
      });
      
      // Broadcast to supplier
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({
            type: 'purchase_order_created',
            data: purchaseOrder,
          }));
        }
      });
      
      res.json(purchaseOrder);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Supplier Dashboard Routes
  app.get('/api/supplier/:id/dashboard', async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      const stats = await storage.getSupplierDashboardStats(supplierId);
      const pendingQuotations = await storage.getPendingQuotations(supplierId);
      const purchaseOrders = await storage.getSupplierPurchaseOrders(supplierId);
      const inventory = await storage.getSupplierInventory(supplierId);
      
      res.json({
        stats,
        pendingQuotations: pendingQuotations.slice(0, 5),
        purchaseOrders: purchaseOrders.slice(0, 5),
        inventory: inventory.slice(0, 10),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/supplier/:id/inventory', async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      const inventory = await storage.getSupplierInventory(supplierId);
      res.json(inventory);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/supplier/:id/inventory/:medicineId', async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      const medicineId = parseInt(req.params.medicineId);
      const { quantity, price } = req.body;
      
      await storage.updateSupplierStock(supplierId, medicineId, quantity, price);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/supplier/:id/quotations', async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      const quotations = await storage.getPendingQuotations(supplierId);
      res.json(quotations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/supplier/quotations', async (req, res) => {
    try {
      const quotationData = {
        ...req.body,
        status: 'submitted',
        submittedAt: new Date(),
      };
      
      const quotation = await storage.createQuotation(quotationData);
      
      // Broadcast to hospital
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({
            type: 'quotation_received',
            data: quotation,
          }));
        }
      });
      
      res.json(quotation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/supplier/:id/orders', async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      const orders = await storage.getSupplierPurchaseOrders(supplierId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // General Routes
  app.get('/api/medicines', async (req, res) => {
    try {
      const medicines = await storage.getAllMedicines();
      res.json(medicines);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add new medicine to master list
  app.post('/api/medicines', async (req, res) => {
    try {
      console.log('Received medicine data:', req.body);
      
      // Validate required fields
      if (!req.body.medicineName || !req.body.brandName || !req.body.dosageForm || !req.body.strength || !req.body.composition) {
        return res.status(400).json({ error: 'All required fields must be provided' });
      }

      const medicineData = {
        name: req.body.medicineName,
        genericName: req.body.composition,
        brand: req.body.brandName,
        brandName: req.body.brandName,
        dosageForm: req.body.dosageForm,
        strength: req.body.strength,
        route: req.body.route,
        category: req.body.category,
        hsnCode: req.body.hsnCode,
        gstPercent: req.body.gstPercent?.toString() || '0',
        unitOfMeasure: req.body.dosageForm,
      };
      
      const medicine = await storage.createMedicine(medicineData);
      res.json(medicine);
    } catch (error: any) {
      console.error('Medicine creation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update medicine in master list
  app.put('/api/medicines/:id', async (req, res) => {
    try {
      const medicineId = parseInt(req.params.id);
      console.log('Updating medicine data:', req.body);
      
      // Validate required fields
      if (!req.body.medicineName || !req.body.brandName || !req.body.dosageForm || !req.body.strength || !req.body.composition) {
        return res.status(400).json({ error: 'All required fields must be provided' });
      }

      const medicineData = {
        name: req.body.medicineName,
        genericName: req.body.composition,
        brand: req.body.brandName,
        brandName: req.body.brandName,
        dosageForm: req.body.dosageForm,
        strength: req.body.strength,
        route: req.body.route,
        category: req.body.category,
        hsnCode: req.body.hsnCode,
        gstPercent: req.body.gstPercent?.toString() || '0',
        unitOfMeasure: req.body.dosageForm,
      };
      
      // Update the existing medicine entry
      const medicine = await storage.updateMedicine(medicineId, medicineData);
      res.json(medicine);
    } catch (error: any) {
      console.error('Medicine update error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete medicine from master list
  app.delete('/api/medicines/:id', async (req, res) => {
    try {
      const medicineId = parseInt(req.params.id);
      res.json({ message: 'Medicine deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/hospitals', async (req, res) => {
    try {
      const hospitals = await storage.getAllHospitals();
      res.json(hospitals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/suppliers', async (req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      res.json(suppliers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get available medicines from all suppliers (stock > 0)
  app.get('/api/suppliers/available-medicines', async (req, res) => {
    try {
      const availableMedicines = await storage.getAvailableMedicinesFromSuppliers();
      res.json(availableMedicines);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Hospital Settlements Routes
  app.get('/api/hospital/:id/settlements', async (req, res) => {
    try {
      const hospitalId = parseInt(req.params.id);
      const settlements = await storage.getHospitalSettlements(hospitalId);
      res.json(settlements);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/hospital/:id/settlements', async (req, res) => {
    try {
      const hospitalId = parseInt(req.params.id);
      
      if (!hospitalId || isNaN(hospitalId)) {
        return res.status(400).json({ error: 'Invalid hospital ID' });
      }

      const settlementData = {
        ...req.body,
        hospitalId,
        status: 'pending',
        createdAt: new Date(),
      };
      
      const settlement = await storage.createSettlement(settlementData);
      res.json(settlement);
    } catch (error: any) {
      console.error('Error creating settlement:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Supplier Order Management Routes
  app.get('/api/supplier/:id/pending-orders', async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      const pendingOrders = await storage.getSupplierPendingOrders(supplierId);
      res.json(pendingOrders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/supplier/:id/orders/:orderId/accept', async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      const orderId = parseInt(req.params.orderId);
      const { items, deliveryTerms, paymentTerms, notes, validUntil } = req.body;

      // Create quotation
      const quotationData = {
        orderId,
        supplierId,
        totalAmount: items.reduce((sum: number, item: any) => sum + item.totalPrice, 0),
        deliveryTerms,
        paymentTerms,
        notes,
        validUntil: new Date(validUntil),
        status: 'submitted',
      };

      const quotation = await storage.createQuotation(quotationData);

      // Create quotation items
      for (const item of items) {
        await storage.createQuotationItem({
          quotationId: quotation.id,
          medicineId: item.medicineId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        });
      }

      // Update order status
      await storage.updateOrderStatus(orderId, 'quoted');

      // Broadcast to hospital via WebSocket
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'quotation_received',
            data: { ...quotation, items },
          }));
        }
      });

      res.json(quotation);
    } catch (error: any) {
      console.error('Error accepting order:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/supplier/:id/orders/:orderId/reject', async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      await storage.updateOrderStatus(orderId, 'rejected');
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/supplier/:id/orders/:orderId/ignore', async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      await storage.updateOrderStatus(orderId, 'ignored');
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
