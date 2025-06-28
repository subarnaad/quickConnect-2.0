const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body;

    // Ensure price is a string with exactly two decimal places
    const formattedPrice = parseFloat(coursePricing).toFixed(2).toString();

    if (isNaN(formattedPrice) || parseFloat(formattedPrice) <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course pricing value" });
    }

    // Check if FRONTEND_URL is properly configured
    if (!process.env.FRONTEND_URL) {
      console.error("FRONTEND_URL is not configured in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Construct URLs using FRONTEND_URL
    const baseUrl = process.env.FRONTEND_URL.trim().replace(/\/$/, "");
    const returnUrl = `${baseUrl}/payment-return`;
    const cancelUrl = `${baseUrl}/payment-cancel`;

    // Log URLs for debugging
    console.log("Base URL:", baseUrl);
    console.log("Return URL:", returnUrl);
    console.log("Cancel URL:", cancelUrl);

    const create_payment_json = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: courseTitle,
                sku: String(courseId),
                price: formattedPrice,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: { currency: "USD", total: formattedPrice },
          description: courseTitle,
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error(
          "PayPal Payment Creation Error:",
          error.response?.data || error.response || error
        );
        return res.status(500).json({
          success: false,
          message: "Error while creating PayPal payment!",
          errorDetails: error.response?.data || error.response || error.message,
        });
      }

      const approvalLink = paymentInfo.links?.find(
        (link) => link.rel === "approval_url"
      );
      if (!approvalLink) {
        return res.status(500).json({
          success: false,
          message: "PayPal approval URL not found!",
        });
      }

      const newlyCreatedCourseOrder = new Order({
        userId,
        userName,
        userEmail,
        orderStatus,
        paymentMethod,
        paymentStatus,
        orderDate: new Date(),
        instructorId,
        instructorName,
        courseImage,
        courseTitle,
        courseId,
        coursePricing: formattedPrice,
      });

      await newlyCreatedCourseOrder.save();

      res.status(201).json({
        success: true,
        data: {
          approveUrl: approvalLink.href,
          orderId: newlyCreatedCourseOrder._id,
        },
      });
    });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the order.",
      error: err.message,
    });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    if (!paymentId || !payerId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment information",
      });
    }

    let order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found!" });
    }

    // Execute the PayPal payment
    paypal.payment.execute(
      paymentId,
      { payer_id: payerId },
      async (error, payment) => {
        if (error) {
          console.error(
            "PayPal Payment Execution Error:",
            error.response?.data || error.response || error
          );
          return res.status(500).json({
            success: false,
            message: "Error while capturing PayPal payment!",
            errorDetails:
              error.response?.data || error.response || error.message,
          });
        }

        try {
          // Update order status
          order.paymentStatus = "paid";
          order.orderStatus = "confirmed";
          order.paymentId = paymentId;
          order.payerId = payerId;
          order.orderDate = new Date();
          await order.save();

          // Check if the student already has a course list
          let studentCourses = await StudentCourses.findOne({
            userId: order.userId,
          });

          const courseData = {
            courseId: order.courseId,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: order.orderDate,
            courseImage: order.courseImage,
          };

          if (studentCourses) {
            if (!Array.isArray(studentCourses.courses)) {
              studentCourses.courses = [];
            }
            studentCourses.courses.push(courseData);
            await studentCourses.save();
          } else {
            const newStudentCourses = new StudentCourses({
              userId: order.userId,
              courses: [courseData],
            });
            await newStudentCourses.save();
          }

          // Update the course schema to add the student
          await Course.findByIdAndUpdate(order.courseId, {
            $addToSet: {
              students: {
                studentId: order.userId,
                studentName: order.userName,
                studentEmail: order.userEmail,
                paidAmount: order.coursePricing,
              },
            },
          });

          res.status(200).json({
            success: true,
            message: "Order confirmed successfully!",
            data: order,
          });
        } catch (saveError) {
          console.error("Database Update Error:", saveError);
          return res.status(500).json({
            success: false,
            message: "Error while updating order details",
            error: saveError.message,
          });
        }
      }
    );
  } catch (err) {
    console.error("Capture Payment Error:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while capturing the payment.",
      error: err.message,
    });
  }
};

module.exports = { createOrder, capturePaymentAndFinalizeOrder };
