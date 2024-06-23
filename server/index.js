const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const fetchTransactions = async () => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw new Error('Failed to fetch transactions');
    }
};

const filterTransactionsByMonth = (transactions, month) => {
    return transactions.filter(transaction => {
        const transactionMonth = new Date(transaction.dateOfSale).toLocaleString('default', { month: 'long' });
        return transactionMonth.toLowerCase() === month.toLowerCase();
    });
};

app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await fetchTransactions();
        const formattedTransactions = transactions.map(product => ({
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            image: product.image,
            sold: product.sold,
            dateOfSale: product.dateOfSale,
        }));
        res.json(formattedTransactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

app.get('/api/transactions/search', async (req, res) => {
    const searchText = req.query.search || '';
    try {
        const transactions = await fetchTransactions();
        const filteredTransactions = transactions.filter(transaction => {
            const searchLower = searchText.toLowerCase();
            const titleMatch = transaction.title.toLowerCase().includes(searchLower);
            const descriptionMatch = transaction.description.toLowerCase().includes(searchLower);
            const priceMatch = transaction.price.toString().includes(searchText); // Exact price match

            return titleMatch || descriptionMatch || priceMatch;
        });
        res.json(filteredTransactions);
    } catch (error) {
        console.error('Error searching transactions:', error);
        res.status(500).json({ message: 'Error searching transactions' });
    }
});

app.get('/api/statistics/:month', async (req, res) => {
    const month = req.params.month;
    try {
        const transactions = await fetchTransactions();
        const filteredTransactions = filterTransactionsByMonth(transactions, month);

        const totalSalesAmount = filteredTransactions.reduce((sum, transaction) => sum + (transaction.sold ? transaction.price : 0), 0);
        const totalSoldItems = filteredTransactions.filter(transaction => transaction.sold).length;
        const totalNotSoldItems = filteredTransactions.filter(transaction => !transaction.sold).length;

        res.json({
            totalSalesAmount,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        console.error(`Error fetching statistics for ${month}:`, error);
        res.status(500).json({ message: `Error fetching statistics for ${month}` });
    }
});

app.get('/api/price-range/:month', async (req, res) => {
    const month = req.params.month;
    try {
        const transactions = await fetchTransactions();
        const filteredTransactions = filterTransactionsByMonth(transactions, month);

        const priceRanges = [
            { range: '0-100', count: 0 },
            { range: '101-500', count: 0 },
            { range: '501-1000', count: 0 },
            { range: '1001-5000', count: 0 },
            { range: '5001-10000', count: 0 },
            { range: '10001+', count: 0 }
        ];

        filteredTransactions.forEach(transaction => {
            if (transaction.price <= 100) {
                priceRanges[0].count++;
            } else if (transaction.price <= 500) {
                priceRanges[1].count++;
            } else if (transaction.price <= 1000) {
                priceRanges[2].count++;
            } else if (transaction.price <= 5000) {
                priceRanges[3].count++;
            } else if (transaction.price <= 10000) {
                priceRanges[4].count++;
            } else {
                priceRanges[5].count++;
            }
        });

        res.json(priceRanges);
    } catch (error) {
        console.error(`Error fetching price range data for ${month}:`, error);
        res.status(500).json({ message: `Error fetching price range data for ${month}` });
    }
});

app.get('/api/pie-chart/:month', async (req, res) => {
    const month = req.params.month;
    try {
        const transactions = await fetchTransactions();
        const filteredTransactions = filterTransactionsByMonth(transactions, month);

        const categoryCounts = {};
        filteredTransactions.forEach(transaction => {
            if (transaction.category in categoryCounts) {
                categoryCounts[transaction.category]++;
            } else {
                categoryCounts[transaction.category] = 1;
            }
        });

        const pieChartData = Object.keys(categoryCounts).map(category => ({
            category,
            count: categoryCounts[category]
        }));

        res.json(pieChartData);
    } catch (error) {
        console.error(`Error fetching pie chart data for ${month}:`, error);
        res.status(500).json({ message: `Error fetching pie chart data for ${month}` });
    }
});

app.get('/api/combined-data/:month', async (req, res) => {
    const month = req.params.month;
    try {
        const [transactions, statistics, priceRange, pieChart] = await Promise.all([
            axios.get(`http://localhost:5000/api/transactions`),
            axios.get(`http://localhost:5000/api/statistics/${month}`),
            axios.get(`http://localhost:5000/api/price-range/${month}`),
            axios.get(`http://localhost:5000/api/pie-chart/${month}`)
        ]);

        res.json({
            transactions: transactions.data,
            statistics: statistics.data,
            priceRange: priceRange.data,
            pieChart: pieChart.data
        });
    } catch (error) {
        console.error(`Error fetching combined data for ${month}:`, error);
        res.status(500).json({ message: `Error fetching combined data for ${month}` });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
