import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './App.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function App() {
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [statistics, setStatistics] = useState({ totalSalesAmount: 0, totalSoldItems: 0, totalNotSoldItems: 0 });
    const [priceRangeData, setPriceRangeData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('March');
    const [searchText, setSearchText] = useState('');
    const transactionsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                let apiUrl = 'http://localhost:5000/api/transactions';
                if (searchText) {
                    apiUrl += `?search=${encodeURIComponent(searchText)}`;
                } else {
                    apiUrl += `?month=${encodeURIComponent(selectedMonth)}`;
                }
                const response = await axios.get(apiUrl);
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchData();
    }, [selectedMonth, searchText]);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/statistics/${selectedMonth}`);
                setStatistics(response.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        const fetchPriceRangeData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/price-range/${selectedMonth}`);
                setPriceRangeData(response.data);
            } catch (error) {
                console.error('Error fetching price range data:', error);
            }
        };

        fetchStatistics();
        fetchPriceRangeData();
    }, [selectedMonth]);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleSearch = async () => {
        try {
            let apiUrl = 'http://localhost:5000/api/transactions';
            if (searchText) {
                apiUrl += `?search=${encodeURIComponent(searchText)}`;
            } else {
                apiUrl += `?month=${encodeURIComponent(selectedMonth)}`;
            }
            const response = await axios.get(apiUrl);
            setTransactions(response.data);
            setCurrentPage(0); // Reset page to first when search changes
        } catch (error) {
            console.error('Error fetching filtered transactions:', error);
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        if (!searchText) {
            return true; // Show all if search text is empty
        }

        const searchLower = searchText.toLowerCase();
        const titleMatch = transaction.title.toLowerCase().includes(searchLower);
        const descriptionMatch = transaction.description.toLowerCase().includes(searchLower);
        const priceMatch = transaction.price.toString().includes(searchText); // Exact price match

        return titleMatch || descriptionMatch || priceMatch;
    });

    const offset = currentPage * transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(offset, offset + transactionsPerPage);
    const pageCount = Math.ceil(filteredTransactions.length / transactionsPerPage);

    const barChartData = {
        labels: priceRangeData.map(range => range.range),
        datasets: [
            {
                label: 'Number of Items',
                data: priceRangeData.map(range => range.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    return (
        <div className="App">
            <h1 className="black-theme">Transaction Details</h1>



            <div className="search-container">
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search by title, description, or price..."
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>${transaction.price.toFixed(2)}</td>
                            <td>{transaction.category}</td>
                            <td>{transaction.sold ? "Yes" : "No"}</td>
                            <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
            />

            <h1 className="black-theme">Product Transactions</h1>

            <div className='month'>
                <label htmlFor="month-select" className="black-theme">Select Month: </label>
                <select id="month-select" value={selectedMonth} onChange={handleMonthChange}>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>
            </div>

            <div className='stats'>
                <div className="statistics-box">
                    <h2 className="black-theme">Statistics for {selectedMonth}</h2>
                    <p>Total Sales Amount: ${statistics.totalSalesAmount.toFixed(2)}</p>
                    <p>Total Sold Items: {statistics.totalSoldItems}</p>
                    <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
                </div>

                <div className="chart-container">
                    <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
           
            <footer className="footer">
              <div className='base'>
                <div className='subBase'>
                <p>Developed by: Sairaj Gulve</p>
                <ul>
                  <li><a href='https://www.linkedin.com/in/sairaj-gulve-740914228/'>LinkedIn | </a></li>
                  <li><a href='https://github.com/SairajGulve09'>GitHub</a></li>
                </ul>
                </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
