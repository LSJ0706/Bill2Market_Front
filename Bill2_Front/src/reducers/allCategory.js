export default function allCategoryReducer(state = [], action) {
    switch (action.type) {
        case 'ALL_CATEGORY': {
            return action.payload
        }

        default:
            return state
    }

}