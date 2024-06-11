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
                    <textarea class="form-control bill-label" id="billLabel${billCount}" rows="1" placeholder="Water"></textarea>
                </div>
            </td>
            <td>
                <div class="form-group">
                    <textarea class="form-control bill-amount" id="billAmount${billCount}" rows="1" placeholder="990.90"></textarea>
                </div>
            </td>
            <td>
                <div class="form-group">
                    <button type="button" class="btn btn-danger btn-delete">
                        <i class="fa-solid fa-eraser"></i>
                    </button>
                </div>
            </td>
        `;
        billsContainer.appendChild(newBillRow);
    });

    clearAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.bill-label').forEach(input => input.value = ''); // Clear all bill labels
        document.querySelectorAll('.bill-amount').forEach(input => input.value = ''); // Clear all bill amounts
    });

    const form = document.getElementById('billForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const members = parseFloat(document.getElementById('members').value);
        const month = document.getElementById('month').value;
        const year = document.getElementById('year').value;
        const billLabels = document.querySelectorAll('.bill-label');
        const billAmounts = document.querySelectorAll('.bill-amount');

        if (isNaN(members)) {
            alert('Enter a valid number for members.');
            return;
        }

        if (!month) {
            alert('Select a month.');
            return;
        }

        if (!year) {
            alert('Enter a year.');
            return;
        }

        let totalBill = 0;
        let billsByRow = '';

        billLabels.forEach((label, index) => {
            const amount = parseFloat(billAmounts[index].value);
            if (!isNaN(amount)) {
                totalBill += amount;
                billsByRow += `
                    <tr>
                        <td><p>${label.value}</p></td>
                        <td><p>${(amount/members).toFixed(2)}</p></td>
                        <td><p>${amount.toFixed(2)}</p></td>
                    </tr>
                `;
            }
        });

        if (billsByRow === '') {
            alert('Enter at least one valid bill amount.');
            return;
        }

        document.getElementById('result').innerHTML = `
            <div class="result-detail" id="result-detail">
                <h3 class="result-header text-center"><strong>BILL ${month.toUpperCase()} ${year}</strong></h3>
                <div class="result-amount mb-2 d-flex justify-content-center">
                    <table>
                        <tbody>
                            <tr class="table-primary">
                                <td class="px-3">
                                    <i class="fa-solid fa-users"></i>
                                </td>
                                <td class="px-3">
                                    <p class="m-2"><strong>RM${totalBill.toFixed(2)}</strong></p>
                                </td>
                            </tr>
                            <tr class="table-success">
                                <td class="px-3">
                                    <i class="fa-solid fa-user"></i>
                                </td>
                                <td class="px-3">
                                    <p class="m-2"><strong>RM${(totalBill / members).toFixed(2)}</strong></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="result-more">
                    <table class="table table-hover text-center">
                        <thead>
                            <tr>
                                <td>
                                    <p><strong>LABEL</strong></p>
                                </td>
                                <td>
                                    <p><strong>PER PERSON<br>(RM)</strong></p>
                                </td>
                                <td>
                                    <p><strong>SUBTOTAL<br>(RM)</strong></p>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            ${billsByRow}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Show the snapshot button after displaying the result
        document.getElementById('snapshotBtn').style.display = 'block';

        // Scroll to the result div
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('snapshotBtn').addEventListener('click', () => {
        html2canvas(document.getElementById('result-detail')).then(canvas => {
            // Convert the canvas to a data URL
            const imgData = canvas.toDataURL('image/png');
            
            // Create an anchor element to trigger the download
            const downloadLink = document.createElement('a');
            downloadLink.href = imgData;
            downloadLink.download = 'capture.png';
            downloadLink.click();
    
            // Optionally use the Web Share API to share the image
            if (navigator.share) {
                canvas.toBlob(blob => {
                    const file = new File([blob], 'capture.png', { type: 'image/png' });
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
    });

    // Add event listener for delete buttons
    document.addEventListener('click', event => {
        if (event.target.classList.contains('btn-delete')) {
            event.target.closest('tr').remove(); // Remove the closest row containing the delete button
        }
    });

});