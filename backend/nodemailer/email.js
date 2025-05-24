const nodemailer = require("nodemailer");
require("dotenv").config();
const {
  emailVerficationTemplate,
  welcomeEmailTemplate,
} = require("./email-template");

const transporter = nodemailer.createTransport({
  service: "gmail", // Or use your email provider's SMTP service
  auth: {
    user: process.env.SMTP_EMAIL, // Your email address
    pass: process.env.SMTP_PASSWORD, // App password or email password
  },
});

// Utility function to send verification email
exports.sendVerificationEmail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: `"Pyro Team" <${process.env.SMTP_EMAIL}>`, // Sender's email address
      to: email, // Recipient's email address
      subject: "Verify Your Email Address",
      html: emailVerficationTemplate.replace(
        "{verificationToken}",
        verificationToken
      ),
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error("Failed to send verification email.");
  }
};

exports.sendWelcomeEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: `"Pyro Team" <${process.env.SMTP_EMAIL}>`, // Sender's email address
      to: email, // Recipient's email address
      subject: "Welcome to Pyro",
      html: welcomeEmailTemplate.replace("{firstName}", firstName),
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {}
};

exports.sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const mailOptions = {
      from: `"Pyro Team" <${process.env.SMTP_EMAIL}>`, // Sender's email address
      to: email, // Recipient's email address
      subject: "Reset your password",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {}
};

exports.sendResetSuccessEmail = async (email) => {
  try {
    const mailOptions = {
      from: `"Pyro Team" <${process.env.SMTP_EMAIL}>`, // Sender's email address
      to: email, // Recipient's email address
      subject: "Password reset was successfull",
      html: `<p>your password has been reset successfully</p>`,
    };
  } catch (error) {
    console.error("Error sending reset success email", error);
  }
};

exports.sendOrderConfirmationEmail = async (email, cartItems) => {
  try {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.discountedPrice,
      0
    );

    const itemList = cartItems
      .map(
        (item) =>
          `<li><strong>${item.name}</strong> - ₹${item.discountedPrice}</li>`
      )
      .join("");

    const mailOptions = {
      from: `"Pyro Team" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Your Order is Confirmed!",
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Here is a summary of your order placed on ${new Date().toLocaleDateString()}:</p>
        <ul>${itemList}</ul>
        <p><strong>Total: ₹${subtotal.toFixed(2)}</strong></p>
        <p>We'll notify you once your order is shipped.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw new Error("Failed to send order confirmation email.");
  }
};
