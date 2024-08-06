document.addEventListener('DOMContentLoaded', () => {
    const fruitsFieldset = document.getElementById('fruits');
    const vegetablesFieldset = document.getElementById('vegetables');
    const meatSeafoodFieldset = document.getElementById('meat-seafood');
    const dairyFieldset = document.getElementById('dairy');
    const bakingCookingFieldset = document.getElementById('baking-cooking');

    // Hiding all fieldsets 
    [fruitsFieldset, vegetablesFieldset, meatSeafoodFieldset, dairyFieldset, bakingCookingFieldset].forEach(fieldset => fieldset.style.display = 'none');

    // Show the relevant fieldset
    function showFieldset(fieldset) {
        [fruitsFieldset, vegetablesFieldset, meatSeafoodFieldset, dairyFieldset, bakingCookingFieldset].forEach(fieldset => fieldset.style.display = 'none');
        fieldset.style.display = 'block';
    }

    // Event listeners for product links
    document.querySelector('a[href="#fruits"]').addEventListener('click', () => showFieldset(fruitsFieldset));
    document.querySelector('a[href="#vegetables"]').addEventListener('click', () => showFieldset(vegetablesFieldset));
    document.querySelector('a[href="#meat-seafood"]').addEventListener('click', () => showFieldset(meatSeafoodFieldset));
    document.querySelector('a[href="#dairy"]').addEventListener('click', () => showFieldset(dairyFieldset));
    document.querySelector('a[href="#baking-cooking"]').addEventListener('click', () => showFieldset(bakingCookingFieldset));

    // Cart functionality
    const cart = document.getElementById('cart').getElementsByTagName('tbody')[0];
    const forms = document.querySelectorAll('form');
    const cartTableBody = document.querySelector('#cart tbody');
    const addToFavoritesButton = document.getElementById('add-to-favorites');
    const applyFavoritesButton = document.getElementById('apply-favorites');

    forms.forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
            let valid = true;

            checkboxes.forEach(checkbox => {
                const quantityInput = form.querySelector(`input[name="${checkbox.value}-qty"]`);
                const quantity = quantityInput.value;
                if (!quantity || quantity <= 0) {
                    valid = false;
                    quantityInput.focus();
                    alert('Please add the quantity for all selected products.');
                    return;
                }

                const productRow = createProductRow(checkbox, formData);
                cart.appendChild(productRow);
                checkbox.checked = false;  // Uncheck the checkbox after adding to cart
            });

            if (valid) {
                updateCartTotal();
            }
        });
    });

    function createProductRow(checkbox, formData) {
        const product = checkbox.id;
        const priceText = checkbox.nextElementSibling.innerText;
        const price = parseFloat(priceText.match(/\d+\.?\d*/)[0]);
        const quantity = formData.get(`${product}-qty`);
        const total = (price * quantity).toFixed(2);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.charAt(0).toUpperCase() + product.slice(1)}</td>
            <td>${price}</td>
            <td>${quantity}</td>
            <td>${total}</td>
            <td><button class="remove-btn">Remove</button></td>
        `;

        row.querySelector('.remove-btn').addEventListener('click', () => {
            row.remove();
            updateCartTotal();
        });

        return row;
    }

    function updateCartTotal() {
        let total = 0;
        const rows = cart.querySelectorAll('tr:not(#total-row)');  // Exclude total row if it exists

        rows.forEach(row => {
            const rowTotal = parseFloat(row.cells[3].innerText);
            total += rowTotal;
        });

        let totalRow = document.getElementById('total-row');
        if (!totalRow) {
            totalRow = document.createElement('tr');
            totalRow.id = 'total-row';
            totalRow.innerHTML = `
                <td colspan="3"><strong>Total</strong></td>
                <td colspan="2"><strong>${total.toFixed(2)}</strong></td>
            `;
        } else {
            totalRow.cells[1].innerText = total.toFixed(2);
        }

        // Append the total row to the end of the table body
        cart.appendChild(totalRow);
    }

    // Function to save cart to local storage
    function saveCartToFavorites() {
        const cartItems = [];
        cartTableBody.querySelectorAll('tr').forEach(row => {
            if (row.id !== 'total-row') {
                const name = row.children[0].textContent;
                const price = parseFloat(row.children[1].textContent);
                const quantity = parseFloat(row.children[2].textContent);
                cartItems.push({ name, price, quantity });
            }
        });
        localStorage.setItem('favorites', JSON.stringify(cartItems));
        alert('Your order is added to favorites.');
    }

    // Function to apply favorites from local storage to cart
    function applyFavoritesToCart() {
        const favorites = JSON.parse(localStorage.getItem('favorites'));
        if (favorites) {
            // Clear the cart table body except the total row
            const totalRow = document.getElementById('total-row');
            cartTableBody.innerHTML = '';
            if (totalRow) {
                cartTableBody.appendChild(totalRow);
            }

            favorites.forEach(item => {
                const productRow = document.createElement('tr');
                productRow.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td><button class="remove-btn">Remove</button></td>
                `;
                productRow.querySelector('.remove-btn').addEventListener('click', () => {
                    productRow.remove();
                    updateCartTotal();
                });
                // Insert before the total row if it exists
                if (totalRow) {
                    cartTableBody.insertBefore(productRow, totalRow);
                } else {
                    cartTableBody.appendChild(productRow);
                }
            });
            updateCartTotal();
        }
    }

    // Event listener for "Add to Favorites" button
    addToFavoritesButton.addEventListener('click', saveCartToFavorites);

    // Event listener for "Apply Favorites" button
    applyFavoritesButton.addEventListener('click', applyFavoritesToCart);
});































