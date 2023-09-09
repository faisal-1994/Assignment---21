const express = require("express");
const router = express.Router();

const controller = require("../controllers/TotalRevenue");

router.get('/sales/total-revenue', controller.revenue);
router.get('/sales/quantity-by-product', controller.quantityByProduct);
router.get('/sales/top-products', controller.topProducts);
router.get('/sales/average-price', controller.avgPrice);
router.get('/sales/revenue-by-month', controller.monthRevenue);
router.get('/sales/highest-quantity-sold', controller.highestQuantity);
router.get('/sales/department-salary-expense', controller.salaryExpense);