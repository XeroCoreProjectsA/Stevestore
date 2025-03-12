document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:3000/products')
        .then(res => res.json())
        .then(data => {
            let productList = document.getElementById("product-list");
            data.forEach(product => {
                let div = document.createElement("div");
                div.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Harga: ${product.price}</p>
                    <button onclick="buy(${product.id})">Beli</button>
                `;
                productList.appendChild(div);
            });
        });
});

function buy(productId) {
    fetch('http://localhost:3000/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1, product_id: productId, amount: 1 })
    }).then(res => res.json()).then(data => alert(data.message));
}
