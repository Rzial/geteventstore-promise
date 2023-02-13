import axios from 'axios';
import https from 'https';

export default (config) => {
	console.log(`Created single axios client | httpAgent: ${!!config.httpAgent} | httpsAgent: ${!!config.httpsAgent}`)
	return axios.create({
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
					new https.Agent({ rejectUnauthorized: false } ),
			}),
	});
};
