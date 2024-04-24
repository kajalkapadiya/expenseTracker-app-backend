const Razorpay = require("razorpay");
const Order = require("../models/orders");
const userController = require("./userController");

const purchasepremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: "rzp_test_kjNFH57rbgoybt",
      key_secret: "KP2u3gZzrNp6M1vmioYE6IJB",
    });
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Sometghing went wrong", error: err });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } }); //2

    // Check if payment_id exists, if not, mark the transaction as failed
    if (!payment_id) {
      await order.update({ status: "FAIL" });
      console.log("Payment failed. Order status updated to FAIL");
      return res
        .status(400)
        .json({ success: false, message: "Transaction Failed" });
    }
    const promise1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = req.user.update({ ispremiumuser: true });

    Promise.all([promise1, promise2])
      .then(() => {
        return res.status(202).json({
          sucess: true,
          message: "Transaction Successful",
          token: userController.generateAccessToken(userId, true),
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ errpr: err, message: "Sometghing went wrong" });
  }
};

module.exports = {
  purchasepremium,
  updateTransactionStatus,
};
