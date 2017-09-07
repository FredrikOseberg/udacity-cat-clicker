'use strict';
// 1. Create a cat constructor with count, picture and name
// 2. Add an increment method to the cat prototype
const sidebarList = document.querySelector('.cat-list');
const catDisplay = document.querySelector('.cat-display');
const changeFormBtn = document.querySelector('.change-form-button');
const cancelFormBtn = document.querySelector('.change-form-cancel');

const names = ['James', 'Christopher', 'Tiger', 'Sandy', 'April', 
				'Wiggleface', 'Robin', 'Batman', 'Sara', 'Heidi',
				'Alex', 'Fredrik', 'Cheese'];

const lastNames = ['McCatface', 'Catsy', 'Strappy', 'Spiro', 
					'Sireatsalot', 'Fatty', 'McMuffin', 'Fluffypants',
					'Cosyballz', 'Furball', 'McWhiskers'];

const images = [
	'img/cat.jpg',
	'img/cat2.jpg',
	'img/cat3.jpeg',
	'img/cat4.jpeg',
	'img/cat5.jpeg',
];

function getRandomNumber(max) {
	return Math.round(Math.random() * max);
}

function chooseImage() {
	let image;
	if (images.length === 0) {
		image = 'img/default.jpeg';	
	} else {
		image = images.shift();
	}
	return image;
}

function generateRandomName() {
	const firstName = names[getRandomNumber(names.length - 1)];
	const lastName = lastNames[getRandomNumber(lastNames.length - 1)];
	return `${firstName} ${lastName}`;
}

function Cat() {
	this.count = 0;
	this.picture = chooseImage();
	this.name = generateRandomName();
}

Cat.prototype.increment = function() {
	this.count += 1;
}

var model = {
	cats: [new Cat(), new Cat(), new Cat(), new Cat(), new Cat(), new Cat()],
	admin: true
};
model.currentCat = model.cats[0];



var controller = {
	init: function() {
		views.renderList(model.cats, 0);
		views.renderCatContent(model.currentCat);
		views.renderAdminPanel();
		this.setupEventListener();
	},
	setupEventListener: function() {
		const catPictures = document.querySelector('.cat-click-image');
		catPictures.addEventListener('click', handlers.handleCatImageClick);
	},
	getAdminProperty: function() {
		return model.admin;
	},
	setModelProps: function(name = model.name, imageurl = model.url, count = model.count) {
		console.log(name, imageurl, count);
		model.currentCat.name = name;
		model.currentCat.url = imageurl;
		model.currentCat.count = parseInt(count);
	}
};

var handlers = {
	handleCatListItemClick: function(e) {
		if (this.classList.contains('selected')) return;
		const listItems = document.querySelectorAll('.cat-list-item');
		const catId = this.dataset.id;
		model.currentCat = model.cats[catId];
		listItems.forEach(item => {
			if (item.classList.contains('selected')) {
				item.classList.remove('selected');
			} else if (item.dataset.id === catId) {
				item.classList.add('selected');
			}
		});

		views.renderCatContent(model.currentCat);
		views.resetAdminForm();
	},
	handleCatImageClick: function() {
		model.currentCat.increment();
		views.renderCatContent(model.currentCat);
	},
	handleChangeFormClick: function(e) {
		e.preventDefault();
		const name = views.formName.value;
		const imageurl = views.formImageUrl.value;
		const formCount = views.formCount.value;
		controller.setModelProps(name, imageurl, formCount)
		views.renderAdminForm();
		views.renderCatContent(model.currentCat);
		views.resetAdminForm();
	},
	handleCancelBtnClick: function(e) {
		e.preventDefault();
		views.resetAdminForm();
	}
};

var views = {
	formName: document.querySelector('.cat-name'),
	formImageUrl: document.querySelector('.cat-image-url'),
	formCount: document.querySelector('.cat-count'),
	renderList: function(arr, selected) {
		const listItems = arr.map((cat, index) => {
			let selectedItem;
			index === selected ? selectedItem = true : selectedItem = false;
			return `
				<li class="cat-list-item ${selectedItem ? "selected" : "" }" data-id="${index}">
					<img src="${cat.picture}" alt="cute cat" class="cat-image">
					<h3 class="cat-name">${cat.name}</h3>
				</li>	
			`;
		}).join("");

		sidebarList.innerHTML = listItems;
	},
	renderCatContent: function(cat) {
		const catContent = `
			<div class="cat-content">
				<div class="cat-content-container">
					<h1>${cat.name}</h1>
					<img src="${cat.picture}" alt="${cat.name}" class="cat-click-image">
					<h3 class="cat-count">${cat.count}</h3>
				</div>
			</div>
		`;

		catDisplay.innerHTML = catContent;
		controller.setupEventListener();
	},
	renderAdminPanel: function() {
		const isAdmin = controller.getAdminProperty();
		if (isAdmin) {
			const adminContent = document.querySelector('.button-container');
			console.log(adminContent);
			const adminButton = document.createElement('button');
			adminButton.textContent = 'Admin';
			adminButton.classList.add('admin-button', 'visible');
			adminContent.appendChild(adminButton);
			adminButton.addEventListener('click', function() {
				views.renderAdminForm();
			});
		}
	},
	renderAdminForm() {
		const adminButton = document.querySelector('.admin-button');
		const adminForm = document.querySelector('.admin-form-container');
		adminButton.classList.remove('visible');
		adminForm.classList.add('flex');
		this.formName.value = model.currentCat.name;
		this.formImageUrl.value = model.currentCat.picture;
		this.formCount.value = model.currentCat.count;
	},
	resetAdminForm() {
		const adminButton = document.querySelector('.admin-button');
		const adminForm = document.querySelector('.admin-form-container');
		adminButton.classList.add('visible');
		adminForm.classList.remove('flex');
	}
}

controller.init();

const catListItems = document.querySelectorAll('.cat-list-item');

catListItems.forEach(item => {
	item.addEventListener('click', handlers.handleCatListItemClick);
});
changeFormBtn.addEventListener('click', handlers.handleChangeFormClick);
cancelFormBtn.addEventListener('click', handlers.handleCancelBtnClick);




