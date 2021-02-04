
import { alive,aliveRun, aliveMatch, } from './js/alive';
import { sleep, } from './js/sleep';
import list from './check-list.json';
// import { href, } from './href-list.json';

export { alive, aliveRun, aliveMatch, sleep, };

window.addEventListener('load', async () => {
	try {
        const { src, timeout } = list;
		const result = await alive({ src, timeout, });
		const { matched, } = result;
		if (!matched) {
			throw new Error(result);
		}
		console.log({ result, });
	} catch (error) {
		console.log({ error, });
	}
});
