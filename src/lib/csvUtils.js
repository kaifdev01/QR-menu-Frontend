// CSV parsing and generation utilities

export const downloadSampleCSV = () => {
  const sampleData = [
    ['name', 'description', 'price', 'category'],
    ['Margherita Pizza', 'Fresh mozzarella and basil', '12.99', 'Main Course'],
    ['Caesar Salad', 'Crisp romaine with parmesan', '8.99', 'Appetizers'],
    ['Chocolate Cake', 'Rich chocolate dessert', '6.99', 'Desserts'],
    ['Iced Tea', 'Refreshing cold tea', '3.99', 'Drinks'],
  ];

  const csv = sampleData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'menu-items-sample.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          reject(new Error('CSV must have header and at least one data row'));
          return;
        }

        const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
        const requiredHeaders = ['name', 'price', 'category'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

        if (missingHeaders.length > 0) {
          reject(new Error(`Missing required columns: ${missingHeaders.join(', ')}`));
          return;
        }

        const items = [];
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          if (values.length === 0) continue;

          const item = {};
          headers.forEach((header, index) => {
            item[header] = values[index]?.trim() || '';
          });

          // Validate required fields
          if (!item.name || !item.price || !item.category) {
            reject(new Error(`Row ${i + 1}: Missing required fields (name, price, category)`));
            return;
          }

          // Validate price is a number
          if (isNaN(parseFloat(item.price))) {
            reject(new Error(`Row ${i + 1}: Price must be a valid number`));
            return;
          }

          items.push({
            name: item.name,
            description: item.description || '',
            price: parseFloat(item.price),
            category: item.category,
            image: ''
          });
        }

        if (items.length === 0) {
          reject(new Error('No valid items found in CSV'));
          return;
        }

        resolve(items);
      } catch (error) {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Helper function to parse CSV line handling quoted values
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
};
