export interface Product {
  sku: string;
  name: string;
  quantity: number;
  inStock: boolean;
}

export const products: Product[] = [
  {
    sku: "SKU-001",
    name: "Wireless Mouse",
    quantity: 42,
    inStock: true,
  },
  {
    sku: "SKU-002",
    name: "USB Keyboard",
    quantity: 0,
    inStock: false,
  },
  {
    sku: "SKU-003",
    name: "HDMI Cable",
    quantity: 15,
    inStock: true,
  },
];
