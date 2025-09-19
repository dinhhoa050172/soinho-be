export const API_V1_TAGS = {
  AUTHENTICATION: 'Authentication',
  SYSTEM_ADMIN: 'System Admin',
  PRODUCT_CATALOG: {
    root: 'Product Catalog',
    MATERIAL: 'Material',
    PRODUCT: 'Product',
    PRODUCT_IMAGE: 'Product Image',
    CATEGORY: 'Category',
    PRODUCT_CUSTOM: 'Product Custom',
  },
  ORDER_ITEM: 'Order Item',
  PAYMENT_METHOD: 'Payment Method',
  USER: {
    root: 'User',
    ADDRESS: 'Address',
    SHIPPING: 'Shipping',
    ORDER: {
      root: 'Order',
      ORDER_ITEM: 'Order Item',
    },
    PAYMENT: 'Payment',
    CART: 'Cart',
    USER_PROFILE: 'User profile',
    TRANSACTION: 'Transaction',
  },
} as const;
