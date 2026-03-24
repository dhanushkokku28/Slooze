"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  ADD_PAYMENT_MUTATION,
  APP_DATA_QUERY,
  CANCEL_ORDER_MUTATION,
  CHECKOUT_ORDER_MUTATION,
  CREATE_ORDER_MUTATION,
  UPDATE_PAYMENT_MUTATION,
} from "@/lib/graphql";
import {
  Order,
  PaymentMethod,
  PaymentType,
  Restaurant,
  User,
} from "@/lib/types";
import { statusColor, toCurrency } from "@/lib/utils";

type DashboardProps = {
  activeUserId: string;
  onSwitchUser: (nextId: string) => void;
  userOptions: User[];
};

export function Dashboard({
  activeUserId,
  onSwitchUser,
  userOptions,
}: DashboardProps) {
  const { data, loading, error, refetch } = useQuery<{
    me: User;
    restaurants: Restaurant[];
    orders: Order[];
    paymentMethods: PaymentMethod[];
  }>(APP_DATA_QUERY);

  const [createOrder] = useMutation(CREATE_ORDER_MUTATION);
  const [checkoutOrder] = useMutation(CHECKOUT_ORDER_MUTATION);
  const [cancelOrder] = useMutation(CANCEL_ORDER_MUTATION);
  const [addPaymentMethod] = useMutation(ADD_PAYMENT_MUTATION);
  const [updatePaymentMethod] = useMutation(UPDATE_PAYMENT_MUTATION);

  const [message, setMessage] = useState<string>("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [targetUserId, setTargetUserId] = useState<string>("");
  const [paymentLabel, setPaymentLabel] = useState<string>("Corporate Card");
  const [paymentType, setPaymentType] = useState<PaymentType>("CARD");
  const [paymentLast4, setPaymentLast4] = useState<string>("0000");

  const me = data?.me as User | undefined;
  const restaurants = (data?.restaurants ?? []) as Restaurant[];
  const orders = (data?.orders ?? []) as Order[];
  const paymentMethods = (data?.paymentMethods ?? []) as PaymentMethod[];

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === selectedRestaurantId),
    [restaurants, selectedRestaurantId],
  );

  const selectedMenuItem = selectedRestaurant?.menuItems.find(
    (menuItem) => menuItem.id === selectedMenuItemId,
  );

  const canCheckoutOrCancel = me?.role === "ADMIN" || me?.role === "MANAGER";
  const canManagePayments = me?.role === "ADMIN";

  async function handleCreateOrder(): Promise<void> {
    if (!selectedRestaurantId || !selectedMenuItemId) {
      setMessage("Pick a restaurant and menu item first.");
      return;
    }

    try {
      await createOrder({
        variables: {
          input: {
            restaurantId: selectedRestaurantId,
            items: [{ menuItemId: selectedMenuItemId, quantity }],
          },
        },
      });
      await refetch();
      setMessage("Order created.");
    } catch (mutationError) {
      setMessage((mutationError as Error).message);
    }
  }

  async function handleCheckout(orderId: string): Promise<void> {
    try {
      await checkoutOrder({ variables: { orderId } });
      await refetch();
      setMessage("Order checked out.");
    } catch (mutationError) {
      setMessage((mutationError as Error).message);
    }
  }

  async function handleCancel(orderId: string): Promise<void> {
    try {
      await cancelOrder({ variables: { orderId } });
      await refetch();
      setMessage("Order canceled.");
    } catch (mutationError) {
      setMessage((mutationError as Error).message);
    }
  }

  async function handleAddPaymentMethod(): Promise<void> {
    if (!targetUserId || paymentLast4.length !== 4) {
      setMessage("Choose a user and enter a valid 4-digit last4.");
      return;
    }

    try {
      await addPaymentMethod({
        variables: {
          input: {
            userId: targetUserId,
            label: paymentLabel,
            type: paymentType,
            last4: paymentLast4,
          },
        },
      });
      await refetch();
      setMessage("Payment method added.");
    } catch (mutationError) {
      setMessage((mutationError as Error).message);
    }
  }

  async function handleRenamePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await updatePaymentMethod({
        variables: {
          input: {
            id: paymentMethodId,
            label: `${paymentLabel} Updated`,
          },
        },
      });
      await refetch();
      setMessage("Payment method updated.");
    } catch (mutationError) {
      setMessage((mutationError as Error).message);
    }
  }

  if (loading) {
    return <p className="text-muted">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-danger">{error.message}</p>;
  }

  if (!me) {
    return <p className="text-danger">No active user context.</p>;
  }

  return (
    <div className="fade-in space-y-6">
      <section className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl leading-tight text-brand-ink">Slooze Food Console</h1>
            <p className="mt-2 text-muted">
              RBAC + ReBAC demo. Active user can only access data inside {me.country}.
            </p>
          </div>

          <label className="flex flex-col text-sm text-muted">
            Active User
            <select
              className="mt-1 rounded-xl border border-border bg-surface px-3 py-2 text-foreground"
              value={activeUserId}
              onChange={(event) => onSwitchUser(event.target.value)}
            >
              {userOptions.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role} - {user.country}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="chip rounded-full px-3 py-1">Role: {me.role}</span>
          <span className="chip rounded-full px-3 py-1">Country: {me.country}</span>
          <span className="chip rounded-full px-3 py-1">Email: {me.email}</span>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="glass-panel rounded-3xl p-6">
          <h2 className="text-2xl text-brand-ink">Restaurants and Menu</h2>
          <p className="mt-2 text-sm text-muted">
            All users can browse restaurants and create orders.
          </p>

          <div className="mt-4 space-y-3">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="rounded-2xl border border-border bg-surface p-4">
                <p className="font-semibold">{restaurant.name}</p>
                <p className="text-xs text-muted">{restaurant.country}</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {restaurant.menuItems.map((item) => (
                    <li key={item.id}>
                      {item.name} - {toCurrency(item.priceCents)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <select
              value={selectedRestaurantId}
              onChange={(event) => {
                setSelectedRestaurantId(event.target.value);
                setSelectedMenuItemId("");
              }}
              className="rounded-xl border border-border bg-surface px-3 py-2"
            >
              <option value="">Select restaurant</option>
              {restaurants.map((restaurant) => (
                <option value={restaurant.id} key={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>

            <select
              value={selectedMenuItemId}
              onChange={(event) => setSelectedMenuItemId(event.target.value)}
              className="rounded-xl border border-border bg-surface px-3 py-2"
              disabled={!selectedRestaurant}
            >
              <option value="">Select item</option>
              {selectedRestaurant?.menuItems.map((menuItem) => (
                <option value={menuItem.id} key={menuItem.id}>
                  {menuItem.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="rounded-xl border border-border bg-surface px-3 py-2"
            />

            <button
              onClick={handleCreateOrder}
              className="rounded-xl bg-brand px-4 py-2 font-semibold text-white hover:opacity-90"
            >
              Create Order
              {selectedMenuItem ? ` (${selectedMenuItem.name})` : ""}
            </button>
          </div>
        </article>

        <article className="glass-panel rounded-3xl p-6">
          <h2 className="text-2xl text-brand-ink">Orders</h2>
          <p className="mt-2 text-sm text-muted">
            Checkout and cancel are restricted to Admin and Manager.
          </p>

          <div className="mt-4 space-y-3">
            {orders.length === 0 ? (
              <p className="text-sm text-muted">No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-muted">Order #{order.id.slice(0, 8)}</p>
                      <p className="font-semibold">{toCurrency(order.totalCents)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      disabled={!canCheckoutOrCancel || order.status !== "PENDING"}
                      onClick={() => handleCheckout(order.id)}
                      className="rounded-lg bg-brand px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Checkout
                    </button>
                    <button
                      disabled={!canCheckoutOrCancel || order.status === "CANCELED"}
                      onClick={() => handleCancel(order.id)}
                      className="rounded-lg bg-danger px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="glass-panel rounded-3xl p-6">
        <h2 className="text-2xl text-brand-ink">Payment Methods</h2>
        <p className="mt-2 text-sm text-muted">
          Only Admin can add or modify payment methods for users in the same country.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select
            className="rounded-xl border border-border bg-surface px-3 py-2"
            value={targetUserId}
            onChange={(event) => setTargetUserId(event.target.value)}
            disabled={!canManagePayments}
          >
            <option value="">Target user</option>
            {userOptions
              .filter((user) => user.country === me.country)
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>

          <input
            value={paymentLabel}
            onChange={(event) => setPaymentLabel(event.target.value)}
            className="rounded-xl border border-border bg-surface px-3 py-2"
            placeholder="Label"
            disabled={!canManagePayments}
          />

          <select
            value={paymentType}
            onChange={(event) => setPaymentType(event.target.value as PaymentType)}
            className="rounded-xl border border-border bg-surface px-3 py-2"
            disabled={!canManagePayments}
          >
            <option value="CARD">CARD</option>
            <option value="UPI">UPI</option>
            <option value="BANK">BANK</option>
          </select>

          <div className="flex gap-2">
            <input
              value={paymentLast4}
              onChange={(event) => setPaymentLast4(event.target.value)}
              className="w-24 rounded-xl border border-border bg-surface px-3 py-2"
              placeholder="Last4"
              disabled={!canManagePayments}
            />
            <button
              onClick={handleAddPaymentMethod}
              className="rounded-xl bg-brand px-4 py-2 font-semibold text-white disabled:opacity-50"
              disabled={!canManagePayments}
            >
              Add
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {paymentMethods.length === 0 ? (
            <p className="text-sm text-muted">No payment methods visible for this user.</p>
          ) : (
            paymentMethods.map((paymentMethod) => (
              <div
                key={paymentMethod.id}
                className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-sm">
                  {paymentMethod.label} ({paymentMethod.type}) ending in {paymentMethod.last4}
                </p>
                <button
                  onClick={() => handleRenamePaymentMethod(paymentMethod.id)}
                  disabled={!canManagePayments}
                  className="rounded-lg border border-border px-3 py-1 text-sm disabled:opacity-50"
                >
                  Quick Rename
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {message ? (
        <p className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-brand-ink">
          {message}
        </p>
      ) : null}
    </div>
  );
}
