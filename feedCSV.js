const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://feeds.feedburner.com/ndtvnews-world-news';
const outputFile = 'NewsFeeds.csv';

axios.get(url)
  .then(response => {
    const xml = response.data;
    const $ = cheerio.load(xml, { xmlMode: true });

    const items = $('item');
    const csvData = [];

    items.each((index, element) => {
      const title = $(element).find('title').text().trim();
      const link = $(element).find('link').text().trim();

      // Check if the link starts with "https://" or "http://" and exclude anchor links
      if (link && (link.startsWith('https://') || link.startsWith('http://')) && !link.includes('#')) {
        csvData.push([title, link]);
      }
    });

    // Convert data to CSV format
    const csvContent = csvData.map(row => row.join(',')).join('\n');

    // Write data to the CSV file
    fs.writeFile(outputFile, csvContent, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to CSV file:', err);
      } else {
        console.log('Data written to CSV file successfully!');
      }
    });
  })
  .catch(error => {
    console.error('Error fetching the RSS feed:', error);
  });
