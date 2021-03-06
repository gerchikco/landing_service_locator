
import { aliveRun, aliveMatch, } from './js/alive';
import { sleep, } from './js/sleep';

import { alive, } from './js/alive';
import list from './check-list.json';
// import { href, } from './href-list.json';

// export { alive, aliveRun, aliveMatch, sleep, };

window.addEventListener('load', async () => {

    try {
        const { po: src, timeout } = list;
        const result = await alive({ src, timeout, });
        const { matched, } = result;
        if (!matched) {
            throw new Error(result);
        }
        // console.log({ result, });
        const url = new URL(result.src);
        const form = document.querySelector('form.aac');
        if (form && !form.url) {
            const hidden = document.createElement('input')
            hidden.setAttribute('type', 'hidden');
            hidden.setAttribute('name', 'url');
            hidden.setAttribute('value', url.origin);
            form.appendChild(hidden);
        }
        window.acc = { url: url.origin, ...window.acc };
    } catch (error) {
        console.log({ error, });
    }

    try {
        const { back: src, timeout } = list;
        const result = await alive({ src, timeout, });
        const { matched, } = result;
        if (!matched) {
            throw new Error(result);
        }
        // console.log({ result, });
        const url = new URL(result.src);
        const form = document.querySelector('form.aac');
        if (form && !form.back_url) {
            const hidden = document.createElement('input')
            hidden.setAttribute('type', 'hidden');
            hidden.setAttribute('name', 'back_url');
            hidden.setAttribute('value', url.origin);
            form.appendChild(hidden);
        }
        window.acc = { back_url: url.origin, ...window.acc };
    } catch (error) {
        console.log({ error, });
    }

});
