import { create } from 'zustand'
import { cartApi } from '../services/cart'
import { useAuthStore } from './authStore'

export interface CartItem {
  id?: string
  productId: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => Promise<void>
  removeItem: (productId: string, size?: string, color?: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => Promise<void>
  clearCart: () => Promise<void>
  fetchCart: () => Promise<void>
  mergeGuestCart: (guestItems: CartItem[]) => Promise<void>
  getTotalPrice: () => number
  getTotalItems: () => number
  isSyncing: boolean
}

export const useCartStore = create<CartStore>()(
  (set, get) => ({
    items: [],
    isSyncing: false,

    fetchCart: async () => {
      const { isAuthenticated } = useAuthStore.getState()
      if (!isAuthenticated) return

      set({ isSyncing: true })
      try {
        // Clear local cart items before fetching from backend
        set({ items: [] })
        const cart = await cartApi.getCart()
        set({ items: cart.items })
      } catch (error) {
        console.error('Failed to fetch cart:', error)
      } finally {
        set({ isSyncing: false })
      }
    },

      addItem: async (item) => {
        const { isAuthenticated } = useAuthStore.getState()

        // If logged in, sync with backend
        if (isAuthenticated) {
          set({ isSyncing: true })
          try {
            const cart = await cartApi.addItem({
              productId: item.productId,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
            })
            set({ items: cart.items })
          } catch (error) {
            console.error('Failed to add item to cart:', error)
            // Fallback to local state if API fails
            set((state) => {
              const existingItemIndex = state.items.findIndex(
                (i) =>
                  i.productId === item.productId &&
                  i.size === item.size &&
                  i.color === item.color
              )

              if (existingItemIndex >= 0) {
                const updatedItems = [...state.items]
                updatedItems[existingItemIndex] = {
                  ...updatedItems[existingItemIndex],
                  quantity: updatedItems[existingItemIndex].quantity + item.quantity,
                }
                return { items: updatedItems }
              }

              return { items: [...state.items, item] }
            })
          } finally {
            set({ isSyncing: false })
          }
        } else {
          // Guest user - use localStorage only
          set((state) => {
            const existingItemIndex = state.items.findIndex(
              (i) =>
                i.productId === item.productId &&
                i.size === item.size &&
                i.color === item.color
            )

            if (existingItemIndex >= 0) {
              const updatedItems = [...state.items]
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                quantity: updatedItems[existingItemIndex].quantity + item.quantity,
              }
              return { items: updatedItems }
            }

            return { items: [...state.items, item] }
          })
        }
      },

      removeItem: async (productId, size, color) => {
        const { isAuthenticated } = useAuthStore.getState()

        if (isAuthenticated) {
          set({ isSyncing: true })
          try {
            // Find the item ID to remove
            const itemToRemove = get().items.find(
              (item) =>
                item.productId === productId &&
                item.size === size &&
                item.color === color
            )

            if (itemToRemove) {
              const cart = await cartApi.removeItem(itemToRemove.id)
              set({ items: cart.items })
            }
          } catch (error) {
            console.error('Failed to remove item from cart:', error)
            // Fallback to local state
            set((state) => ({
              items: state.items.filter(
                (item) =>
                  !(
                    item.productId === productId &&
                    item.size === size &&
                    item.color === color
                  )
              ),
            }))
          } finally {
            set({ isSyncing: false })
          }
        } else {
          set((state) => ({
            items: state.items.filter(
              (item) =>
                !(
                  item.productId === productId &&
                  item.size === size &&
                  item.color === color
                )
            ),
          }))
        }
      },

      updateQuantity: async (productId, quantity, size, color) => {
        const { isAuthenticated } = useAuthStore.getState()

        if (isAuthenticated) {
          set({ isSyncing: true })
          try {
            const itemToUpdate = get().items.find(
              (item) =>
                item.productId === productId &&
                item.size === size &&
                item.color === color
            )

            if (itemToUpdate) {
              const cart = await cartApi.updateItem(itemToUpdate.id, { quantity })
              set({ items: cart.items })
            }
          } catch (error) {
            console.error('Failed to update item quantity:', error)
            // Fallback to local state
            set((state) => ({
              items: state.items.map((item) =>
                item.productId === productId &&
                item.size === size &&
                item.color === color
                  ? { ...item, quantity }
                  : item
              ),
            }))
          } finally {
            set({ isSyncing: false })
          }
        } else {
          set((state) => ({
            items: state.items.map((item) =>
              item.productId === productId &&
              item.size === size &&
              item.color === color
                ? { ...item, quantity }
                : item
            ),
          }))
        }
      },

      clearCart: async () => {
        const { isAuthenticated } = useAuthStore.getState()

        if (isAuthenticated) {
          set({ isSyncing: true })
          try {
            const cart = await cartApi.clearCart()
            set({ items: cart.items })
          } catch (error) {
            console.error('Failed to clear cart:', error)
            // Fallback to local state
            set({ items: [] })
          } finally {
            set({ isSyncing: false })
          }
        } else {
          set({ items: [] })
        }
      },

      mergeGuestCart: async (guestItems: CartItem[]) => {
        const { isAuthenticated } = useAuthStore.getState()
        if (!isAuthenticated) return

        set({ isSyncing: true })
        try {
          const cart = await cartApi.mergeCart(guestItems)
          set({ items: cart.items })
        } catch (error) {
          console.error('Failed to merge cart:', error)
        } finally {
          set({ isSyncing: false })
        }
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    })
)
