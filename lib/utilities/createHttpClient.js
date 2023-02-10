import axios from 'axios';
import https from 'https';

export default (config) => axios.create({
	headers: { Accept: 'application/json' },

	...(config.httpAgent
		? {
			httpAgent: config.httpAgent,
		}
		: {}),

	...(config.httpsAgent
		? {
			httpsAgent: config.httpsAgent,
		}
		: {
			httpsAgent:
				!config.validateServer &&
				new https.Agent({ rejectUnauthorized: false }),
		}),
});
