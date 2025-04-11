import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertCustomerSchema,
  insertContactSchema,
  insertBrandSchema,
  insertCategorySchema,
  insertEquipmentSchema,
  insertMaintenanceSchema,
  insertRentalSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

function handleValidationError(err: unknown) {
  if (err instanceof ZodError) {
    return { message: fromZodError(err).message };
  }
  return { message: String(err) };
}

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();

  // Customers
  apiRouter.get('/customers', async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get customers' });
    }
  });

  apiRouter.get('/customers/:id', async (req, res) => {
    try {
      const customer = await storage.getCustomer(Number(req.params.id));
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json(customer);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get customer' });
    }
  });

  apiRouter.post('/customers', async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (err) {
      res.status(400).json(handleValidationError(err));
    }
  });

  apiRouter.put('/customers/:id', async (req, res) => {
    try {
      const customerData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(Number(req.params.id), customerData);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json(customer);
    } catch (err) {
      res.status(400).json(handleValidationError(err));
    }
  });

  apiRouter.delete('/customers/:id', async (req, res) => {
    try {
      const result = await storage.deleteCustomer(Number(req.params.id));
      if (!result) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete customer' });
    }
  });

  // Contacts
  apiRouter.get('/contacts', async (req, res) => {
    try {
      const { customerId } = req.query;
      if (customerId) {
        const contacts = await storage.getContactsByCustomer(Number(customerId));
        return res.json(contacts);
      }
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get contacts' });
    }
  });

  apiRouter.get('/contacts/:id', async (req, res) => {
    try {
      const contact = await storage.getContact(Number(req.params.id));
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.json(contact);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get contact' });
    }
  });

  apiRouter.post('/contacts', async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (err) {
      res.status(400).json(handleValidationError(err));
    }
  });

  apiRouter.put('/contacts/:id', async (req, res) => {
    try {
      const contactData = insertContactSchema.partial().parse(req.body);
      const contact = await storage.updateContact(Number(req.params.id), contactData);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.json(contact);
    } catch (err) {
      res.status(400).json(handleValidationError(err));
    }
  });

  apiRouter.delete('/contacts/:id', async (req, res) => {
    try {
      const result = await storage.deleteContact(Number(req.params.id));
      if (!result) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete contact' });
    }
  });

  // Brands
  apiRouter.get('/brands', async (req, res) => {
    try {
      const brands = await storage.getAllBrands();
      res.json(brands);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get brands' });
    }
  });

  apiRouter.get('/brands/:id', async (req, res) => {
    try {
      const brand = await storage.getBrand(Number(req.params.id));
      if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
      }
      res.json(brand);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get brand' });
    }
  });

  apiRouter.post('/brands', async (req, res) => {
    try {
      const brandData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(brandData);
      res.status(201).json(brand);
    } catch (err) {
      res.status(400).json(handleValidationError(err));
    }
  });

  apiRouter.put('/brands/:id', async (req, res) => {
    try {
      const brandData = insertBrandSchema.partial().parse(req.body);
      const brand = await storage.updateBrand(Number(req.params.id), brandData);
      if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
      }
      res.json(brand);
    } catch (err) {
      res.status(400).json(handleValidationError(err));
    }
  });

  apiRouter.delete('/brands/:id', async (req, res) => {
    try {
      const result = await storage.deleteBrand(Number(req.params.id));
      if (!result) {
        return res.status(404).json({ message: 'Brand not found' });
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete brand' });
    }
  });

  // Categories
  apiRouter.get('/categories', async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get categories' });
    }
  });

  apiRouter.get('/categories/:id', async (req, res) => {
    try {
      const category = await storage.getCategory(Number(req.params.id));
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get category' });
    }
  });

  apiRouter.post('/categories', async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json(handleValidationError(err));
    }
  });

  apiRouter.put('/categories/:id', async (req, res) => {
    try {
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(Number(req.params.id), categoryData);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (err) {
      res.status(400).json(handleValidationError(err));
    }
  });

  apiRouter.delete('/categories/:id', async (req, res) => {
    try {
      const result = await storage.deleteCategory(Number(req.params.id));
      if (!result) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete category' });
    }
  });

  // Equipment
  apiRouter.get('/equipment', async (req, res) => {
    try {
      const { categoryId, brandId } = req.query;
      
      if (categoryId) {
        const equipment = await storage.getEquipmentByCategory(Number(categoryId));
        return res.json(equipment);
      }
      
      if (brandId) {
        const equipment = await storage.getEquipmentByBrand(Number(brandId));
        return res.json(equipment);
      }
      
      const equipment = await storage.getAllEquipment();
      res.json(equipment);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get equipment' });
    }
  });

  apiRouter.get('/equipment/:id', async (req, res) => {
    try {
      const equipment = await storage.getEquipment(Number(req.params.id));
      if (!equipment) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
      res.json(equipment);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get equipment' });
    }
  });

  apiRouter.post('/equipment', async (req, res) => {
    try {
      const equipmentData = insertEquipmentSchema.parse(req.body);
      const equipment = await storage.createEquipment(equipmentData);
      res.status(201).json(equipment);
    } catch (err) {
      res.status(400).json(handleValidationError(err));
    }
  });

  apiRouter.put('/equipment/:id', async (req, res) => {
    try {
      const equipmentData = insertEquipmentSchema.partial().parse(req.body);
      const equipment = await storage.updateEquipment(Number(req.params.id), equipmentData);
      if (!equipment) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
      res.json(equipment);
    } catch (err) {
      res.status(400).json(handleValidationError(err));
    }
  });

  apiRouter.delete('/equipment/:id', async (req, res) => {
    try {
      const result = await storage.deleteEquipment(Number(req.params.id));
      if (!result) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete equipment' });
    }
  });

  // Maintenance
  apiRouter.get('/maintenance', async (req, res) => {
    try {
      const { equipmentId, pending } = req.query;
      
      if (equipmentId) {
        const maintenance = await storage.getMaintenanceByEquipment(Number(equipmentId));
        return res.json(maintenance);
      }
      
      if (pending === 'true') {
        const maintenance = await storage.getPendingMaintenance();
        return res.json(maintenance);
      }
      
      const maintenance = await storage.getAllMaintenance();
      res.json(maintenance);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get maintenance records' });
    }
  });

  apiRouter.get('/maintenance/:id', async (req, res) => {
    try {
      const maintenance = await storage.getMaintenance(Number(req.params.id));
      if (!maintenance) {
        return res.status(404).json({ message: 'Maintenance record not found' });
      }
      res.json(maintenance);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get maintenance record' });
    }
  });

  apiRouter.post('/maintenance', async (req, res) => {
    try {
      const maintenanceData = insertMaintenanceSchema.parse(req.body);
      const maintenance = await storage.createMaintenance(maintenanceData);
      res.status(201).json(maintenance);
    } catch (err) {
      res.status(400).json(handleValidationError(err));
    }
  });

  apiRouter.put('/maintenance/:id', async (req, res) => {
    try {
      const maintenanceData = insertMaintenanceSchema.partial().parse(req.body);
      const maintenance = await storage.updateMaintenance(Number(req.params.id), maintenanceData);
      if (!maintenance) {
        return res.status(404).json({ message: 'Maintenance record not found' });
      }
      res.json(maintenance);
    } catch (err) {
      res.status(400).json(handleValidationError(err));
    }
  });

  apiRouter.delete('/maintenance/:id', async (req, res) => {
    try {
      const result = await storage.deleteMaintenance(Number(req.params.id));
      if (!result) {
        return res.status(404).json({ message: 'Maintenance record not found' });
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete maintenance record' });
    }
  });

  // Rentals
  apiRouter.get('/rentals', async (req, res) => {
    try {
      const { customerId, equipmentId, active } = req.query;
      
      if (customerId) {
        const rentals = await storage.getRentalsByCustomer(Number(customerId));
        return res.json(rentals);
      }
      
      if (equipmentId) {
        const rentals = await storage.getRentalsByEquipment(Number(equipmentId));
        return res.json(rentals);
      }
      
      if (active === 'true') {
        const rentals = await storage.getActiveRentals();
        return res.json(rentals);
      }
      
      const rentals = await storage.getAllRentals();
      res.json(rentals);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get rentals' });
    }
  });

  apiRouter.get('/rentals/:id', async (req, res) => {
    try {
      const rental = await storage.getRental(Number(req.params.id));
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
      res.json(rental);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get rental' });
    }
  });

  apiRouter.post('/rentals', async (req, res) => {
    try {
      const rentalData = insertRentalSchema.parse(req.body);
      const rental = await storage.createRental(rentalData);
      res.status(201).json(rental);
    } catch (err) {
      res.status(400).json(handleValidationError(err));
    }
  });

  apiRouter.put('/rentals/:id', async (req, res) => {
    try {
      const rentalData = insertRentalSchema.partial().parse(req.body);
      const rental = await storage.updateRental(Number(req.params.id), rentalData);
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
      res.json(rental);
    } catch (err) {
      res.status(400).json(handleValidationError(err));
    }
  });

  apiRouter.delete('/rentals/:id', async (req, res) => {
    try {
      const result = await storage.deleteRental(Number(req.params.id));
      if (!result) {
        return res.status(404).json({ message: 'Rental not found' });
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete rental' });
    }
  });

  // Dashboard stats
  apiRouter.get('/dashboard/stats', async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get dashboard stats' });
    }
  });

  // Equipment availability
  apiRouter.get('/dashboard/equipment-availability', async (req, res) => {
    try {
      const availability = await storage.getEquipmentAvailability();
      res.json(availability);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get equipment availability' });
    }
  });

  app.use('/api', apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
