export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const API_ENDPOINTS = {
	PRODUCTS: `/api/weblarek/product/`,
	ORDER: `/api/weblarek/order/`,
};

export const EVENTS = {
	CART_ADD: 'cart:add',
	CART_REMOVE: 'cart:remove',
	CART_CHANGED: 'cart:changed',
	CART_OPEN: 'cart:open',
	CART_OPEN_CLICK: 'cart:openClick',

	PRODUCT_SELECT: 'product:select',
	HAS_CART_CHANGED: 'nasItem:changed',

	ORDER_OPEN_PAYMENT: 'order:openPayment',
	ORDER_PAYMENT_SUBMITTED: 'order:submitedPayment',
	ORDER_OPEN_CONTACTS: 'order:openContacts',
	ORDER_CONTACTS_SUBMITTED: 'order:submitedContacts',
	ORDER_VALIDATION_ERROR: 'order:error',
	ORDER_SUCCESS: 'order:success',
	ORDER_RESET: 'order:reset',
};

export const settings = {};
