export default function LatitudeReducer(state = 0, action) {
	switch (action.type) {
		case 'LATITUDE': {
			return action.payload
		}

		default:
			return state
	}

}
