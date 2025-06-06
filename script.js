const entryForm = document.getElementById('entryForm');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeInput = document.getElementById('type');
    const entryList = document.getElementById('entryList');
    const totalIncomeEl = document.getElementById('totalIncome');
    const totalExpenseEl = document.getElementById('totalExpense');
    const netBalanceEl = document.getElementById('netBalance');
    const resetBtn = document.getElementById('resetBtn');

    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    let editIndex = null;

    function updateStorage() {
      localStorage.setItem('entries', JSON.stringify(entries));
    }

    function calculateTotals() {
      const income = entries.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
      const expense = entries.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
      totalIncomeEl.textContent = income;
      totalExpenseEl.textContent = expense;
      netBalanceEl.textContent = income - expense;
    }

    function renderEntries(filter = 'all') {
      entryList.innerHTML = '';
      const filtered = filter === 'all' ? entries : entries.filter(e => e.type === filter);
      filtered.forEach((entry, index) => {
        const li = document.createElement('li');
        li.className = `flex justify-between items-center p-2 border rounded ${entry.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`;
        li.innerHTML = `
          <div>
            <p class="font-medium">${entry.description}</p>
            <p>₹${entry.amount}</p>
          </div>
          <div class="space-x-2">
            <button onclick="editEntry(${index})" class="bg-yellow-400 px-2 py-1 rounded">Edit</button>
            <button onclick="deleteEntry(${index})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </div>
        `;
        entryList.appendChild(li);
      });
      calculateTotals();
    }

    entryForm.onsubmit = (e) => {
      e.preventDefault();
      const description = descriptionInput.value.trim();
      const amount = parseFloat(amountInput.value);
      const type = typeInput.value;
      if (!description || isNaN(amount)) return;
      const newEntry = { description, amount, type };

      if (editIndex !== null) {
        entries[editIndex] = newEntry;
        editIndex = null;
      } else {
        entries.push(newEntry);
      }
      updateStorage();
      renderEntries(document.querySelector('input[name="filter"]:checked').value);
      entryForm.reset();
    }

    function editEntry(index) {
      const entry = entries[index];
      descriptionInput.value = entry.description;
      amountInput.value = entry.amount;
      typeInput.value = entry.type;
      editIndex = index;
    }

    function deleteEntry(index) {
      entries.splice(index, 1);
      updateStorage();
      renderEntries(document.querySelector('input[name="filter"]:checked').value);
    }

    resetBtn.onclick = () => {
      entryForm.reset();
      editIndex = null;
    };

    document.querySelectorAll('input[name="filter"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        renderEntries(e.target.value);
      });
    });

    renderEntries();

