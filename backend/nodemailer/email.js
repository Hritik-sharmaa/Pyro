const nodemailer = require("nodemailer");
require("dotenv").config();
const {
  emailVerficationTemplate,
  welcomeEmailTemplate,
} = require("./email-template");

// Two ways to send mail, chosen from the environment:
//  1. RESEND_API_KEY set -> Resend over HTTPS (port 443). Works on every host,
//     including ones that block outbound SMTP (Render free tier, Railway, ...).
//  2. otherwise          -> SMTP through nodemailer. Gmail by default (needs an
//     App Password); set SMTP_HOST/SMTP_PORT to use another provider.
// EMAIL_FROM optionally overrides the sender address.

let resendClient = null;
let transporter = null;

const getResend = () => {
  if (!resendClient) {
    const { Resend } = require("resend");
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

const getTransporter = () => {
  if (!transporter) {
    const timeouts = {
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    };
    const auth = {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    };
    transporter = process.env.SMTP_HOST
      ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth,
          ...timeouts,
        })
      : nodemailer.createTransport({ service: "gmail", auth, ...timeouts });
  }
  return transporter;
};

const fromAddress = () => {
  if (process.env.EMAIL_FROM) return process.env.EMAIL_FROM;
  if (process.env.RESEND_API_KEY) return "Pyro Team <onboarding@resend.dev>";
  return `"Pyro Team" <${process.env.SMTP_EMAIL}>`;
};

const sendMail = async ({ to, subject, html }) => {
  if (process.env.RESEND_API_KEY) {
    const { error } = await getResend().emails.send({
      from: fromAddress(),
      to,
      subject,
      html,
    });
    if (error) throw new Error(error.message || "Resend rejected the email");
    return;
  }
  await getTransporter().sendMail({ from: fromAddress(), to, subject, html });
};

// Utility function to send verification email
exports.sendVerificationEmail = async (email, verificationToken) => {
  try {
    await sendMail({
      to: email,
      subject: "Verify Your Email Address",
      html: emailVerficationTemplate.replace(
        "{verificationToken}",
        verificationToken
      ),
    });
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error("Failed to send verification email.");
  }
};

exports.sendWelcomeEmail = async (email, firstName) => {
  try {
    await sendMail({
      to: email,
      subject: "Welcome to Pyro",
      html: welcomeEmailTemplate.replace("{firstName}", firstName),
    });
    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email", error);
  }
};

exports.sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    await sendMail({
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email", error);
  }
};

exports.sendResetSuccessEmail = async (email) => {
  try {
    await sendMail({
      to: email,
      subject: "Password reset was successfull",
      html: `<p>your password has been reset successfully</p>`,
    });
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

    await sendMail({
      to: email,
      subject: "Your Order is Confirmed!",
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Here is a summary of your order placed on ${new Date().toLocaleDateString()}:</p>
        <ul>${itemList}</ul>
        <p><strong>Total: ₹${subtotal.toFixed(2)}</strong></p>
        <p>We'll notify you once your order is shipped.</p>
      `,
    });
    console.log("Order confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw new Error("Failed to send order confirmation email.");
  }
};
