const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')

let cart = []

//Abrir o carrinho (checkout)
cartBtn.addEventListener('click', function() {
  cartModal.style.display = 'flex'
})

//Fechar o carrinho
closeModalBtn.addEventListener('click', function() {
  cartModal.style.display = 'none'
})

cartModal.addEventListener('click', function(event) {
  if(event.target === cartModal) {
    cartModal.style.display = 'none'
  }
})

// Adicionar ao carrinho
menu.addEventListener('click', function(event) {
  let parentButton = event.target.closest('.add-to-cart-btn')

  if(parentButton) {
    const name = parentButton.getAttribute('data-name')
    const price = parseFloat(parentButton.getAttribute('data-price'))

    addToCart(name, price)
  }
})

//Função para adicionar no carrinho
function addToCart (name, price) {
  const existItemCart = cart.find(item => item.name === name)

  if(existItemCart) {
    existItemCart.quantity++
    console.log(existItemCart)
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    })
  }
  updateCartModal()
}

//Formatar os valores em reais BRL
function formatMoney (value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

//Atualiza o carrinho
function updateCartModal () {
  cartItemsContainer.innerHTML = ""
  let total = 0
  let totalQuantity = 0
  
  cart.forEach(item => {
    const cartItemElement = document.createElement('div')
    let totalItem = 0
    totalItem += parseFloat(`${item.price * item.quantity}`)
    cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')

    cartItemElement.innerHTML = `
      <div class='flex items-center justify-between'>
        <div>
          <p class='font-medium'>${item.name}</p>
          <p>Quantidade: ${item.quantity}</p>
          <p class='font-medium mt-2'>${formatMoney(totalItem)}</p>
        </div>

        <button class='px-2 bg-gray-400 rounded'>Remover</button>
      </div>
    `
    //Atualiza o valor da compra
    total += parseFloat(`${item.price * item.quantity}`)

    //Atualiza a quantidade de items no carrinho
    totalQuantity += parseFloat(`${item.quantity}`)

    //Inclui os itens no modal
    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.innerText = formatMoney(total)
  cartCounter.innerText = totalQuantity
}