const authRoot = 'auth';
const saRoot = 'sa';
const productCatalogRoot = 'product-catalog';
const userRoot = 'user';

const baseRoutes = (root: string) => {
  return {
    root,
    getOne: `/${root}/:id`,
    getOneBySlug: `/${root}/slug/:slug`,
    update: `/${root}/:id`,
    delete: `/${root}/:id`,
  };
};

// Api Versions
const v1 = 'v1';

export const routesV1 = {
  version: v1,

  auth: {
    root: authRoot,
    register: `/${authRoot}/register`,
    login: `/${authRoot}/login`,
    logout: `/${authRoot}/logout`,
    refreshToken: `/${authRoot}/refresh-token`,
    verifyEmail: `/${authRoot}/verify-email`,
  },

  paymentMethod: {
    ...baseRoutes(`/payment-method`),
  },
  productCatalog: {
    category: {
      ...baseRoutes(`${productCatalogRoot}/category`),
    },
    material: {
      ...baseRoutes(`${productCatalogRoot}/material`),
    },
    product: {
      ...baseRoutes(`${productCatalogRoot}/product`),
      productWithImages: `${productCatalogRoot}/product-with-images`,
      productByName: `${productCatalogRoot}/product-by-name`,
    },
    productImage: {
      ...baseRoutes(`${productCatalogRoot}/product-image`),
    },
    productCustom: {
      ...baseRoutes(`${productCatalogRoot}/product-custom`),
      updateProductCustomStatus: `${productCatalogRoot}/update-product-custom-status/:id`,
      productCustomByCurrentUser: `${productCatalogRoot}/product-custom-by-current-user`,
    },
  },
  user: {
    root: 'user',
    address: {
      ...baseRoutes(`${userRoot}/address`),
    },
    shipping: {
      ...baseRoutes(`${userRoot}/shipping`),
    },
    order: {
      getByUser: `/${userRoot}/order/by-user`,
      orderItem: {
        ...baseRoutes(`${userRoot}/order/order-item`),
      },
      ...baseRoutes(`${userRoot}/order`),
    },
    cart: {
      ...baseRoutes(`${userRoot}/cart`),
      getByUserId: `/${userRoot}/cart/by-user/:userId`,
    },
    payment: {
      getByOrder: `/${userRoot}/payment/by-order/:orderId`,
      cancel: `/${userRoot}/payment/cancel/:id`,
      createWithOrder: `/${userRoot}/payment/:orderId`,
      getOne: `/${userRoot}/payment/:id`,
    },
    userProfile: {
      ...baseRoutes(`${userRoot}/user-profile`),
    },
    transaction: {
      ...baseRoutes(`${userRoot}/transaction`),
      getByUser: `/${userRoot}/transaction-by-user`,
    }
  },

  sa: {
    user: {
      resetPassword: `/${saRoot}/reset-password`,
      ...baseRoutes(`${saRoot}/user`),
    },
    role: {
      ...baseRoutes(`${saRoot}/role`),
    },
  },
};
