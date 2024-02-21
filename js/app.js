const shopContent = document.querySelector(".container__cards");
const cartContent = document.querySelector("#carrito");
const amountCart = document.querySelector('.rounded-pill')

let cart = [];

const getProducts = async () => {

	const response = await fetch("../products.json");
	const data = await response.json();

	data.forEach((product) => {
		let content = document.createElement("div");
		content.className = "card";
		content.style.width = "18rem";
		content.innerHTML = `
		<img src="${product.img}" class="card-img-top">
		<div class="card-body">
          <h5 class="card-title">${product.tittle}</h5>
        </div>
		`;

		shopContent.append(content);

		let buyBtn = document.createElement("a");

		buyBtn.innerText = `$${product.price}`;
		buyBtn.className = "btn-card btn";

		content.append(buyBtn);

		const emptyFunc = () => {
			if (cart.length === 0) {
			cartContent.innerHTML = `
		        <p class='emptyTxt' >Your Cart Is Empty</p>
			`
		}};
		
		emptyFunc();

		buyBtn.addEventListener("click", () => {
			const repeat = cart.some((repeatProduct) => repeatProduct.id === product.id);

			if (repeat) {
				cart.map((prod) => {
					if (prod.id === product.id) {
						prod.amount++;
					}
				});
			} else {
				cart.push({
					id: product.id,
					img: product.img,
					tittle: product.tittle,
					price: product.price,
					amount: product.amount,
				});
			}


			Swal.fire({
				icon: "success",
				title: "We successfully save your purchase!",
			});

			cartCounter();

			let showProducts = () => {
				cartContent.textContent = '';
				cart.forEach((product) => {
					let cartContain = document.createElement("li");
					cartContain.className = "";
					cartContain.innerHTML = `
						<span class="lead">${product.tittle}</span>
						<img class="img" id='cartImg' style="width: 120px; cursor: pointer; border-radius: 15px;" src="${product.img}">
						<span class="badge" id='dropPill'>${product.amount}</span>
						<h3 class='delete-button' >💲${product.price * product.amount}</h3>
						<div>
							<button type="button" id='btnDelete' class="btn btn-outline-danger">-</button>
							<button type="button" id='btnAdd' class="btn btn-outline-info">+</button>
						</div>
						<hr>
					`;

					cartContent.append(cartContain);
				});

				const total = cart.reduce((acc, item) => acc + item.price * item.amount, 0);

				const totalProduct = document.createElement('div');
				totalProduct.className = 'textPrice'
				totalProduct.innerHTML = `Total : $${total}`

				cartContent.append(totalProduct);

				const shopBtn = document.createElement('h5');
				shopBtn.className = 'btnShop'
				shopBtn.innerHTML = 'Finalize Purchase'

				shopBtn.addEventListener('click', () => {
					Swal.fire({
						icon: "success",
						title: "Thanks for shopping. See you soon!",
					});
				})

				cartContent.append(shopBtn);

				const decreaseBtn = cartContent.querySelector('.btn-outline-danger');

				decreaseBtn.addEventListener('click', () => {
					cart = cart.filter(item => {
						if (product.id === item.id) {
							if (item.amount > 0) {
								item.amount--;
								if (item.amount === 0) return
							}
						};

						return item
					});
					showProducts();
					cartCounter();
				});
 
				const addBtn = cartContent.querySelector('.btn-outline-info');

				addBtn.addEventListener('click', () => {
					cart = cart.map(item => {
						if(product.id === item.id) {
							item.amount++
						}
						return item
					});
	
					showProducts()
				});

				
			};

			showProducts();
			
		})


	});

	const cartCounter = () => {
		amountCart.style.display = 'block';
		amountCart.innerText = cart.length;
	}
};

getProducts();