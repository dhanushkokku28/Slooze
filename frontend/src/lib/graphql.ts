import { gql } from '@apollo/client/core';

export const BOOTSTRAP_QUERY = gql`
  query BootstrapData {
    demoUsers {
      id
      name
      email
      role
      country
    }
  }
`;

export const APP_DATA_QUERY = gql`
  query AppData {
    me {
      id
      name
      email
      role
      country
    }
    restaurants {
      id
      name
      country
      menuItems {
        id
        name
        priceCents
        restaurantId
      }
    }
    orders {
      id
      status
      totalCents
      userId
      country
      createdAt
      items {
        id
        menuItemId
        quantity
        unitPriceCents
      }
    }
    paymentMethods {
      id
      label
      type
      last4
      userId
    }
  }
`;

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
    }
  }
`;

export const CHECKOUT_ORDER_MUTATION = gql`
  mutation CheckoutOrder($orderId: String!) {
    checkoutOrder(orderId: $orderId) {
      id
    }
  }
`;

export const CANCEL_ORDER_MUTATION = gql`
  mutation CancelOrder($orderId: String!) {
    cancelOrder(orderId: $orderId) {
      id
    }
  }
`;

export const ADD_PAYMENT_MUTATION = gql`
  mutation AddPaymentMethod($input: AddPaymentMethodInput!) {
    addPaymentMethod(input: $input) {
      id
    }
  }
`;

export const UPDATE_PAYMENT_MUTATION = gql`
  mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) {
    updatePaymentMethod(input: $input) {
      id
    }
  }
`;
