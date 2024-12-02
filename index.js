
const categoryItems = () => {
    fetch('https://dummyjson.com/products/category-list')
        .then((res) => {
            return res.json()
        })
        .then((items) => {
            items.unshift('All')
            items.map((item) => {
                let option = document.createElement('option')
                option.text = item;
                option.value = item;
                document.querySelector('#categories').appendChild(option)
            })
        })
}


const allProducts = ((url) => {
    const main = document.querySelector('main');
    main.innerHTML = "";
    fetch(url)
        .then((res) => res.json())
        .then((items) => {
            items.products.forEach((item) => {
                let div = document.createElement('div');
                div.className = 'card m-2 p-2 d-flex flex-wrap justify-content-center';
                div.style.width = '190px';
                div.style.height = '280px';
                //const rupees = (item.price * exchangeRate).toFixed(2);
                div.innerHTML = `
                <img src="${item.images[0]}" class='card-img-top' height='130'>
                <div class="card-body">
                <p>price: <strong>${item.price}/-</strong></p>
                </div>
                <div class="card-footer text-center">
                <button class='btn btn-warning px-4' onclick="addToCart('${item.images[0]}','${item.price}')">Add To Cart</button>
                </div>
                `
                main.appendChild(div);
            })
        })
})

const viewAllData = (() => {
    categoryItems();
    allProducts('https://dummyjson.com/products');
    getCartCount();
})

const categoriChange = (() => {
    let categoriName = document.querySelector('#categories').value;

    if (categoriName === 'All') {
        allProducts('https://dummyjson.com/products');
    } else {
        allProducts(`https://dummyjson.com/products/category/${categoriName}`);
    }
})


const searchItem = () => {
    let search = document.getElementById('itemSearch').value;
    allProducts(`https://dummyjson.com/products/category/${search}`);
}

const ratingChange = (() => {
    let main = document.querySelector('main');
    main.innerHTML = '';
    let selectedRating = [];
    let filterRating = document.querySelectorAll(`.rating-filter`);
    filterRating.forEach(rating => {
        if (rating.checked) {
            selectedRating.push(parseFloat(rating.value));
        }
    });

    if (selectedRating.length) {
        fetch(`https://dummyjson.com/products`)
            .then((res) => res.json())
            .then((items) => {
                let products = items.products || [];
                let filteredItems = products.filter(item => {
                    return selectedRating.some(rating => item.rating >= rating);
                })
                filteredItems.forEach((item) => {
                    let div = document.createElement('div');
                    div.className = 'card m-2 p-2 d-flex flex-wrap justify-content-center';
                    div.style.width = '190px';
                    div.style.height = '280px';
                    div.innerHTML = `
                    <img src="${item.images[0] || ''}" class='card-header' height='130'>
                    <h4 class='card-body'>${item.price}</h4>
                    <button class='btn btn-warning card-footer' onclick="addToCart('${item.images[0]}','${item.price}')">Add To Cart</button>
                    `
                    main.appendChild(div);
                })
            })
    } else {
        allProducts('https://dummyjson.com/products');
    }
});


let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let cartValue = localStorage.getItem('cartValue') || cartItems.length;


let addToCart = (image, price) => {
    const item = { image, price };
    cartItems.push(item);
    cartValue += 1;


    localStorage.setItem('cartValue', cartValue);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));


    displayCartItems();
};


let displayCartItems = () => {
    const itemDisplay = document.getElementById('itemDisplay');
    itemDisplay.innerHTML = '';

    cartItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('d-flex', 'justify-content-around', 'align-items-center');

        const itemImage = document.createElement('img');
        itemImage.src = item.image;
        itemImage.width = 60;
        itemImage.className = "border border-2";

        const itemPrice = document.createElement('p');
        itemPrice.classList.add('px-4');
        itemPrice.innerHTML = `${item.price}/-`;

        const closeButton = document.createElement('button');
        closeButton.classList.add('btn-close');
        closeButton.onclick = () => removeFromCart(index);


        itemDiv.appendChild(itemImage);
        itemDiv.appendChild(itemPrice);
        itemDiv.appendChild(closeButton);


        itemDisplay.appendChild(itemDiv);
    });


    getCartCount();
};


let removeFromCart = (index) => {
    cartItems.splice(index, 1);
    cartValue -= 1;


    localStorage.setItem('cartValue', cartValue);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));


    displayCartItems();
};


let getCartCount = () => {
    const cartCountDisplay = document.getElementById('cartCount');
    cartCountDisplay.innerText = cartValue;
};


displayCartItems();


