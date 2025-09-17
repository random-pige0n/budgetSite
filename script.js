// Budget App JavaScript
class BudgetApp {
    constructor() {
        this.data = {
            income: [],
            expenses: [],
            categories: [],
            settings: {
                currency: '$',
                theme: 'light'
            }
        };
        
        this.init();
    }

    init() {
        this.loadData();
        this.updateDisplay();
        this.setupEventListeners();
        this.applyTheme();
    }

    // Data Management
    loadData() {
        const savedData = localStorage.getItem('budgetAppData');
        if (savedData) {
            this.data = { ...this.data, ...JSON.parse(savedData) };
        }
    }

    saveData() {
        localStorage.setItem('budgetAppData', JSON.stringify(this.data));
    }

    // Income Management
    addIncome() {
        const description = document.getElementById('incomeDescription').value.trim();
        const amount = parseFloat(document.getElementById('incomeAmount').value);

        if (!description || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid description and amount.');
            return;
        }

        const income = {
            id: Date.now(),
            description,
            amount,
            date: new Date().toISOString()
        };

        this.data.income.push(income);
        this.saveData();
        this.updateDisplay();
        this.clearInputs(['incomeDescription', 'incomeAmount']);
    }

    removeIncome(id) {
        this.data.income = this.data.income.filter(item => item.id !== id);
        this.saveData();
        this.updateDisplay();
    }

    // Expense Management
    addExpense() {
        const description = document.getElementById('expenseDescription').value.trim();
        const amount = parseFloat(document.getElementById('expenseAmount').value);

        if (!description || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid description and amount.');
            return;
        }

        const expense = {
            id: Date.now(),
            description,
            amount,
            date: new Date().toISOString()
        };

        this.data.expenses.push(expense);
        this.saveData();
        this.updateDisplay();
        this.clearInputs(['expenseDescription', 'expenseAmount']);
    }

    removeExpense(id) {
        this.data.expenses = this.data.expenses.filter(item => item.id !== id);
        this.saveData();
        this.updateDisplay();
    }

    // Category Management
    addCategory() {
        const name = document.getElementById('newCategory').value.trim();
        const budget = parseFloat(document.getElementById('categoryBudget').value);

        if (!name || isNaN(budget) || budget <= 0) {
            alert('Please enter a valid category name and budget amount.');
            return;
        }

        const category = {
            id: Date.now(),
            name,
            budget,
            spent: 0
        };

        this.data.categories.push(category);
        this.saveData();
        this.updateDisplay();
        this.clearInputs(['newCategory', 'categoryBudget']);
    }

    removeCategory(id) {
        this.data.categories = this.data.categories.filter(item => item.id !== id);
        this.saveData();
        this.updateDisplay();
    }

    // Calculations
    calculateTotalIncome() {
        return this.data.income.reduce((total, item) => total + item.amount, 0);
    }

    calculateTotalExpenses() {
        return this.data.expenses.reduce((total, item) => total + item.amount, 0);
    }

    calculateBalance() {
        return this.calculateTotalIncome() - this.calculateTotalExpenses();
    }

    // Display Updates
    updateDisplay() {
        this.updateIncomeDisplay();
        this.updateExpenseDisplay();
        this.updateCategoryDisplay();
        this.updateBalanceDisplay();
    }

    updateIncomeDisplay() {
        const incomeList = document.getElementById('incomeList');
        const totalIncome = document.getElementById('totalIncome');
        
        incomeList.innerHTML = '';
        this.data.income.forEach(item => {
            const itemElement = this.createItemElement(item, 'income');
            incomeList.appendChild(itemElement);
        });
        
        totalIncome.textContent = this.formatCurrency(this.calculateTotalIncome());
    }

    updateExpenseDisplay() {
        const expenseList = document.getElementById('expenseList');
        const totalExpenses = document.getElementById('totalExpenses');
        
        expenseList.innerHTML = '';
        this.data.expenses.forEach(item => {
            const itemElement = this.createItemElement(item, 'expense');
            expenseList.appendChild(itemElement);
        });
        
        totalExpenses.textContent = this.formatCurrency(this.calculateTotalExpenses());
    }

    updateCategoryDisplay() {
        const categoriesGrid = document.getElementById('categoriesGrid');
        categoriesGrid.innerHTML = '';
        
        this.data.categories.forEach(category => {
            const categoryElement = this.createCategoryElement(category);
            categoriesGrid.appendChild(categoryElement);
        });
    }

