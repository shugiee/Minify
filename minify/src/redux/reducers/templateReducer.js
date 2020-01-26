const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'TEMPLATE_CASE':
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
}
