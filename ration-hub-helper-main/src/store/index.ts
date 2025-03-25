
import { create } from 'zustand';
import { User, Product, ProductAssignment, UserRole } from '../types';

// Mock data for initial state
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Rice',
    mrp: 45,
    quantity: 100,
    unit: 'kg',
    image: '',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Wheat',
    mrp: 30,
    quantity: 150,
    unit: 'kg',
    image: '',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Sugar',
    mrp: 50,
    quantity: 75,
    unit: 'kg',
    image: '',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Oil',
    mrp: 120,
    quantity: 50,
    unit: 'liter',
    image: '',
    createdAt: new Date().toISOString()
  }
];

// Define mockUsers as a regular array, not a const
let mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
    city: 'Mumbai',
    contactNumber: '9876543210',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Shop User',
    email: 'shop@example.com',
    password: 'password',
    role: 'shopkeeper',
    city: 'Delhi',
    contactNumber: '9876543211',
    aadharNumber: '123456789012',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Customer User',
    email: 'customer@example.com',
    password: 'password',
    role: 'customer',
    smartCardNumber: 'SC12345',
    city: 'Bangalore',
    contactNumber: '9876543212',
    createdAt: new Date().toISOString()
  }
];

const mockAssignments: ProductAssignment[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Rice',
    userId: '3',
    userName: 'Customer User',
    assignedBy: '1',
    assignedByName: 'Admin User',
    quantity: 10,
    createdAt: new Date().toISOString()
  }
];

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  login: async (email, password, role) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log all users for debugging
    console.log('All users:', mockUsers);
    console.log('Trying to login with:', { email, password, role });
    
    const user = mockUsers.find(u => 
      u.email === email && 
      u.role === role && 
      u.password === password
    );
    
    console.log('Found user:', user);
    
    if (user) {
      set({ currentUser: user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  register: async (userData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: String(mockUsers.length + 1),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'customer',
      smartCardNumber: userData.smartCardNumber,
      city: userData.city,
      contactNumber: userData.contactNumber,
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    set({ currentUser: newUser, isAuthenticated: true });
    return true;
  },
  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  }
}));

interface ProductState {
  products: Product[];
  getProducts: () => Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: mockProducts,
  getProducts: () => get().products,
  addProduct: (product) => {
    const newProduct: Product = {
      ...product,
      id: String(get().products.length + 1),
      createdAt: new Date().toISOString()
    };
    set(state => ({ products: [...state.products, newProduct] }));
  },
  updateProduct: (id, updates) => {
    set(state => ({
      products: state.products.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    }));
  },
  deleteProduct: (id) => {
    set(state => ({
      products: state.products.filter(product => product.id !== id)
    }));
  }
}));

interface UserState {
  users: User[];
  getUsers: () => User[];
  getUsersByRole: (role: UserRole) => User[];
  getUserById: (id: string) => User | undefined;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>) => void;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: mockUsers,
  getUsers: () => get().users,
  getUsersByRole: (role) => get().users.filter(user => user.role === role),
  getUserById: (id) => get().users.find(user => user.id === id),
  addUser: (user) => {
    const newId = String(mockUsers.length + 1);
    const newUser: User = {
      ...user,
      id: newId,
      createdAt: new Date().toISOString()
    };
    
    // Add to the mockUsers array directly
    mockUsers.push(newUser);
    
    // Update the store state
    set(state => ({ 
      users: [...state.users, newUser] 
    }));
    
    console.log('User added successfully:', newUser);
    console.log('Updated mockUsers:', mockUsers);
  },
  updateUser: (id, updates) => {
    set(state => ({
      users: state.users.map(user => 
        user.id === id ? { ...user, ...updates } : user
      )
    }));
    
    // Also update in mockUsers
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...updates };
    }
  },
  deleteUser: (id) => {
    set(state => ({
      users: state.users.filter(user => user.id !== id)
    }));
    
    // Also remove from mockUsers
    mockUsers = mockUsers.filter(user => user.id !== id);
  }
}));

interface AssignmentState {
  assignments: ProductAssignment[];
  getAssignments: () => ProductAssignment[];
  getAssignmentsByUser: (userId: string) => ProductAssignment[];
  getAssignmentsByAssignedBy: (assignedBy: string) => ProductAssignment[];
  addAssignment: (assignment: Omit<ProductAssignment, 'id' | 'createdAt'>) => void;
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: mockAssignments,
  getAssignments: () => get().assignments,
  getAssignmentsByUser: (userId) => get().assignments.filter(a => a.userId === userId),
  getAssignmentsByAssignedBy: (assignedBy) => get().assignments.filter(a => a.assignedBy === assignedBy),
  addAssignment: (assignment) => {
    const newAssignment: ProductAssignment = {
      ...assignment,
      id: String(get().assignments.length + 1),
      createdAt: new Date().toISOString()
    };
    set(state => ({ assignments: [...state.assignments, newAssignment] }));
    
    // We need to extract product update logic to avoid hook usage
    const product = useProductStore.getState().products.find(p => p.id === assignment.productId);
    if (product) {
      useProductStore.getState().updateProduct(product.id, { 
        quantity: product.quantity - assignment.quantity 
      });
    }
  }
}));
