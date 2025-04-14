import {
  users, type User, type InsertUser,
  customers, type Customer, type InsertCustomer,
  contacts, type Contact, type InsertContact,
  brands, type Brand, type InsertBrand,
  categories, type Category, type InsertCategory,
  equipment, type Equipment, type InsertEquipment,
  equipmentUnits, type EquipmentUnit, type InsertEquipmentUnit,
  maintenance, type Maintenance, type InsertMaintenance,
  rentals, type Rental, type InsertRental
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Customers
  getAllCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;

  // Contacts
  getAllContacts(): Promise<Contact[]>;
  getContactsByCustomer(customerId: number): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;

  // Brands
  getAllBrands(): Promise<Brand[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: number): Promise<boolean>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Equipment
  getAllEquipment(): Promise<Equipment[]>;
  getEquipment(id: number): Promise<Equipment | undefined>;
  getEquipmentByCategory(categoryId: number): Promise<Equipment[]>;
  getEquipmentByBrand(brandId: number): Promise<Equipment[]>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: number, equipment: Partial<InsertEquipment>): Promise<Equipment | undefined>;
  deleteEquipment(id: number): Promise<boolean>;

  // Equipment Units
  getAllEquipmentUnits(): Promise<EquipmentUnit[]>;
  getEquipmentUnitsByEquipment(equipmentId: number): Promise<EquipmentUnit[]>;
  getEquipmentUnit(id: number): Promise<EquipmentUnit | undefined>;
  createEquipmentUnit(unit: InsertEquipmentUnit): Promise<EquipmentUnit>;
  updateEquipmentUnit(id: number, unit: Partial<InsertEquipmentUnit>): Promise<EquipmentUnit | undefined>;
  deleteEquipmentUnit(id: number): Promise<boolean>;
  getAvailableEquipmentUnits(equipmentId: number): Promise<EquipmentUnit[]>;

  // Maintenance
  getAllMaintenance(): Promise<Maintenance[]>;
  getMaintenanceByEquipment(equipmentId: number): Promise<Maintenance[]>;
  getMaintenanceByEquipmentUnit(unitId: number): Promise<Maintenance[]>;
  getPendingMaintenance(): Promise<Maintenance[]>;
  getMaintenance(id: number): Promise<Maintenance | undefined>;
  createMaintenance(maintenance: InsertMaintenance): Promise<Maintenance>;
  updateMaintenance(id: number, maintenance: Partial<InsertMaintenance>): Promise<Maintenance | undefined>;
  deleteMaintenance(id: number): Promise<boolean>;

  // Rentals
  getAllRentals(): Promise<Rental[]>;
  getActiveRentals(): Promise<Rental[]>;
  getRentalsByCustomer(customerId: number): Promise<Rental[]>;
  getRentalsByEquipment(equipmentId: number): Promise<Rental[]>;
  getRentalsByEquipmentUnit(unitId: number): Promise<Rental[]>;
  getRental(id: number): Promise<Rental | undefined>;
  createRental(rental: InsertRental): Promise<Rental>;
  updateRental(id: number, rental: Partial<InsertRental>): Promise<Rental | undefined>;
  deleteRental(id: number): Promise<boolean>;

  // Statistics and Summaries
  getDashboardStats(): Promise<{
    activeRentals: number;
    availableEquipment: number;
    pendingMaintenance: number;
    activeCustomers: number;
  }>;
  
  getEquipmentAvailability(): Promise<{
    categoryName: string;
    available: number;
    total: number;
  }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private customers: Map<number, Customer>;
  private contacts: Map<number, Contact>;
  private brands: Map<number, Brand>;
  private categories: Map<number, Category>;
  private equipment: Map<number, Equipment>;
  private equipmentUnits: Map<number, EquipmentUnit>;
  private maintenance: Map<number, Maintenance>;
  private rentals: Map<number, Rental>;
  
  private userCurrentId: number;
  private customerCurrentId: number;
  private contactCurrentId: number;
  private brandCurrentId: number;
  private categoryCurrentId: number;
  private equipmentCurrentId: number;
  private equipmentUnitCurrentId: number;
  private maintenanceCurrentId: number;
  private rentalCurrentId: number;

  constructor() {
    this.users = new Map();
    this.customers = new Map();
    this.contacts = new Map();
    this.brands = new Map();
    this.categories = new Map();
    this.equipment = new Map();
    this.equipmentUnits = new Map();
    this.maintenance = new Map();
    this.rentals = new Map();
    
    this.userCurrentId = 1;
    this.customerCurrentId = 1;
    this.contactCurrentId = 1;
    this.brandCurrentId = 1;
    this.categoryCurrentId = 1;
    this.equipmentCurrentId = 1;
    this.equipmentUnitCurrentId = 1;
    this.maintenanceCurrentId = 1;
    this.rentalCurrentId = 1;
    
    // Seed some initial data for testing
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categoryIds = [
      this.createCategory({ name: "Excavators", description: "Earth moving equipment for digging" }).id,
      this.createCategory({ name: "Bulldozers", description: "Heavy equipment for earth moving and grading" }).id,
      this.createCategory({ name: "Loaders", description: "Equipment used for loading materials" }).id,
      this.createCategory({ name: "Generators", description: "Portable power generation equipment" }).id,
      this.createCategory({ name: "Concrete Equipment", description: "Equipment for concrete work" }).id
    ];
    
    // Seed brands
    const brandIds = [
      this.createBrand({ name: "Caterpillar", description: "American heavy equipment manufacturer" }).id,
      this.createBrand({ name: "John Deere", description: "American manufacturer of agricultural and construction equipment" }).id,
      this.createBrand({ name: "Komatsu", description: "Japanese multinational corporation that manufactures construction equipment" }).id,
      this.createBrand({ name: "Bobcat", description: "American manufacturer of farm and construction equipment" }).id,
      this.createBrand({ name: "Volvo", description: "Swedish multinational manufacturing company" }).id
    ];
    
    // Seed customers
    const customerIds = [
      this.createCustomer({
        name: "BuildWell Construction",
        email: "info@buildwell.com",
        phone: "555-123-4567",
        address: "123 Builder Ave",
        city: "Construction City",
        state: "CA",
        postalCode: "90210",
        country: "USA",
        notes: "Regular customer since 2020"
      }).id,
      this.createCustomer({
        name: "Skyline Developers",
        email: "contact@skylinedev.com",
        phone: "555-987-6543",
        address: "456 Skyline Blvd",
        city: "Highland",
        state: "NY",
        postalCode: "10001",
        country: "USA"
      }).id,
      this.createCustomer({
        name: "Metro Engineering",
        email: "engineering@metro.com",
        phone: "555-246-8101",
        address: "789 Metro St",
        city: "Urbanville",
        state: "IL",
        postalCode: "60601",
        country: "USA",
        notes: "Prefers monthly billing"
      }).id,
      this.createCustomer({
        name: "Foundation Experts",
        email: "info@foundationexperts.com",
        phone: "555-369-8520",
        address: "101 Foundation Rd",
        city: "Bedrock",
        state: "TX",
        postalCode: "75001",
        country: "USA"
      }).id,
      this.createCustomer({
        name: "Coastal Builders",
        email: "info@coastalbuilders.com",
        phone: "555-741-9630",
        address: "202 Coastal Hwy",
        city: "Oceanside",
        state: "FL",
        postalCode: "33101",
        country: "USA",
        notes: "Seasonal projects only"
      }).id
    ];
    
    // Create contacts for customers
    this.createContact({
      customerId: customerIds[0],
      firstName: "John",
      lastName: "Builder",
      email: "john@buildwell.com",
      phone: "555-111-2222",
      position: "Project Manager",
      isPrimary: true
    });
    
    this.createContact({
      customerId: customerIds[1],
      firstName: "Sarah",
      lastName: "Skyline",
      email: "sarah@skylinedev.com",
      phone: "555-333-4444",
      position: "CEO",
      isPrimary: true
    });
    
    // Seed equipment models
    const equipmentIds = [];
    for (let i = 0; i < 12; i++) {
      const categoryIndex = i % categoryIds.length;
      const brandIndex = i % brandIds.length;
      
      const equipment = this.createEquipment({
        name: `${this.getCategoryNameById(categoryIds[categoryIndex])} ${i + 1}`,
        model: `Model ${String.fromCharCode(65 + i % 26)}`,
        brandId: brandIds[brandIndex],
        categoryId: categoryIds[categoryIndex],
        dailyRate: 100 + (i * 25),
        totalUnits: 0,
        availableUnits: 0,
        notes: "Available for rental"
      });
      
      equipmentIds.push(equipment.id);
    }
    
    // Seed equipment units
    const equipmentUnitIds = [];
    for (let i = 0; i < 24; i++) {
      const equipmentIndex = i % equipmentIds.length;
      const equipmentId = equipmentIds[equipmentIndex];
      const status = i < 18 ? "available" : "rented";
      
      const unit = this.createEquipmentUnit({
        equipmentId,
        serialNumber: `SN${equipmentId}-${i + 100}`,
        purchaseDate: new Date(2022, i % 12, (i % 28) + 1),
        purchasePrice: 10000 + (i * 2000),
        status,
        condition: "good",
        notes: status === "available" ? "Ready for rental" : "Currently rented out"
      });
      
      equipmentUnitIds.push(unit.id);
    }
    
    // Seed maintenance records
    for (let i = 0; i < 5; i++) {
      const equipmentId = equipmentIds[i % equipmentIds.length];
      const unitId = equipmentUnitIds[i];
      const maintenanceTypes = ["Scheduled", "Emergency", "Preventive"];
      const maintenanceType = maintenanceTypes[i % maintenanceTypes.length];
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3 + i);
      
      this.createMaintenance({
        equipmentId,
        equipmentUnitId: unitId,
        type: maintenanceType,
        description: `${maintenanceType} maintenance for ${this.getEquipmentById(equipmentId)?.name}`,
        scheduledDate: futureDate,
        status: "scheduled",
        notes: "Regular maintenance check"
      });
    }
    
    // Seed active rentals
    for (let i = 0; i < 4; i++) {
      const unitIndex = 18 + i; // Use units with status "rented"
      const equipmentUnitId = equipmentUnitIds[unitIndex];
      const unit = this.equipmentUnits.get(equipmentUnitId);
      if (!unit) continue;
      
      const equipmentId = unit.equipmentId;
      const customerId = customerIds[i % customerIds.length];
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (10 + i));
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30);
      
      this.createRental({
        customerId,
        equipmentId,
        equipmentUnitId,
        startDate,
        endDate,
        dailyRate: 100 + (i * 50),
        status: "active",
        notes: "Regular rental agreement"
      });
    }
    
    // Seed a completed rental
    const pastStartDate = new Date();
    pastStartDate.setDate(pastStartDate.getDate() - 30);
    
    const pastEndDate = new Date(pastStartDate);
    pastEndDate.setDate(pastEndDate.getDate() + 15);
    
    const pastReturnDate = new Date(pastEndDate);
    
    this.createRental({
      customerId: customerIds[4],
      equipmentId: equipmentIds[4],
      equipmentUnitId: equipmentUnitIds[10],
      startDate: pastStartDate,
      endDate: pastEndDate,
      returnDate: pastReturnDate,
      dailyRate: 150,
      status: "completed",
      notes: "Returned on time"
    });
  }

  // Helper methods
  private getCategoryNameById(id: number): string {
    const category = this.categories.get(id);
    return category ? category.name : "Unknown Category";
  }
  
  private getEquipmentById(id: number): Equipment | undefined {
    return this.equipment.get(id);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Customer methods
  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.customerCurrentId++;
    const createdAt = new Date();
    const customer: Customer = { ...insertCustomer, id, createdAt };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: number, updateData: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    
    const updatedCustomer: Customer = {
      ...customer,
      ...updateData,
    };
    
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }

  // Contact methods
  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getContactsByCustomer(customerId: number): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(
      contact => contact.customerId === customerId
    );
  }

  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactCurrentId++;
    const createdAt = new Date();
    const contact: Contact = { ...insertContact, id, createdAt };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContact(id: number, updateData: Partial<InsertContact>): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;
    
    const updatedContact: Contact = {
      ...contact,
      ...updateData,
    };
    
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async deleteContact(id: number): Promise<boolean> {
    return this.contacts.delete(id);
  }

  // Brand methods
  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = this.brandCurrentId++;
    const brand: Brand = { ...insertBrand, id };
    this.brands.set(id, brand);
    return brand;
  }

  async updateBrand(id: number, updateData: Partial<InsertBrand>): Promise<Brand | undefined> {
    const brand = this.brands.get(id);
    if (!brand) return undefined;
    
    const updatedBrand: Brand = {
      ...brand,
      ...updateData,
    };
    
    this.brands.set(id, updatedBrand);
    return updatedBrand;
  }

  async deleteBrand(id: number): Promise<boolean> {
    return this.brands.delete(id);
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory: Category = {
      ...category,
      ...updateData,
    };
    
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Equipment methods
  async getAllEquipment(): Promise<Equipment[]> {
    return Array.from(this.equipment.values());
  }

  async getEquipment(id: number): Promise<Equipment | undefined> {
    return this.equipment.get(id);
  }

  async getEquipmentByCategory(categoryId: number): Promise<Equipment[]> {
    return Array.from(this.equipment.values()).filter(
      equipment => equipment.categoryId === categoryId
    );
  }

  async getEquipmentByBrand(brandId: number): Promise<Equipment[]> {
    return Array.from(this.equipment.values()).filter(
      equipment => equipment.brandId === brandId
    );
  }

  async createEquipment(insertEquipment: InsertEquipment): Promise<Equipment> {
    const id = this.equipmentCurrentId++;
    const createdAt = new Date();
    const equipment: Equipment = { ...insertEquipment, id, createdAt };
    this.equipment.set(id, equipment);
    return equipment;
  }

  async updateEquipment(id: number, updateData: Partial<InsertEquipment>): Promise<Equipment | undefined> {
    const equipment = this.equipment.get(id);
    if (!equipment) return undefined;
    
    const updatedEquipment: Equipment = {
      ...equipment,
      ...updateData,
    };
    
    this.equipment.set(id, updatedEquipment);
    return updatedEquipment;
  }

  async deleteEquipment(id: number): Promise<boolean> {
    return this.equipment.delete(id);
  }

  // Equipment Unit methods
  async getAllEquipmentUnits(): Promise<EquipmentUnit[]> {
    return Array.from(this.equipmentUnits.values());
  }

  async getEquipmentUnitsByEquipment(equipmentId: number): Promise<EquipmentUnit[]> {
    return Array.from(this.equipmentUnits.values()).filter(
      unit => unit.equipmentId === equipmentId
    );
  }

  async getEquipmentUnit(id: number): Promise<EquipmentUnit | undefined> {
    return this.equipmentUnits.get(id);
  }

  async createEquipmentUnit(insertUnit: InsertEquipmentUnit): Promise<EquipmentUnit> {
    const id = this.equipmentUnitCurrentId++;
    const createdAt = new Date();
    const unit: EquipmentUnit = { ...insertUnit, id, createdAt };
    this.equipmentUnits.set(id, unit);
    
    // Update equipment available units count
    const equipment = this.equipment.get(insertUnit.equipmentId);
    if (equipment) {
      const totalUnits = (equipment.totalUnits || 0) + 1;
      const availableUnits = insertUnit.status === 'available' 
        ? (equipment.availableUnits || 0) + 1 
        : (equipment.availableUnits || 0);
      
      this.equipment.set(equipment.id, { 
        ...equipment, 
        totalUnits,
        availableUnits
      });
    }
    
    return unit;
  }

  async updateEquipmentUnit(id: number, updateData: Partial<InsertEquipmentUnit>): Promise<EquipmentUnit | undefined> {
    const unit = this.equipmentUnits.get(id);
    if (!unit) return undefined;
    
    const oldStatus = unit.status;
    const newStatus = updateData.status || oldStatus;
    
    const updatedUnit: EquipmentUnit = {
      ...unit,
      ...updateData,
    };
    
    this.equipmentUnits.set(id, updatedUnit);
    
    // Update equipment available units count if status changed
    if (oldStatus !== newStatus) {
      const equipment = this.equipment.get(unit.equipmentId);
      if (equipment) {
        let availableUnits = equipment.availableUnits || 0;
        
        if (oldStatus === 'available' && newStatus !== 'available') {
          availableUnits -= 1;
        } else if (oldStatus !== 'available' && newStatus === 'available') {
          availableUnits += 1;
        }
        
        this.equipment.set(equipment.id, { 
          ...equipment, 
          availableUnits 
        });
      }
    }
    
    return updatedUnit;
  }

  async deleteEquipmentUnit(id: number): Promise<boolean> {
    const unit = this.equipmentUnits.get(id);
    if (!unit) return false;
    
    // Update equipment counts
    const equipment = this.equipment.get(unit.equipmentId);
    if (equipment) {
      const totalUnits = (equipment.totalUnits || 0) - 1;
      const availableUnits = unit.status === 'available' 
        ? (equipment.availableUnits || 0) - 1 
        : (equipment.availableUnits || 0);
      
      this.equipment.set(equipment.id, { 
        ...equipment, 
        totalUnits: Math.max(0, totalUnits),
        availableUnits: Math.max(0, availableUnits)
      });
    }
    
    return this.equipmentUnits.delete(id);
  }

  async getAvailableEquipmentUnits(equipmentId: number): Promise<EquipmentUnit[]> {
    return Array.from(this.equipmentUnits.values()).filter(
      unit => unit.equipmentId === equipmentId && unit.status === 'available'
    );
  }

  // Maintenance methods
  async getAllMaintenance(): Promise<Maintenance[]> {
    return Array.from(this.maintenance.values());
  }

  async getMaintenanceByEquipment(equipmentId: number): Promise<Maintenance[]> {
    return Array.from(this.maintenance.values()).filter(
      maintenance => maintenance.equipmentId === equipmentId
    );
  }

  async getMaintenanceByEquipmentUnit(unitId: number): Promise<Maintenance[]> {
    return Array.from(this.maintenance.values()).filter(
      maintenance => maintenance.equipmentUnitId === unitId
    );
  }

  async getPendingMaintenance(): Promise<Maintenance[]> {
    return Array.from(this.maintenance.values()).filter(
      maintenance => maintenance.status !== "completed"
    );
  }

  async getMaintenance(id: number): Promise<Maintenance | undefined> {
    return this.maintenance.get(id);
  }

  async createMaintenance(insertMaintenance: InsertMaintenance): Promise<Maintenance> {
    const id = this.maintenanceCurrentId++;
    const createdAt = new Date();
    const maintenance: Maintenance = { ...insertMaintenance, id, createdAt };
    this.maintenance.set(id, maintenance);
    return maintenance;
  }

  async updateMaintenance(id: number, updateData: Partial<InsertMaintenance>): Promise<Maintenance | undefined> {
    const maintenance = this.maintenance.get(id);
    if (!maintenance) return undefined;
    
    const updatedMaintenance: Maintenance = {
      ...maintenance,
      ...updateData,
    };
    
    this.maintenance.set(id, updatedMaintenance);
    return updatedMaintenance;
  }

  async deleteMaintenance(id: number): Promise<boolean> {
    return this.maintenance.delete(id);
  }

  // Rental methods
  async getAllRentals(): Promise<Rental[]> {
    return Array.from(this.rentals.values());
  }

  async getActiveRentals(): Promise<Rental[]> {
    return Array.from(this.rentals.values()).filter(
      rental => rental.status === "active"
    );
  }

  async getRentalsByCustomer(customerId: number): Promise<Rental[]> {
    return Array.from(this.rentals.values()).filter(
      rental => rental.customerId === customerId
    );
  }

  async getRentalsByEquipment(equipmentId: number): Promise<Rental[]> {
    return Array.from(this.rentals.values()).filter(
      rental => rental.equipmentId === equipmentId
    );
  }

  async getRentalsByEquipmentUnit(unitId: number): Promise<Rental[]> {
    return Array.from(this.rentals.values()).filter(
      rental => rental.equipmentUnitId === unitId
    );
  }

  async getRental(id: number): Promise<Rental | undefined> {
    return this.rentals.get(id);
  }

  async createRental(insertRental: InsertRental): Promise<Rental> {
    const id = this.rentalCurrentId++;
    const createdAt = new Date();
    const rental: Rental = { ...insertRental, id, createdAt, returnDate: null };
    this.rentals.set(id, rental);
    
    // Update equipment status to rented
    const equipment = this.equipment.get(insertRental.equipmentId);
    if (equipment) {
      this.equipment.set(equipment.id, { ...equipment, status: "rented" });
    }
    
    return rental;
  }

  async updateRental(id: number, updateData: Partial<InsertRental>): Promise<Rental | undefined> {
    const rental = this.rentals.get(id);
    if (!rental) return undefined;
    
    const updatedRental: Rental = {
      ...rental,
      ...updateData,
    };
    
    // If status changed to "completed", update equipment status to available
    if (updateData.status === "completed" && rental.status !== "completed") {
      const equipment = this.equipment.get(rental.equipmentId);
      if (equipment) {
        this.equipment.set(equipment.id, { ...equipment, status: "available" });
      }
    }
    
    this.rentals.set(id, updatedRental);
    return updatedRental;
  }

  async deleteRental(id: number): Promise<boolean> {
    return this.rentals.delete(id);
  }

  // Statistics and Summaries
  async getDashboardStats(): Promise<{
    activeRentals: number;
    availableEquipment: number;
    pendingMaintenance: number;
    activeCustomers: number;
  }> {
    const activeRentals = Array.from(this.rentals.values()).filter(
      rental => rental.status === "active"
    ).length;
    
    const availableEquipment = Array.from(this.equipment.values()).filter(
      equipment => equipment.status === "available"
    ).length;
    
    const pendingMaintenance = Array.from(this.maintenance.values()).filter(
      maintenance => maintenance.status !== "completed"
    ).length;
    
    const activeCustomers = new Set(
      Array.from(this.rentals.values())
        .filter(rental => rental.status === "active")
        .map(rental => rental.customerId)
    ).size;
    
    return {
      activeRentals,
      availableEquipment,
      pendingMaintenance,
      activeCustomers
    };
  }
  
  async getEquipmentAvailability(): Promise<{
    categoryName: string;
    available: number;
    total: number;
  }[]> {
    const categoryMap = new Map<number, {
      categoryName: string;
      available: number;
      total: number;
    }>();
    
    // Initialize the map with all categories
    const allCategories = await this.getAllCategories();
    allCategories.forEach(category => {
      categoryMap.set(category.id, {
        categoryName: category.name,
        available: 0,
        total: 0
      });
    });
    
    // Count equipment by category
    const allEquipment = await this.getAllEquipment();
    allEquipment.forEach(equipment => {
      if (equipment.categoryId) {
        const categoryStats = categoryMap.get(equipment.categoryId);
        if (categoryStats) {
          categoryStats.total += 1;
          if (equipment.status === "available") {
            categoryStats.available += 1;
          }
        }
      }
    });
    
    return Array.from(categoryMap.values());
  }
}

export const storage = new MemStorage();
