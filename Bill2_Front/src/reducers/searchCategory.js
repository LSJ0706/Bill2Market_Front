export default function searchCategoryReducer(state = [], action) {
	switch (action.type) {
		case 'CATEGORY': {
			return action.payload
		}

		default:
			return state
	}
}
