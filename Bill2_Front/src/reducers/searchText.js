export default function searchTextReducer(state = '', action) {
    switch (action.type) {
        case 'SEARCH_TEXT': {
            return action.payload
        }

        default:
            return state
    }
}