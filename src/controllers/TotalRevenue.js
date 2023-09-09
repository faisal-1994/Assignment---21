

const Sales = require('../model/SalesModel'); // Adjust the path as needed

// Calculate and return the total revenue
exports.revenue = async (req, res) => {
  try {
    const totalRevenue = await Sales.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
        },
      },
    ]);

    if (totalRevenue.length > 0) {
      res.json({ totalRevenue: totalRevenue[0].totalRevenue });
    } else {
      // Handle the case where there are no sales transactions
      res.json({ totalRevenue: 0 });
    }
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
};

 exports.quantityByProduct = async (req, res) => {
    try {
      const quantityByProduct = await Sales.aggregate([
        {
          $group: {
            _id: '$product',
            totalQuantity: { $sum: '$quantity' },
          },
        },
      ]);
  
      res.json(quantityByProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  };



 exports.topProducts = async (req, res) => {
    try {
      const topProducts = await Sales.aggregate([
        {
          $group: {
            _id: '$product',
            totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
          },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 5 },
      ]);
  
      res.json(topProducts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  };

exports.avgPrice = async (req, res) => {
    try {
      const averagePriceResult = await Sales.aggregate([
        {
          $group: {
            _id: null, // Group all documents into one group
            averagePrice: { $avg: '$price' }, // Calculate the average price
          },
        },
      ]);
  
      // Extract the averagePrice from the aggregation result
      const averagePrice = averagePriceResult[0].averagePrice;
  
      res.json({ averagePrice });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  }

  exports.monthRevenue = async (req, res) => {
    try {
      const revenueByMonth = await Sales.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$date' }, // Extract year from date field
              month: { $month: '$date' }, // Extract month from date field
            },
            totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
          },
        },
        {
          $project: {
            _id: 0, // Exclude _id field from the result
            year: '$_id.year',
            month: '$_id.month',
            totalRevenue: 1,
          },
        },
        {
          $sort: { year: 1, month: 1 }, // Sort by year and month
        },
      ]);
  
      res.json(revenueByMonth);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  }

  exports.highestQuantity = async (req, res) => {
    try {
      const highestQuantitySold = await Sales.aggregate([
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: '%Y-%m-%d', date: '$date' },
              },
            },
            maxQuantity: { $max: '$quantity' },
          },
        },
        {
          $sort: { maxQuantity: -1 },
        },
        {
          $limit: 1,
        },
      ]);
  
      if (highestQuantitySold.length === 0) {
        return res.status(404).json({ error: 'No data found' });
      }
  
      // Extract the date and quantity information
      const { _id: { date }, maxQuantity } = highestQuantitySold[0];
  
      // Find the product(s) with the highest quantity sold on the extracted date
      const highestQuantityProducts = await Sales.find({
        date: new Date(date),
        quantity: maxQuantity,
      }).select('product -_id');
  
      res.json(highestQuantityProducts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  }


  exports.salaryExpense = async (req, res) => {
    try {
      const departmentSalaryExpense = await Sales.aggregate([
        {
          $group: {
            _id: '$department', // Assuming 'department' is a field in your sales documents
            totalSalaryExpense: { $sum: { $multiply: ['$quantity', '$price'] } }, // Replace with the actual field representing salary expense
          },
        },
      ]);
      
      res.json(departmentSalaryExpense);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  }