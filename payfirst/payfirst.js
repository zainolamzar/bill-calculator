function generateMemberInputs() {
    const numMembers = document.getElementById('numMembers').value;
    const memberNamesDiv = document.getElementById('memberNames');
    memberNamesDiv.innerHTML = '';
    for (let i = 0; i < numMembers; i++) {
        const memberDiv = document.createElement('div');
        memberDiv.classList.add('form-group');
        memberDiv.innerHTML = `
            <div class="row mb-1">
                <label class="col" for="member${i}">Name of Member ${i + 1}:</label>
                <input type="text" class="col form-control" id="member${i}" placeholder="Name of member ${i + 1}">
            </div>
            <div class="row" id="member${i}Items">
                <table class="col">
                    <tbody id="member${i}Items-tbody">
                        <tr>
                            <td>
                                <input type="text" class="form-control" placeholder="Item">
                            </td>
                            <td>
                                <input type="number" class="form-control" placeholder="Quantity" min="1">
                            </td>
                            <td>
                                <button class="btn btn-danger" onclick="removeItemRow(this)">-</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <button class="btn btn-success" onclick="addMemberItemRow(${i})">+</button>
            </div>
        `;
        memberNamesDiv.appendChild(memberDiv);
    }
}

function addItemRow() {
    const itemList = document.getElementById('itemList-tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>
                <input type="text" class="form-control" placeholder="Item">
            </td>
            <td>
                <input type="number" class="form-control" placeholder="Quantity" min="1">
            </td>
            <td>
                <input type="number" class="form-control" placeholder="Total Price" min="0">
            </td>
            <td>
                <button class="btn btn-danger" onclick="removeItemRow(this)">-</button>
            </td>
    `;
    itemList.appendChild(row);
}

function removeItemRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

function addMemberItemRow(memberIndex) {
    const memberItemsDiv = document.getElementById(`member${memberIndex}Items-tbody`);
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <input type="text" class="form-control" placeholder="Item">
        </td>
        <td>
            <input type="number" class="form-control" placeholder="Quantity" min="1">
        </td>
        <td>
            <button class="btn btn-danger" onclick="removeItemRow(this)">-</button>
        </td>
    `;
    memberItemsDiv.appendChild(row);
}

function calculateBill() {
    const itemList = Array.from(document.getElementById('itemList-tbody').getElementsByTagName('tr')).map(row => {
        const cells = row.getElementsByTagName('td');
        const item = cells[0].querySelector('input').value.trim();
        const quantity = parseInt(cells[1].querySelector('input').value);
        const totalPrice = parseFloat(cells[2].querySelector('input').value);
        return [item, quantity, totalPrice];
    });

    const itemPrices = {};
    itemList.forEach(([item, quantity, totalPrice]) => {
        itemPrices[item] = totalPrice / quantity;
    });

    const taxPrice = parseFloat(document.getElementById('taxPrice').value);
    const numMembers = document.getElementById('numMembers').value;

    const members = [];
    for (let i = 0; i < numMembers; i++) {
        const memberName = document.getElementById(`member${i}`).value;
        const memberItems = Array.from(document.getElementById(`member${i}Items-tbody`).getElementsByTagName('tr')).map(row => {
            const cells = row.getElementsByTagName('td');
            const item = cells[0].querySelector('input').value.trim();
            const quantity = parseInt(cells[1].querySelector('input').value);
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
    resultDiv.innerHTML = `
    `;

    members.forEach(member => {
        const memberTotalWithTax = member.total + taxPerPerson;
        const memberDiv = document.createElement('div');
        memberDiv.classList.add('mt-3');
        memberDiv.classList.add('d-flex');
        memberDiv.classList.add('justify-content-center');

        const itemListHtml = member.items.map(([item, quantity]) => {
            const itemPrice = itemPrices[item].toFixed(2);
            return `${item}(${quantity}) = RM${itemPrice})`;
        }).join(', ');

        memberDiv.innerHTML = `
            <table class="text-center">
                <thead>
                    <tr class="table-dark">
                        <td><strong>Name</strong></td>
                        <td><strong>Item(s)</strong></td>
                        <td><strong>Tax Per Person<br>(RM)</strong></td>
                        <td><strong>Price Per Person<br>(RM)</strong></td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <p><strong>${member.name}</strong></p>
                        </td>
                        <td>
                            <p>${itemListHtml}</p>
                        </td>
                        <td>
                            <p>${taxPerPerson.toFixed(2)}</p>
                        </td>
                        <td>
                            <p>${memberTotalWithTax.toFixed(2)}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;

        resultDiv.appendChild(memberDiv);
    });

    const totalDiv = document.createElement('div');
    totalDiv.classList.add('mt-3');
    totalDiv.innerHTML = `
        <h4 class="text-center">Grand Total</h4>
        <table class="text-center d-flex justify-content-center">
            <tbody>
                <tr>
                    <td class="table-dark">
                        <p><strong>Total Cost of<br>Items</strong></p>
                    </td>
                    <td>
                        <p>RM${totalItemCost.toFixed(2)}</p>
                    </td>
                </tr>
                <tr>
                    <td class="table-dark">
                        <p><strong>Tax</strong></p>
                    </td>
                    <td>
                        <p>RM${taxPrice.toFixed(2)}</p>
                    </td>
                </tr>
                <tr>
                    <td class="table-dark">
                        <p><strong>Grand Total</strong></p>
                    </td>
                    <td>
                        <p>RM${grandTotal.toFixed(2)}</p>
                    </td>
                </tr>
            </tbody>
        </table>
        <div id="snapshotDiv" class="d-flex justify-content-center">
            <button type="button" class="btn btn-success mt-3" id="snapshotBtn" onClick="snapshotFunc()">
                <i class="fas fa-camera"></i> Capture & Share
            </button>
        </div>
    `;

    resultDiv.appendChild(totalDiv);

    document.getElementById('secondpart').style.display = 'none';

    document.getElementById('thirdpart').scrollIntoView({
        behavior: 'smooth'
    });
}

function nextSecond() {
    document.getElementById('firstpart').style.display = 'none';

    document.getElementById('secondpart').style.display = 'block';
    
    document.getElementById('secondpart').scrollIntoView({
        behavior: 'smooth'
    });
}

function prevFirst() {
    document.getElementById('secondpart').style.display = 'none';

    document.getElementById('firstpart').style.display = 'block';

    document.getElementById('firstpart').scrollIntoView({
        behavior: 'smooth'
    });
}

function snapshotFunc() {
        html2canvas(document.getElementById('result')).then(canvas => {
            // Convert the canvas to a data URL
            const imgData = canvas.toDataURL('image/png');
            
            // Create an anchor element to trigger the download
            const downloadLink = document.createElement('a');
            downloadLink.href = imgData;
            downloadLink.download = `payfirst.png`;
            downloadLink.click();
    
            // Optionally use the Web Share API to share the image
            if (navigator.share) {
                canvas.toBlob(blob => {
                    const file = new File([blob], 'payfirst.png', { type: 'image/png' });
                    navigator.share({
                        title: 'My Capture',
                        text: 'Check out this snapshot!',
                        files: [file]
                    }).then(() => {
                        console.log('Successfully shared');
                    }).catch(error => {
                        console.error('Error sharing:', error);
                    });
                });
            } else {
                alert('Your browser does not support the Web Share API');
            }
        }).catch(error => {
            console.error('Error capturing the div: ', error);
        });
}