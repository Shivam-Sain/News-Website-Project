document.addEventListener('DOMContentLoaded', function() {
  const apiKey = 'bebaf189f40146639aa62fd20072b100'; // Replace with your actual API key
  const newsContainer = document.getElementById('news-container');
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const refreshButton = document.getElementById('refresh-button');
  const spinner = document.getElementById('spinner'); // Spinner element
  let currentQuery = ''; // To keep track of the current search query

  // Function to show or hide the spinner
  function toggleSpinner(show) {
      spinner.style.display = show ? 'block' : 'none';
  }

  // Function to fetch news articles
  function fetchNews(query = '') {
      toggleSpinner(true); // Show spinner
      const url = `https://newsapi.org/v2/top-headlines?country=us&q=${encodeURIComponent(query)}&apiKey=${apiKey}`;
      fetch(url)
          .then(response => response.json())
          .then(data => {
              const articles = data.articles;
              newsContainer.innerHTML = ''; // Clear previous articles
              if (articles.length === 0) {
                  newsContainer.innerHTML = '<p class="text-center">No articles found.</p>';
              } else {
                  articles.forEach(article => {
                      const col = document.createElement('div');
                      col.className = 'col-md-4 mb-4';
                      col.innerHTML = `
                          <div class="card news-card">
                              <img src="${article.urlToImage || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${article.title}">
                              <div class="card-body">
                                  <h5 class="card-title">${article.title}</h5>
                                  <p class="card-text">${article.description || 'No description available'}</p>
                                  <a href="${article.url}" class="btn btn-primary" target="_blank">Read more</a>
                              </div>
                          </div>
                      `;
                      newsContainer.appendChild(col);
                  });
              }
          })
          .catch(error => {
              console.error('Error fetching news:', error);
              newsContainer.innerHTML = '<p class="text-center text-danger">Error fetching news. Please try again later.</p>';
          })
          .finally(() => toggleSpinner(false)); // Hide spinner
  }

  // Initial fetch for default news
  fetchNews();

  // Event listener for search button
  searchButton.addEventListener('click', function() {
      currentQuery = searchInput.value.trim();
      fetchNews(currentQuery);
  });

  // Event listener for Enter key in search input
  searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          searchButton.click();
      }
  });

  // Debounce function to delay search input handling
  function debounce(func, wait) {
      let timeout;
      return function(...args) {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(this, args), wait);
      };
  }

  // Debounced search input
  const handleSearchInput = debounce(function() {
      currentQuery = searchInput.value.trim();
      fetchNews(currentQuery);
  }, 300); // Wait 300ms after user stops typing

  searchInput.addEventListener('input', handleSearchInput);

  // Refresh news feed every minute (60000 milliseconds)
  setInterval(() => {
      fetchNews(currentQuery);
  }, 60000); // 60,000 milliseconds = 1 minute

  // Event listener for refresh button
  refreshButton.addEventListener('click', function() {
      fetchNews(currentQuery);
  });
});
