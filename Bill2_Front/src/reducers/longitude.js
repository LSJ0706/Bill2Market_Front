export default function LongitudeReducer(state = 0, action) {
	switch (action.type) {
		case 'LONGITUDE': {
			return action.payload
		}

		default:
			return state
	}

}
