/*docs_script*/

let controller;

// fetchIndex
async function fetchIndex() {
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

	// AbortController
	if (controller) {
		controller.abort();
	}
	controller = new AbortController();
	const signal = controller.signal;

	try {
		// fetch
		const response = await fetch('json/index.json', {
			cache: 'no-cache',
			signal
		});
		if (!response.ok) throw new Error(`${response.status}! ${response.statusText}`);

		// populate content
		const data = await response.json();
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
			hgroup.appendChild(h3);
			hgroup.appendChild(h5);

			// article
			const article = document.createElement('article');
			article.appendChild(icon);
			article.appendChild(hgroup);
			content.appendChild(article);

			// call fetchSubject(): onclick subject
			article.addEventListener('click', () => {
				fetchSubject(item[1], asideLi[index + 1]);
			});
		});
	} catch (error) {
		console.error(error);
		// errorHeader
		if (error.name !== 'AbortError') {
			const header = document.createElement('header');
			const p = document.createElement('p');
			if (error instanceof TypeError) {
				p.textContent = 'Error loading data. Try again.';
			} else {
				p.textContent = error.message;
			}
			header.appendChild(p);
			content.appendChild(header);
		}
	}
}

// onload
window.addEventListener('load', () => {
	fetchIndex();
});

// fetchSubject
async function fetchSubject(fileName, currentAsideLi) {
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
	navUl.appendChild(navLiIndex);
	navUl.appendChild(navLiSubject);
	
	// empty content
	const content = document.getElementById('content');
	content.innerHTML = '';

	// AbortController
	if (controller) {
		controller.abort();
	}
	controller = new AbortController();
	const signal = controller.signal;

	try {
		// fetch
		const response = await fetch(`json/${fileName.toLowerCase()}.json`, {
			cache: 'no-cache',
			signal
		});
		if (!response.ok) throw new Error(`${response.status}! ${response.statusText}`);

		// populate content
		const data = await response.json();
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
			hgroup.appendChild(h3);
			hgroup.appendChild(h5);

			// article
			const article = document.createElement('article');
			article.appendChild(h1);
			article.appendChild(hgroup);
			content.appendChild(article);

			// call showLesson(): onclick lesson
			article.addEventListener('click', () => {
				showLesson(fileName, item);
			});
		});
	} catch (error) {
		console.error(error);
		// errorHeader
		if (error.name !== 'AbortError') {
			const header = document.createElement('header');
			const p = document.createElement('p');
			if (error instanceof TypeError) {
				p.textContent = 'Error loading data. Try again.';
			} else {
				p.textContent = error.message;
			}
			header.appendChild(p);
			content.appendChild(header);
		}
	}
}

// showLesson
async function showLesson(fileName, data) {
	// asideLi
	const asideLi = document.querySelectorAll('aside ul li');
	asideLi.forEach(item => {
		item.classList.remove('active');
	});

	// navLi
	const navUl = document.getElementById('navigation');
	const navLi = document.createElement('li');
	navLi.textContent = data[0];
	navUl.appendChild(navLi);

	// empty content
	const content = document.getElementById('content');
	content.innerHTML = '';

	// AbortController
	if (controller) {
		controller.abort();
	}
	controller = new AbortController();
	const signal = controller.signal;

	try {
		// fetch
		const sourceSrc = `lesson/${fileName.toLowerCase()}/${data[1]}/${data[1]}.mp4`;
		const response = await fetch(sourceSrc, {
			method: 'HEAD',
			cache: 'no-cache',
			signal
		});

		// lessonHeader
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
			hgroup.appendChild(h3);
			hgroup.appendChild(h5);

			// header
			const header = document.createElement('header');
			header.appendChild(icon);
			header.appendChild(hgroup);
			content.appendChild(header);
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
			figcaption.appendChild(h1);
			figcaption.appendChild(p);

			// img
			const img = document.createElement('img');
			img.src = `lesson/${fileName.toLowerCase()}/${data[1]}/${index + 1}.jpg`;

			// figure
			const figure = document.createElement('figure');
			figure.appendChild(figcaption);
			figure.appendChild(img);
			content.appendChild(figure);
		});
	} catch (error) {
		console.error(error);
		// errorHeader
		if (error.name !== 'AbortError') {
			const header = document.createElement('header');
			const p = document.createElement('p');
			p.textContent = 'Error loading data. Try again.';
			header.appendChild(p);
			content.appendChild(header);
		}
	}
}