// Function to validate checkout form
function validateCheckoutForm() {
    var isValid = true;

    // Validate Personal Details Form
    var fname = document.getElementById("Fname");
    var lname = document.getElementById("Lname");
    var email = document.getElementById("email");
    var phone = document.querySelector("#PersonalInfo #phone");

    var fnameError = document.getElementById("FnameError");
    var lnameError = document.getElementById("LnameError");
    var emailError = document.getElementById("emailError");
    var phoneError = document.getElementById("phoneError");

    // Remove previous error highlighting and messages
    fname.classList.remove("error");
    lname.classList.remove("error");
    email.classList.remove("error");
    phone.classList.remove("error");

    fnameError.style.display = "none";
    lnameError.style.display = "none";
    emailError.style.display = "none";
    phoneError.style.display = "none";

    // Validate first name field
    if (fname.value.trim() === "") {
        fname.classList.add("error");
        fnameError.style.display = "inline";
        isValid = false;
    }

    // Validate last name field
    if (lname.value.trim() === "") {
        lname.classList.add("error");
        lnameError.style.display = "inline";
        isValid = false;
    }

    // Validate email field
    if (email.value.trim() === "") {
        email.classList.add("error");
        emailError.style.display = "inline";
        isValid = false;
    } else {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            alert("Invalid email format");
            email.classList.add("error");
            emailError.style.display = "inline";
            isValid = false;
        }
    }

    // Validate phone number field
    if (phone.value.trim() === "") {
        phone.classList.add("error");
        phoneError.style.display = "inline";
        isValid = false;
    } else {
        var phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(phone.value.trim())) {
            alert("Invalid phone number format. Please enter a number in the format 123-456-7890");
            phone.classList.add("error");
            phoneError.style.display = "inline";
            isValid = false;
        }
    }

    // Validate Shipping Details Form
    var address = document.getElementById("address");
    var city = document.getElementById("city");
    var country = document.getElementById("country");
    var zip = document.getElementById("zip");

    var addressError = document.getElementById("addressError");
    var cityError = document.getElementById("cityError");
    var countryError = document.getElementById("countryError");
    var zipError = document.getElementById("zipError");

    address.classList.remove("error");
    city.classList.remove("error");
    country.classList.remove("error");
    zip.classList.remove("error");

    addressError.style.display = "none";
    cityError.style.display = "none";
    countryError.style.display = "none";
    zipError.style.display = "none";

    // Validate address field
    if (address.value.trim() === "") {
        address.classList.add("error");
        addressError.style.display = "inline";
        isValid = false;
    }

    // Validate city field
    if (city.value.trim() === "") {
        city.classList.add("error");
        cityError.style.display = "inline";
        isValid = false;
    }

    // Validate country field
    if (country.value.trim() === "") {
        country.classList.add("error");
        countryError.style.display = "inline";
        isValid = false;
    }

    // Validate zip field
    if (zip.value.trim() === "") {
        zip.classList.add("error");
        zipError.style.display = "inline";
        isValid = false;
    }

    // Validate Payment Details Form
    var cardNumber = document.getElementById("card-number");
    var expiry = document.getElementById("expiry");
    var cvv = document.getElementById("cvv");

    var cardNumberError = document.getElementById("cardNumberError");
    var expiryError = document.getElementById("expiryError");
    var cvvError = document.getElementById("cvvError");

    cardNumber.classList.remove("error");
    expiry.classList.remove("error");
    cvv.classList.remove("error");

    cardNumberError.style.display = "none";
    expiryError.style.display = "none";
    cvvError.style.display = "none";

    // Validate card number field
    if (cardNumber.value.trim() === "") {
        cardNumber.classList.add("error");
        cardNumberError.style.display = "inline";
        isValid = false;
    }

    // Validate expiry date field
    if (expiry.value.trim() === "") {
        expiry.classList.add("error");
        expiryError.style.display = "inline";
        isValid = false;
    }

    // Validate cvv field
    if (cvv.value.trim() === "") {
        cvv.classList.add("error");
        cvvError.style.display = "inline";
        isValid = false;
    }

    // If all fields are valid, display the thank you message
    if (isValid) {
        var deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3); // Estimated delivery date is 3 days from now
        alert("Thank you for your purchase! Your order will be delivered on " + deliveryDate.toDateString() + ".");
    }

    return isValid;
}
