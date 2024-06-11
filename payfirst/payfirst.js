function generateMemberInputs() {
    const numMembers = document.getElementById('numMembers').value;
    const memberNamesDiv = document.getElementById('memberNames');
    memberNamesDiv.innerHTML = '';
    for (let i = 0; i < numMembers; i++) {
        const memberDiv = document.createElement('div');
        memberDiv.classList.add('form-group');
        memberDiv.innerHTML = `
            <label for="member${i}">Name of Member ${i + 1}:</label>
            <input type="text" class="form-control" id="member${i}" placeholder="Enter name of member ${i + 1}">
            <div id="member${i}Items">
                <div class="row mb-2">
                    <div class="col">
                        <input type="text" class="form-control" placeholder="Item">
                    </div>
                    <div class="col">
                        <input type="number" class="form-control" placeholder="Quantity" min="1">
                    </div>
                    <div class="col">
                        <button class="btn btn-success" onclick="addMemberItemRow(${i})">+</button>
                    </div>
                </div>
            </div>
        `;
        memberNamesDiv.appendChild(memberDiv);
    }
}

function addItemRow() {
    const itemList = document.getElementById('itemList');
    const row = document.createElement('div');
    row.classList.add('row', 'mb-2');
    row.innerHTML = `
        <div class="col">
            <input type="text" class="form-control" placeholder="Item">
        </div>
        <div class="col">
            <input type="number" class="form-control" placeholder="Quantity" min="1">
        </div>
        <div class="col">
            <input type="number" class="form-control" placeholder="Total Price" min="0">
        </div>
        <div class="col">
            <button class="btn btn-danger" onclick="removeItemRow(this)">-</button>
        </div>
    `;
    itemList.appendChild(row);
}

function removeItemRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

function addMemberItemRow(memberIndex) {
    const memberItemsDiv = document.getElementById(`member${memberIndex}Items`);
    const row = document.createElement('div');
    row.classList.add('row', 'mb-2');
    row.innerHTML = `
        <div class="col">
            <input type="text" class="form-control" placeholder="Item">
        </div>
        <div class="col">
            <input type="number" class="form-control" placeholder="Quantity" min="1">
        </div>
        <div class="col">
            <button class="btn btn-danger" onclick="removeItemRow(this)">-</button>
        </div>
    `;
    memberItemsDiv.appendChild(row);
}

function calculateBill() {
    const itemList = Array.from(document.getElementById('itemList').getElementsByClassName('row')).map(row => {
        const inputs = row.getElementsByTagName('input');
        const item = inputs[0].value.trim();
        const quantity = parseInt(inputs[1].value);
        const totalPrice = parseFloat(inputs[2].value);
        return [item, quantity, totalPrice];
    });

    const itemPrices = {};
    itemList.forEach(([item, quantity, totalPrice]) => {
        itemPrices[item] = totalPrice / quantity;
    });

    const taxPrice = parseFloat(document.getElementById('taxPrice').value);
    const numMembers = document.getElementById('numMembers').value;

    const members = []; // Expected output: member = [A, [Pizza, 1], 20.00]
    for (let i = 0; i < numMembers; i++) {
        const memberName = document.getElementById(`member${i}`).value;
        const memberItems = Array.from(document.getElementById(`member${i}Items`).getElementsByClassName('row')).map(row => {
            const inputs = row.getElementsByTagName('input');
            const item = inputs[0].value.trim();
            const quantity = parseInt(inputs[1].value);
            return [item, quantity];
        });

        const memberTotal = memberItems.reduce((total, [item, quantity]) => {
            return total + (itemPrices[item] * quantity);
        }, 0);

        members.push({
            name: memberName,
            items: memberItems,
            total: memberTotal
        });
    }

    const totalItemCost = itemList.reduce((total, [item, quantity, totalPrice]) => total + totalPrice, 0);
    const taxPerPerson = taxPrice / numMembers;
    const grandTotal = totalItemCost + taxPrice;

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    members.forEach(member => {
        const memberTotalWithTax = member.total + taxPerPerson;
        const memberDiv = document.createElement('div');
        memberDiv.classList.add('mt-3');

        const itemListHtml = member.items.map(([item, quantity]) => {
            const itemPrice = itemPrices[item].toFixed(2);
            return `${item} (${quantity} @ RM${itemPrice})`;
        }).join(', ');

        memberDiv.innerHTML = `
            <h4>${member.name}</h4>
            <p>Items: ${itemListHtml}</p>
            <p> Tax (Per Person): RM${taxPerPerson.toFixed(2)}</p>
            <p>Total: RM${memberTotalWithTax.toFixed(2)}</p>
        `;

        resultDiv.appendChild(memberDiv);
    });

    const totalDiv = document.createElement('div');
    totalDiv.classList.add('mt-3');
    totalDiv.innerHTML = `
        <h4>Grand Total</h4>
        <p>Total Cost of Items: RM${totalItemCost.toFixed(2)}</p>
        <p>Tax: RM${taxPrice.toFixed(2)}</p>
        <p>Grand Total: RM${grandTotal.toFixed(2)}</p>
    `;

    resultDiv.appendChild(totalDiv);
}