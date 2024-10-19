/*docs_script*/

let controller;
let timeoutId;

// fetchIndex
async function fetchIndex() {
	// AbortController
	if (controller) {
		controller.abort();
		clearTimeout(timeoutId);
	}
	controller = new AbortController();

	// asideLi
	const asideLi = document.querySelectorAll('aside ul li');
	asideLi.forEach(item => {
		item.classList.remove('active');
	});
	asideLi[0].classList.add('active');

	// navLi
	const navUl = document.getElementById('navigation');
	navUl.innerHTML = '';
	const navLiIndex = document.createElement('li');
	navLiIndex.textContent = 'Home';
	navLiIndex.addEventListener('click', () => {
		fetchIndex();
	});
	navUl.appendChild(navLiIndex);

	// empty content
	const content = document.getElementById('content');
	content.innerHTML = '';

	// load header
	const header = document.createElement('header');
	header.textContent = 'Loading...';
	content.appendChild(header);

	try {
		// fetch
		const response = await fetch('json/index.json', {
			cache: 'no-cache',
			signal: controller.signal
		});
		if (!response.ok) throw new Error(`${response.status}! ${response.statusText}`);
		const data = await response.json();

		timeoutId = setTimeout(() => {
			// remove load header
			content.removeChild(header);

			// populate content
			data.forEach((item, index) => {
				// icon
				const icon = document.createElement('i');
				icon.className = 'material-symbols-outlined';
				icon.textContent = item[0];

				// hgroup
				const hgroup = document.createElement('hgroup');
				const h3 = document.createElement('h3');
				h3.textContent = item[1];
				const h5 = document.createElement('h5');
				h5.textContent = `${item[2]} lesson`;
				hgroup.append(h3, h5);

				// article
				const article = document.createElement('article');
				article.append(icon, hgroup);
				content.appendChild(article);

				// call fetchSubject(): onclick subject
				article.addEventListener('click', () => {
					fetchSubject(item[1], asideLi[index + 1]);
				});
			});
		}, 500);
	} catch (error) {
		timeoutId = setTimeout(() => {
			console.error(error);
			// error header
			if (error.name !== 'AbortError') {
				if (error instanceof TypeError) {
					header.textContent = 'Error loading data. Try again.';
				} else {
					header.textContent = error.message;
				}
			}
		}, 500);
	}
}

// onload
window.addEventListener('load', () => {
	fetchIndex();
});

// fetchSubject
async function fetchSubject(fileName, currentAsideLi) {
	// AbortController
	if (controller) {
		controller.abort();
		clearTimeout(timeoutId);
	}
	controller = new AbortController();

	// asideLi
	const asideLi = document.querySelectorAll('aside ul li');
	asideLi.forEach(item => {
		item.classList.remove('active');
	});
	currentAsideLi.classList.add('active');

	// navLi
	const navUl = document.getElementById('navigation');
	navUl.innerHTML = '';
	const navLiIndex = document.createElement('li');
	navLiIndex.textContent = 'Home';
	navLiIndex.addEventListener('click', () => {
		fetchIndex();
	});
	const navLiSubject = document.createElement('li');
	navLiSubject.textContent = fileName;
	navLiSubject.addEventListener('click', () => {
		fetchSubject(fileName, currentAsideLi);
	});
	navUl.append(navLiIndex, navLiSubject);
	
	// empty content
	const content = document.getElementById('content');
	content.innerHTML = '';

	// load header
	const header = document.createElement('header');
	header.textContent = 'Loading...';
	content.appendChild(header);

	try {
		// fetch
		const response = await fetch(`json/${fileName.toLowerCase()}.json`, {
			cache: 'no-cache',
			signal: controller.signal
		});
		if (!response.ok) throw new Error(`${response.status}! ${response.statusText}`);
		const data = await response.json();

		timeoutId = setTimeout(() => {
			// remove load header
			content.removeChild(header);

			// populate content
			data.forEach((item, index) => {
				// number
				const h1 = document.createElement('h1');
				h1.textContent = index + 1;

				// hgroup
				const hgroup = document.createElement('hgroup');
				const h3 = document.createElement('h3');
				h3.textContent = item[0];
				const h5 = document.createElement('h5');
				h5.textContent = `${item[2].length} steps`;
				hgroup.append(h3, h5);

				// article
				const article = document.createElement('article');
				article.append(h1, hgroup);
				content.appendChild(article);

				// call showLesson(): onclick lesson
				article.addEventListener('click', () => {
					showLesson(fileName, item);
				});
			});
		}, 500);
	} catch (error) {
		timeoutId = setTimeout(() => {
			console.error(error);
			// error header
			if (error.name !== 'AbortError') {
				if (error instanceof TypeError) {
					header.textContent = 'Error loading data. Try again.';
				} else {
					header.textContent = error.message;
				}
			}
		}, 500);
	}
}

// showLesson
async function showLesson(fileName, data) {
	// AbortController
	if (controller) {
		controller.abort();
		clearTimeout(timeoutId);
	}
	controller = new AbortController();
	
	// asideLi
	const asideLi = document.querySelectorAll('aside ul li');
	asideLi.forEach(item => {
		item.classList.remove('active');
	});

	// navLi
	const navUl = document.getElementById('navigation');
	const navLiLesson = document.createElement('li');
	navLiLesson.textContent = data[0];
	navUl.appendChild(navLiLesson);

	// empty content
	const content = document.getElementById('content');
	content.innerHTML = '';

	// load header
	const header = document.createElement('header');
	header.textContent = 'Loading...';
	content.appendChild(header);

	try {
		// fetch
		const sourceSrc = `lesson/${fileName.toLowerCase()}/${data[1]}/${data[1]}.mp4`;
		const response = await fetch(sourceSrc, {
			method: 'HEAD',
			cache: 'no-cache',
			signal: controller.signal
		});

		timeoutId = setTimeout(() => {
			// lesson header
			(function () {
				// icon
				const icon = document.createElement('i');
				icon.className = 'material-symbols-outlined';
				icon.textContent = 'description';

				// hgroup
				const hgroup = document.createElement('hgroup');
				const h3 = document.createElement('h3');
				h3.textContent = data[0];
				const h5 = document.createElement('h5');
				h5.textContent = `${data[2].length} steps`;
				hgroup.append(h3, h5);

				// header
				header.textContent = '';
				header.append(icon, hgroup);
			})();

			if (response.ok) {
				// video
				const figure = document.createElement('figure');
				const video = document.createElement('video');
				video.controls = true;
				const source = document.createElement('source');
				source.src = sourceSrc;
				video.appendChild(source);
				figure.appendChild(video);
				content.appendChild(figure);
			}

			// populate content
			data[2].forEach((item, index) => {
				// figcaption
				const figcaption = document.createElement('figcaption');
				const h1 = document.createElement('h1');
				h1.textContent = index + 1;
				const p = document.createElement('p');
				p.textContent = item;
				figcaption.append(h1, p);

				// img
				const img = document.createElement('img');
				img.src = `lesson/${fileName.toLowerCase()}/${data[1]}/${index + 1}.jpg`;

				// figure
				const figure = document.createElement('figure');
				figure.append(figcaption, img);
				content.appendChild(figure);
			});
		}, 500);
	} catch (error) {
		timeoutId = setTimeout(() => {
			console.error(error);
			// error header
			if (error.name !== 'AbortError') {
				header.textContent = 'Error loading data. Try again.';
			}
		}, 500);
	}
}