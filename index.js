const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const cartWarn = document.getElementById("cart-warn");
const openWarn = document.getElementById("open-warn");

let cart = [];

//Open the cart (checkout)
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
  cartWarn.classList.add("hidden");
  addressWarn.classList.add("hidden");
  addressInput.classList.remove("border-red-500");
  updateCartModal();
});

//Close the cart
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

//Hidden the cart
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Add items on cart
menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);
  }
});

//Function to add items on cart
function addToCart(name, price) {
  const existItemCart = cart.find((item) => item.name === name);

  if (existItemCart) {
    existItemCart.quantity++;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
  updateCartModal();
}

//Format the value in BRL currency
function formatMoney(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

//Update the cart
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let totalQuantity = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    let totalItem = 0;
    totalItem += parseFloat(`${item.price * item.quantity}`);
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
      <div class='flex items-center justify-between'>
        <div>
          <p class='font-medium'>${item.name}</p>
          <p>Quantidade: ${item.quantity}</p>
          <p class='font-medium mt-2'>${formatMoney(totalItem)}</p>
        </div>

        <button 
          class='px-2 bg-gray-400 rounded remove-item-btn' 
          data-name='${item.name}'
        >
          Remover
        </button>
      </div>
    `;
    //Atualiza o valor da compra
    total += parseFloat(`${item.price * item.quantity}`);

    //Atualiza a quantidade de items no carrinho
    totalQuantity += parseFloat(`${item.quantity}`);

    //Inclui os itens no modal
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.innerText = formatMoney(total);
  cartCounter.innerText = totalQuantity;
}

//Delete item from cart
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-item-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const cartIndex = cart.findIndex((item) => item.name === name);

  if (cartIndex !== -1) {
    const item = cart[cartIndex];

    if (item.quantity > 1) {
      item.quantity--;
      updateCartModal();
    } else {
      cart.splice(cartIndex, 1);
      updateCartModal();
    }
  }
}

//Get the data address and confirm if user input the data before send the order
addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

//Send order
checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();

  if (!isOpen) {
    Toastify({
      text: "Ops... O restaurante está fechado, volte mais tarde...",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast()
    return;
  }
  if (cart.length === 0 && addressInput.value === "") {
    cartWarn.classList.remove("hidden");
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
  } else if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
  } else if (cart.length === 0) {
    cartWarn.classList.remove("hidden");
  }

  //Send to api whatsApp
  const cartItems = cart
    .map((item) => {
      return `${item.name} - Quantidade: ${item.quantity} - Preço: R$ ${item.price} |`;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "55011990085876";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`
  );

  cart = [];
  addressInput.value = "";
  updateCartModal();
});

//Check place is open
function checkRestaurantOpen() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  //Check if is between at 18:00 e 23:59
  return hours >= 18 && (hours < 23 || (hours === 23 && minutes <= 59));
}

//Update layout restaurant open/close
const spanOpen = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanOpen.classList.remove("bg-red-500");
  spanOpen.classList.add("bg-green-500");
  checkoutBtn.classList.remove("disable");
} else {
  spanOpen.classList.add("bg-red-500");
  spanOpen.classList.remove("bg-green-500");
  checkoutBtn.classList.add("disable");
}
