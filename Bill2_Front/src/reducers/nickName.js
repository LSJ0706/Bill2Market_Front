export default function nickNameReducer(state = '', action) {
    switch (action.type) {
        case 'NICKNAME': {
            return action.payload
        }

        default:
            return state
    }
}