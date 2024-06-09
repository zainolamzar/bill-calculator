document.addEventListener('DOMContentLoaded', () => {
    console.log('Ready to code!');

    let billCount = 1;
    const billsContainer = document.getElementById('billsContainer');
    const addBillBtn = document.getElementById('addBillBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');

    addBillBtn.addEventListener('click', () => {
        billCount++;
        const newBillRow = document.createElement('tr');
        newBillRow.innerHTML = `
            <td>
                <div class="form-group">
                    <textarea class="form-control bill-label" id="billLabel${billCount}" rows="1" placeholder="eg: Water"></textarea>
                </div>
            </td>
            <td>
                <div class="form-group">
                    <textarea class="form-control bill-amount" id="billAmount${billCount}" rows="1" placeholder="eg: 990.90"></textarea>
                </div>
            </td>
            <td>
                <div class="form-group">
                    <button type="button" class="btn btn-danger btn-delete">Delete</button>
                </div>
            </td>
        `;
        billsContainer.appendChild(newBillRow);
    });

    clearAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.bill-label').forEach(input => input.value = ''); // Clear all labels
        document.querySelectorAll('.bill-amount').forEach(input => input.value = ''); // Clear all amounts
    });

    const form = document.getElementById('billForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const members = parseFloat(document.getElementById('members').value);
        const billLabels = document.querySelectorAll('.bill-label');
        const billAmounts = document.querySelectorAll('.bill-amount');

        if (isNaN(members)) {
            alert('Enter a valid number for members.');
            return;
        }

        let totalBill = 0;
        let billsSummary = '';

        billLabels.forEach((label, index) => {
            const amount = parseFloat(billAmounts[index].value);
            if (!isNaN(amount)) {
                totalBill += amount;
                billsSummary += `<li>${label.value}: RM${amount.toFixed(2)}</li>`;
            }
        });

        if (billsSummary === '') {
            alert('Enter at least one valid bill amount.');
            return;
        }

        document.getElementById('result').innerHTML = `
            <div class="alert alert-success">
                <h4>SUMMARY:</h4>
                <ul>${billsSummary}</ul>
                <p><strong>Total Bill Amount:</strong> RM${totalBill.toFixed(2)}</p>
                <p><strong>Average per Member:</strong> RM${(totalBill / members).toFixed(2)}</p>
            </div>
        `;
    });

    // Add event listener for delete buttons
    document.addEventListener('click', event => {
        if (event.target.classList.contains('btn-delete')) {
            event.target.closest('tr').remove(); // Remove the closest row containing the delete button
        }
    });
});