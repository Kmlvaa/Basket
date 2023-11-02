// Importing static product list
import { products } from "./data.js";

// Getting html elements that will be manipulated
const productContainer = document.querySelector(".product-container");
const basketContainer = document.querySelector(".basket-container");
const cardButton = document.querySelector(".card-button");
let totalPrice = document.querySelector(".total-price");
let clearCart = document.querySelector(".clear-cart");

clearCart.addEventListener('click', () => {
  localStorage.removeItem("basket")
})


// Rendering products in the main page
products.forEach((product) => {
  const { id, name, price, imgName } = product;
  let productCard = generateProductCard(id, name, price, imgName);
  productContainer.innerHTML += productCard;
});



// Get all "product add" buttons and assign the functionality of adding them to the basket
// This code works only once per page load
document.querySelectorAll(".add-to-basket-btn").forEach((btn) => {
  btn.onclick = (e) => {
    let id = e.target.getAttribute("data-id");
    let basket = JSON.parse(localStorage.getItem("basket"));
    if (basket == null) {
      localStorage.setItem("basket", JSON.stringify([{ id, count: 1 }]));
    } else {
      if (basket.some((x) => x.id == id)) return;
      basket.push({ id, count: 1 });
      localStorage.setItem("basket", JSON.stringify(basket));
    }
    renderBasketSection();
  };
});

// Rendering basket items once the page starts (code below works 1 time per page load)
renderBasketSection();


// Helper function for generating product card
function generateProductCard(id, name, price, imgName) {
  
  let productCard = `
  <div class="col card-container">
    <div class="card" style="width: 18rem">
            <img
              src="./images/${imgName}"
              class="card-img-top"
              alt="${name}"
            />
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
              <p class="card-text">Price: <span class="price">${price.toFixed(2)}$</span></p>
              <button data-id=${id} class="add-to-basket-btn  btn btn-primary">Add to card</button>
            </div>
          </div>
        </div>
        </div>
    `;
  return productCard;
}

// Helper function for rendering basket section
function renderBasketSection() {
  // Get basket array from local storage if it exists, else - return from the function
  let basket = JSON.parse(localStorage.getItem("basket"));
  if (basket == null) {
    totalPrice.innerHTML = 0;
    return;
  }

  // Reset the content of basket container, so that duplicate basket items are avoided
  basketContainer.innerHTML = "";
  cardButton.innerHTML = "Cart (";

  let total = 0;
  let item_total = 0;
  var total_count = 0;


  // Iterate through items in the basket that came from local storage and append them to basket container
  basket.forEach((x) => {
    // Find real product based on id that is stored in local storage
    let foundProduct = products.find((p) => p.id == x.id);
    if (foundProduct == null) return;
    // Calculate products total price
    total += x.count * foundProduct.price;
    item_total = x.count * foundProduct.price;
    total_count += x.count
    let basketItem = `
      <div class="basket-item">
        <span>${foundProduct.name}</span> 
        <span>(${foundProduct.price})</span>
        <div class="count-btns">
        <button class="btn btn-secondary increase-btn" style="background-color:lightgrey; border:none; color:black; border-radius: 3px;" data-id=${x.id}>+</button>
        <span class="count">${x.count}</span>
        <button class="btn btn-secondary decrease-btn" style="background-color:lightgrey; border:none; color:black; border-radius: 3px;" data-id=${x.id}>-</button>
        </div>
        <button class="btn btn-danger delete-btn" style="width:40px;" data-id=${x.id}>X</button>
        <div>$<span>${item_total.toFixed(2)}</span></div>
    </div>`;

    // Append basket item to basket container
    basketContainer.innerHTML += basketItem;
  });
  
  cardButton.innerHTML += total_count + ")";

  // Append calculated basket value to total
  totalPrice.innerHTML = total.toFixed(2);

  // Take all "increase" buttons of basket items and assign the functionality
  document.querySelectorAll(".increase-btn").forEach((btn) => {
    btn.onclick = (e) => {
      console.log("a");
      let id = e.target.getAttribute("data-id");
      let basket = JSON.parse(localStorage.getItem("basket"));
      let foundBasketItem = basket.find((x) => x.id == id);
      foundBasketItem.count++;
      localStorage.setItem("basket", JSON.stringify(basket));
      renderBasketSection();
    };
  });

  // Take all "decrease" buttons of basket items and assign the functionality
  document.querySelectorAll(".decrease-btn").forEach((btn) => {
    btn.onclick = (e) => {
      let id = e.target.getAttribute("data-id");
      let basket = JSON.parse(localStorage.getItem("basket"));
      let foundBasketItem = basket.find((x) => x.id == id);
      if (foundBasketItem.count == 0) return;
      foundBasketItem.count--;
      basket = basket.filter((x) => x.count != 0)
      localStorage.setItem("basket", JSON.stringify(basket));
      renderBasketSection();
    };
  });

  // Take all "delete" buttons of basket items and assign the functionality
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.onclick = (e) => {
      let id = e.target.getAttribute("data-id");
      let basket = JSON.parse(localStorage.getItem("basket"));
      basket = basket.filter((x) => x.id != id);
      localStorage.setItem("basket", JSON.stringify(basket));
      renderBasketSection();
    };
  });
}
