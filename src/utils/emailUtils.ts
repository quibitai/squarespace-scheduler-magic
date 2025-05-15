
interface EmailData {
  to: string;
  subject: string;
  body: string;
}

// In a real application, this would send an actual email through a service
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  // This is a mock function that simulates sending an email
  console.log("Sending email:", emailData);
  
  // Simulate API call delay and success
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Email sent successfully!");
      resolve(true);
    }, 1500);
  });
};

export const generateConfirmationEmail = (
  name: string,
  date: string,
  time: string,
  email: string
): EmailData => {
  const subject = "Your Appointment Confirmation";
  const body = `
    Dear ${name},

    Thank you for booking an appointment with us.

    Appointment Details:
    Date: ${date}
    Time: ${time}

    If you need to cancel or reschedule your appointment, please contact us as soon as possible.

    Thank you,
    The Appointment Team
  `;

  return {
    to: email,
    subject,
    body,
  };
};
