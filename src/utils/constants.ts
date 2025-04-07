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

	ORDER_OPEN_PAYMENT: 'order:openPayment',
	ORDER_OPEN_CONTACTS: 'order:openContacts',
	ORDER_SUBMIT: 'order:submit',
	ORDER_SUCCESS: 'order:success',
	ORDER_RESET: 'order:reset',
};

export const settings = {};