    updateBalanceDisplay() {
        const totalBalance = document.getElementById('totalBalance');
        const balance = this.calculateBalance();
        totalBalance.textContent = this.formatCurrency(balance);
        
        // Add visual indicator for positive/negative balance
        totalBalance.className = 'balance-amount';
        if (balance > 0) {
            totalBalance.style.color = 'var(--secondary-color)';
        } else if (balance < 0) {
            totalBalance.style.color = 'var(--danger-color)';
        } else {
            totalBalance.style.color = 'var(--text-color)';
        }
    }

    createItemElement(item, type) {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <span class="item-description">${item.description}</span>
            <span class="item-amount">${this.formatCurrency(item.amount)}</span>
            <div class="item-actions">
                <button class="btn-small" onclick="budgetApp.remove${type.charAt(0).toUpperCase() + type.slice(1)}(${item.id})">Remove</button>
            </div>
        `;
        return div;
    }

    createCategoryElement(category) {
        const div = document.createElement('div');
        div.className = 'category-card';
        div.innerHTML = `
            <div class="category-name">${category.name}</div>
            <div class="category-budget">Budget: ${this.formatCurrency(category.budget)}</div>
            <div class="category-budget">Spent: ${this.formatCurrency(category.spent)}</div>
            <div class="item-actions">
                <button class="btn-small" onclick="budgetApp.removeCategory(${category.id})">Remove</button>
            </div>
        `;
        return div;
    }

    // Utility Functions
    formatCurrency(amount) {
        return `${this.data.settings.currency}${amount.toFixed(2)}`;
    }

    clearInputs(inputIds) {
        inputIds.forEach(id => {
            document.getElementById(id).value = '';
        });
    }

    // Settings Management
    updateCurrency() {
        const currency = document.getElementById('currency').value;
        this.data.settings.currency = currency;
        this.saveData();
        this.updateDisplay();
    }

    changeTheme() {
        const theme = document.getElementById('theme').value;
        this.data.settings.theme = theme;
        this.saveData();
        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.data.settings.theme);
        document.getElementById('theme').value = this.data.settings.theme;
    }

    // Data Export/Import
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `budget-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        this.data = { ...this.data, ...importedData };
                        this.saveData();
                        this.updateDisplay();
                        this.applyTheme();
                        alert('Data imported successfully!');
                    } catch (error) {
                        alert('Error importing data. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            this.data = {
                income: [],
                expenses: [],
                categories: [],
                settings: this.data.settings
            };
            this.saveData();
            this.updateDisplay();
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Enter key support for inputs
        document.getElementById('incomeDescription').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('incomeAmount').focus();
            }
        });

        document.getElementById('incomeAmount').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addIncome();
            }
        });

        document.getElementById('expenseDescription').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('expenseAmount').focus();
            }
        });

        document.getElementById('expenseAmount').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addExpense();
            }
        });

        document.getElementById('newCategory').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('categoryBudget').focus();
            }
        });

        document.getElementById('categoryBudget').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addCategory();
            }
        });
    }
}

// Global functions for HTML onclick events
let budgetApp;

function addIncome() {
    budgetApp.addIncome();
}

function addExpense() {
    budgetApp.addExpense();
}

function addCategory() {
    budgetApp.addCategory();
}

function updateCurrency() {
    budgetApp.updateCurrency();
}

function changeTheme() {
    budgetApp.changeTheme();
}

function exportData() {
    budgetApp.exportData();
}

function importData() {
    budgetApp.importData();
}

function clearAllData() {
    budgetApp.clearAllData();
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    budgetApp = new BudgetApp();
});

// Configuration object for easy customization
const CONFIG = {
    // Add new input fields easily
    customFields: {
        // Example: Add a notes field
        // notes: {
        //     type: 'text',
        //     placeholder: 'Add notes...',
        //     section: 'income' // or 'expense'
        // }
    },
    
    // Add new categories easily
    defaultCategories: [
        { name: 'Housing', budget: 0 },
        { name: 'Food', budget: 0 },
        { name: 'Transportation', budget: 0 },
        { name: 'Entertainment', budget: 0 }
    ],
    
    // Customize validation rules
    validation: {
        minAmount: 0.01,
        maxAmount: 999999.99,
        maxDescriptionLength: 100
    },
    
    // Customize display options
    display: {
        showDates: true,
        showCategories: true,
        showBalanceHistory: false
    }
};

// Easy customization functions
function addCustomField(fieldName, fieldConfig) {
    CONFIG.customFields[fieldName] = fieldConfig;
    // Implementation would go here to dynamically add fields
}

function updateValidationRules(newRules) {
    Object.assign(CONFIG.validation, newRules);
}

function updateDisplayOptions(newOptions) {
    Object.assign(CONFIG.display, newOptions);
}