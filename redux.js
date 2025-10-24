// Redux action types
const ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  INCREMENT_ITEM: 'INCREMENT_ITEM',
  DECREMENT_ITEM: 'DECREMENT_ITEM',
  DELETE_ITEM: 'DELETE_ITEM',
  SET_DISABLED: 'SET_DISABLED',
  LOAD_STATE: 'LOAD_STATE',
  CLEAR_CART: 'CLEAR_CART'
};

// Action creators
function addToCartAction(plant) { return { type: ACTIONS.ADD_TO_CART, payload: { plant } }; }
function incrementItemAction(plantId) { return { type: ACTIONS.INCREMENT_ITEM, payload: { plantId } }; }
function decrementItemAction(plantId) { return { type: ACTIONS.DECREMENT_ITEM, payload: { plantId } }; }
function deleteItemAction(plantId) { return { type: ACTIONS.DELETE_ITEM, payload: { plantId } }; }
function loadStateAction(state) { return { type: ACTIONS.LOAD_STATE, payload: { state } }; }

// Initial state
const initialState = { cart: {}, disabled: {} };

// Reducer
function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.LOAD_STATE:
      return { ...state, ...action.payload.state || {} };

    case ACTIONS.ADD_TO_CART: {
      const p = action.payload.plant;
      return {
        ...state,
        cart: { ...state.cart, [p.id]: { id: p.id, qty: 1, item: p } },
        disabled: { ...state.disabled, [p.id]: true }
      };
    }

    case ACTIONS.INCREMENT_ITEM: {
      const id = action.payload.plantId;
      const c = state.cart[id];
      return { ...state, cart: { ...state.cart, [id]: { ...c, qty: c.qty + 1 } } };
    }

    case ACTIONS.DECREMENT_ITEM: {
      const id = action.payload.plantId;
      const c = state.cart[id];
      if (!c) return state;
      const newQty = c.qty - 1;
      const newCart = { ...state.cart };
      if (newQty <= 0) {
        delete newCart[id];
        return { ...state, cart: newCart, disabled: { ...state.disabled, [id]: false } };
      }
      return { ...state, cart: { ...newCart, [id]: { ...c, qty: newQty } } };
    }

    case ACTIONS.DELETE_ITEM: {
      const id = action.payload.plantId;
      const newCart = { ...state.cart };
      delete newCart[id];
      return { ...state, cart: newCart, disabled: { ...state.disabled, [id]: false } };
    }

    default:
      return state;
  }
}

// Create store
const store = Redux.createStore(rootReducer);
